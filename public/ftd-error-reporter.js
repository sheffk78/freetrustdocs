// FreeTrustDocs — client-side error reporter
// Loaded from Base.astro on every page. Captures uncaught errors +
// unhandled promise rejections and POSTs them to /api/report-error (a
// Cloudflare Pages Function) which forwards to the Hermes error webhook.
// Kit investigates autonomously — same pattern as TrustOffice/WingPoint.
//
// Privacy: reports contain error message, stack, page URL, browser UA.
// No personal data, no document contents — nothing from the wizards.
(function () {
  "use strict";

  var ENDPOINT = "/api/report-error";
  var seen = {};          // fingerprint -> last sent timestamp
  var DEDUPE_MS = 5 * 60 * 1000; // 5 min window per fingerprint
  var sentCount = 0;      // hard cap per page load
  var MAX_SENT = 5;
  var queue = [];
  var flushTimer = null;

  function fingerprint(type, msg, page) {
    var raw = (type || "?") + "|" + (msg || "").slice(0, 120) + "|" + (page || "");
    var h = 0;
    for (var i = 0; i < raw.length; i++) {
      h = (h * 31 + raw.charCodeAt(i)) & 0x7fffffff;
    }
    return "fp" + h.toString(36);
  }

  function report(type, message, stack) {
    try {
      if (!message || sentCount >= MAX_SENT) return;
      var page = location.pathname;
      var fp = fingerprint(type, message, page);
      var now = Date.now();
      if (seen[fp] && now - seen[fp] < DEDUPE_MS) return;
      seen[fp] = now;
      sentCount++;

      queue.push({
        error_type: String(type || "Error").slice(0, 120),
        error_message: String(message).slice(0, 1500),
        stack: String(stack || "").slice(0, 4000),
        page: page,
        href: location.href.slice(0, 500),
        ts: new Date().toISOString(),
      });

      if (!flushTimer) flushTimer = setTimeout(flush, 1500); // small batch window
    } catch (e) {
      /* the reporter must never throw */
    }
  }

  function flush() {
    flushTimer = null;
    if (!queue.length) return;
    var batch = queue.splice(0, queue.length);
    // Each queued error POSTs individually (simplest server-side dedupe);
    // payloads are tiny. sendBeacon survives page unload.
    for (var i = 0; i < batch.length; i++) {
      var payload = batch[i];
      if (navigator.sendBeacon) {
        navigator.sendBeacon(ENDPOINT, new Blob([JSON.stringify(payload)], { type: "application/json" }));
      } else {
        fetch(ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          keepalive: true,
        }).catch(function () {});
      }
    }
  }

  // Uncaught JS errors
  window.addEventListener("error", function (evt) {
    // Script-load failures carry no message; give them one so they still report
    var msg = evt.message;
    var target = evt.target || evt.srcElement;
    if (!msg && target && (target.tagName === "SCRIPT" || target.tagName === "LINK")) {
      report("ResourceError", "Failed to load " + (target.tagName === "LINK" ? "stylesheet" : "script") + ": " + (target.src || target.href || "unknown"), "");
      return;
    }
    report("Error", msg, evt.error && evt.error.stack ? evt.error.stack : "");
  }, true);

  // Unhandled promise rejections
  window.addEventListener("unhandledrejection", function (evt) {
    var r = evt.reason;
    var msg = r && r.message ? r.message : String(r);
    var stack = r && r.stack ? r.stack : "";
    report("UnhandledRejection", msg, stack);
  });

  // Wizard-specific guard: pdfmake loads from CDN; if it never arrives we
  // report so the PDF download path being broken gets flagged immediately.
  window.addEventListener("ftd:pdf-lib-missing", function () {
    report("PdfLibMissing", "pdfmake library did not load — PDF generation unavailable", "");
  });

  // Expose for manual testing: window.__ftdTestError()
  window.__ftdTestError = function () {
    setTimeout(function () { throw new Error("FTD self-check test error (safe to ignore)"); }, 0);
  };
})();