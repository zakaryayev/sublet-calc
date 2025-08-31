// cloudflare/worker.js
export default {
  async fetch(request) {
    const url = new URL(request.url);
    const prefix = '/sublet-calculator';

    // Normalize /sublet-calculator -> /sublet-calculator/
    if (url.pathname === prefix) {
      return Response.redirect(`${url.origin}${prefix}/`, 301);
    }

    // Only proxy paths under the prefix
    if (!url.pathname.startsWith(prefix)) {
      // Let non-prefixed traffic flow to origin untouched
      return fetch(request);
    }

    const backendHost = 'sublet-calc.vercel.app'; // <- your Vercel deployment host
    const target = new URL(`https://${backendHost}${url.pathname}${url.search}`);

    const newReq = new Request(target, request);
    newReq.headers.set('host', backendHost);

    const resp = await fetch(newReq);
    const headers = new Headers(resp.headers);
    // Optional header scrubbing if needed

    return new Response(resp.body, { status: resp.status, headers });
  }
};
