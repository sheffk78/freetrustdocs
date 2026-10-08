// FreeTrustDocs — error reporting endpoint (Cloudflare Pages Function)
//
// POST /api/report-error
// Receives client-side error reports from /ftd-error-reporter.js, validates +
// dedupes them, then forwards to the Hermes error webhook
// (to-hook.agentictrust.app/webhooks/freetrustdocs-error) with an HMAC-SHA256
// signature so the gateway accepts it. The webhook spawns Kit, who
// investigates and fixes autonomously (same pattern as trustoffice-error /
// wingpoint-error).
//
// Secrets come from Pages env vars (Settings -> Environment variables):
//   FTD_ERR_WEBHOOK_SECRET  - shared HMAC secret (must match the Hermes
//                             subscription secret)
// Set for BOTH Production and Preview environments.

const HERMES_WEBHOOK_URL = "https://to-hook.agentictrust.app/webhooks/freetrustdocs-error";

// Known noise: browser extensions, ad blockers, crawlers, translate plugins.
// Never forwarded to the webhook (still accepted with 204 so the client
// doesn't retry).
const NOISE_PATTERNS = [
  "extension context invalidated",
  "runtime.sendMessage",
  "content script",
  "script error.",           // cross-origin mask without good details
  "adblock",
  "webRequest",
  "ResizeObserver loop",     // benign layout-loop warning, not user-facing
  "gtag is not defined",     // ad-blocked GA — site works fine without it
  "adsbygoogle",
  "googleadservices",
  "googlesyndication",
  "doubleclick",
  "cloudflareinsights",      // CF Web Analytics RUM beacon — blocked by privacy browsers (DuckDuckGo/Brave etc.), harmless
  "googletagmanager",        // ad-blocked GTM — site works fine without it
  "google-analytics",        // ad-blocked GA — site works fine without it
  // --- added FTD-002 follow-up (2026-10-08): analytics/ad network noise that
  // arrives as ResourceError "Failed to load script: <ad url>" or generic
  // network complaints from blocked/failed third-party beacons ---
  "googletagmanager.com",
  "google-analytics.com",
  "googleads.g.doubleclick",
  "connect.facebook.net",
  "facebook.net",
  "analytics.tiktok.com",
  "tr.snapchat.com",
  "clarity.ms",
  "hotjar",
  "hubspot",
  "scorecardresearch",
  "quantserve",
  "taboola",
  "outbrain",
  "criteo",
  "amazon-adsystem",
  "pubmatic",
  "rubiconproject",
  "openx.net",
  "casalemedia",
  "indexww",
  "prebid",
  "launchdarkly",
  "fullstory",
  // generic third-party fetch complaints (blocked beacons, offline switches)
  "failed to fetch",
  "load failed",
  "networkerror when attempting to fetch resource",
  "the internet connection appears to be offline",
  "the operation was aborted",
  "the user aborted a request",
  "a listener indicated an asynchronous response",
  "the message port closed",
  "object not found matching id",
];

// Any message that is mostly emoji garbage (observed spam from a broken
// browser translation extension) is dropped outright.

function isNoise(message) {
  if (!message) return false;
  const m = message.toLowerCase();
  if (NOISE_PATTERNS.some((p) => m.includes(p))) return true;
  // More emoji than letters/words => spam
  const emojiHits = m.match(/\p{Extended_Pictographic}/gu);
  if (emojiHits && emojiHits.length >= 3) return true;
  return false;
}

function hmacSha256Hex(secret, message) {
  return crypto.subtle
    .importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"])
    .then((key) => crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message)))
    .then((sig) => [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, "0")).join(""));
}

export async function onRequestPost({ request, env }) {
  const secret = env.FTD_ERR_WEBHOOK_SECRET;
  if (!secret) {
    return new Response(JSON.stringify({ ok: false, reason: "secret not configured" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ ok: false, reason: "invalid json" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const errorType = String(body.error_type || "unknown").slice(0, 120);
  const errorMessage = String(body.error_message || "").slice(0, 1500);
  const pagePath = String(body.page || "").slice(0, 300);
  const stack = String(body.stack || "").slice(0, 4000);
  const userAgent = request.headers.get("User-Agent") || "";
  const href = String(body.href || "").slice(0, 500);

  if (!errorMessage) {
    return new Response(JSON.stringify({ ok: false, reason: "empty message" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (isNoise(errorMessage) || isNoise(stack)) {
    // 204 responses must have a null body — a body here throws (CF 1101)
    return new Response(null, { status: 204 });
  }

  const payload = {
    error_type: errorType,
    error_message: errorMessage,
    location: href || pagePath,
    page: pagePath,
    failing_operation: errorType,
    stack: stack,
    user_agent: userAgent,
    source: "frontend",
    brand: "freetrustdocs",
  };

  const timestamp = Math.floor(Date.now() / 1000);
  const signature = await hmacSha256Hex(secret, `${timestamp}.${JSON.stringify(payload)}`);

  // 8s timeout so a slow gateway never holds the browser beacon hostage
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  try {
    const resp = await fetch(HERMES_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Webhook-Signature-V2": signature,
        "X-Webhook-Timestamp": String(timestamp),
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    clearTimeout(timer);
    return new Response(null, { status: 204 });
  } catch (err) {
    // Never block the user's page on alerting failures
    return new Response(null, { status: 204 });
  }
}

export async function onRequestGet() {
  return new Response(JSON.stringify({ ok: true, endpoint: "report-error" }), {
    headers: { "Content-Type": "application/json" },
  });
}