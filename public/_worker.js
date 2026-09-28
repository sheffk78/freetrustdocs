// www -> apex 301 (SiteGuru wwwResolve high: both hosts served 200).
// _redirects can't match hostnames on Pages, so handle it here.
// Everything else falls through to static assets (includes _redirects pipeline).
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.hostname === "www.freetrustdocs.com") {
      const target = new URL(url.pathname + url.search, "https://freetrustdocs.com");
      return Response.redirect(target.toString(), 301);
    }
    return env.ASSETS.fetch(request);
  }
};