/* POST /api/lead  - estimate form handler (Vercel Node function, zero dependencies)
 *
 * Every request is SAVED to the leads database when one is connected (see api/_store.js), and shows up in the
 * dashboard at /admin/. Email and webhook delivery below are optional extras on top of that.
 *
 * Configure in Vercel > Project > Settings > Environment Variables (at least one delivery route):
 *   KV_REST_API_URL + KV_REST_API_TOKEN   added automatically when you connect Upstash for Redis under Storage
 *   RESEND_API_KEY   API key from resend.com            (email delivery)
 *   LEAD_TO          where leads go, e.g. office@treeservicemadison.net
 *   LEAD_FROM        verified sender, e.g. "Website <leads@treeservicemadison.net>"
 *   LEAD_WEBHOOK_URL optional: Zapier / Make / Google Apps Script URL that receives the JSON
 *
 * If nothing is configured the function answers 503 and the page tells the visitor to call,
 * so a missing key can never silently swallow a lead.
 */
const store = require("./_store");

const SERVICES = [
  "Tree removal", "Tree trimming or pruning", "Stump grinding", "Stump removal",
  "Emergency or storm damage", "Not sure yet"
];

function clean(v, max) {
  return String(v == null ? "" : v).replace(/[\u0000-\u001F\u007F]+/g, " ").trim().slice(0, max);
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  const b = (req.body && typeof req.body === "object") ? req.body : {};
  const wantsJson = String(req.headers.accept || "").includes("application/json");
  const done = (code, payload) => {
    if (!wantsJson && code === 200) { res.setHeader("Location", "/thank-you/"); return res.status(303).end(); }
    return res.status(code).json(payload);
  };

  // Honeypot: real visitors never see or fill "company". Pretend success so bots move on.
  if (clean(b.company, 100)) { return done(200, { ok: true }); }

  const lead = {
    name: clean(b.name, 120),
    phone: clean(b.phone, 40),
    email: clean(b.email, 160),
    address: clean(b.address, 200),
    service: SERVICES.includes(b.service) ? b.service : "Not sure yet",
    details: clean(b.details, 3000),
    page: clean(b.page, 200),
    received: new Date().toISOString()
  };

  const digits = lead.phone.replace(/\D/g, "");
  if (!lead.name || digits.length < 10) {
    return done(422, { ok: false, error: "Name and a 10-digit phone number are required." });
  }

  const routes = [];
  if (store.configured()) { routes.push(store.saveLead(lead)); }
  const text = [
    "New estimate request - treeservicemadison.net", "",
    "Name:     " + lead.name,
    "Phone:    " + lead.phone,
    "Email:    " + (lead.email || "-"),
    "Address:  " + (lead.address || "-"),
    "Service:  " + lead.service, "",
    lead.details || "(no details given)", "",
    "Page: " + (lead.page || "/") + "   Received: " + lead.received
  ].join("\n");

  if (process.env.RESEND_API_KEY && process.env.LEAD_TO && process.env.LEAD_FROM) {
    routes.push(fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Authorization": "Bearer " + process.env.RESEND_API_KEY, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.LEAD_FROM,
        to: process.env.LEAD_TO.split(",").map((s) => s.trim()),
        reply_to: lead.email || undefined,
        subject: "Estimate request: " + lead.service + " - " + lead.name,
        text
      })
    }).then((r) => { if (!r.ok) { throw new Error("email " + r.status); } }));
  }
  if (process.env.LEAD_WEBHOOK_URL) {
    routes.push(fetch(process.env.LEAD_WEBHOOK_URL, {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(lead)
    }).then((r) => { if (!r.ok) { throw new Error("webhook " + r.status); } }));
  }

  if (!routes.length) {
    console.error("Lead received but no delivery route is configured", lead);
    return done(503, { ok: false, error: "Lead delivery is not configured." });
  }

  const results = await Promise.allSettled(routes);
  if (results.some((r) => r.status === "fulfilled")) { return done(200, { ok: true }); }
  console.error("Lead delivery failed", results.map((r) => String(r.reason)), lead);
  return done(502, { ok: false, error: "Could not deliver the request." });
};
