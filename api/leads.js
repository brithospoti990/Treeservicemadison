/* GET  /api/leads                      -> { leads: [...] }            newest first
 * POST /api/leads {action:"update", id, status?, notes?}  -> { lead }
 * POST /api/leads {action:"delete", id}                   -> { ok }
 * Every call needs  Authorization: Bearer <ADMIN_PASSWORD>.  Set ADMIN_PASSWORD (12+ characters) in Vercel. */
const store = require("./_store");

module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Robots-Tag", "noindex, nofollow");
  if (!store.configured()) { return res.status(503).json({ error: "No leads database is connected yet. Add Upstash for Redis under Storage in Vercel, then redeploy." }); }
  if ((process.env.ADMIN_PASSWORD || "").length < 12) { return res.status(503).json({ error: "Set an ADMIN_PASSWORD of at least 12 characters in Vercel, then redeploy." }); }

  const ip = String(req.headers["x-forwarded-for"] || "").split(",")[0].trim();
  try {
    if ((await store.failures(ip, false)) >= 10) { return res.status(429).json({ error: "Too many wrong passwords. Try again in 15 minutes." }); }
    const given = String(req.headers.authorization || "").replace(/^Bearer\s+/i, "");
    if (!store.passwordOk(given)) { await store.failures(ip, true); return res.status(401).json({ error: "Wrong password." }); }

    if (req.method === "GET") { return res.status(200).json({ leads: await store.listLeads(500), statuses: store.STATUSES }); }
    if (req.method === "POST") {
      const b = (req.body && typeof req.body === "object") ? req.body : {};
      if (b.action === "update") {
        const lead = await store.updateLead(b.id, { status: b.status, notes: b.notes });
        return lead ? res.status(200).json({ lead }) : res.status(404).json({ error: "That lead no longer exists." });
      }
      if (b.action === "delete") { return res.status(200).json({ ok: await store.deleteLead(b.id) }); }
      return res.status(400).json({ error: "Unknown action." });
    }
    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ error: "Method not allowed" });
  } catch (e) {
    console.error("leads api", e);
    return res.status(e.message === "bad status" ? 400 : 502).json({ error: e.message === "bad status" ? "Unknown status." : "The leads database did not respond. Try again." });
  }
};
