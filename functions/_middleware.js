// www -> apex 301 (SiteGuru wwwResolve high: both hosts served 200).
// _redirects cannot match hostnames on Pages, so handle it here.
//
// Root _middleware.js runs in front of EVERY request — static assets and
// Functions alike — so it must call next() for non-www hosts and serve
// nothing itself (CF docs: Pages Functions > Middleware).
//
// INCIDENT NOTE (FTD-002, 2026-10-08): commit 32bfc92 shipped public/_worker.js
// for this same redirect. Any dist/_worker.js puts the project into Pages
// "advanced mode", which silently ignores the entire functions/ directory —
// /api/report-error 404ed from Sep 29 to Oct 8. Keep _worker.js out of this
// repo; the deploy workflow fails the build if one appears in dist/.
// Full record: TrustMinutes/reports/FTD-INCIDENT-2026-10-08-report-error-404.md
export async function onRequest(context) {
  const url = new URL(context.request.url);
  if (url.hostname === "www.freetrustdocs.com") {
    const target = new URL(url.pathname + url.search, "https://freetrustdocs.com");
    return Response.redirect(target.toString(), 301);
  }
  return context.next();
}