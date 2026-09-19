/* Lead storage on Upstash Redis over its REST API (no dependencies).
 * Add "Upstash for Redis" to the project from Vercel > Storage and the two variables below appear by themselves.
 *   KV_REST_API_URL + KV_REST_API_TOKEN      (names Vercel injects)   or
 *   UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN                 (names Upstash uses)
 * Files in /api that start with "_" are helpers, not endpoints. */
const crypto = require("crypto");
const P = "tsm:";                                    // key prefix, so the database can be shared with other sites
const STATUSES = ["New", "Contacted", "Estimate booked", "Quoted", "Won", "Lost", "Spam"];

function cfg() {
  return { url: (process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || "").replace(/\/$/, ""),
           token: process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || "" };
}
function configured() { const c = cfg(); return Boolean(c.url && c.token); }

async function pipe(cmds) {
  const c = cfg();
  const r = await fetch(c.url + "/pipeline", { method: "POST", headers: { Authorization: "Bearer " + c.token, "Content-Type": "application/json" }, body: JSON.stringify(cmds) });
  if (!r.ok) { throw new Error("store " + r.status); }
  const out = await r.json();
  return out.map((o) => { if (o && o.error) { throw new Error(o.error); } return o ? o.result : null; });
}

async function ping() { const [r] = await pipe([["PING"]]); return r === "PONG"; }

function ttl() { const d = parseInt(process.env.LEAD_RETENTION_DAYS || "730", 10); return (d > 0 ? d : 730) * 86400; }

async function saveLead(lead) {
  const id = Date.now().toString(36) + crypto.randomBytes(4).toString("hex");
  const rec = Object.assign({ id, status: "New", notes: "", updated: lead.received }, lead);
  await pipe([["SET", P + "lead:" + id, JSON.stringify(rec), "EX", ttl()], ["ZADD", P + "leads", Date.parse(lead.received) || Date.now(), id]]);
  return rec;
}

async function listLeads(limit) {
  const [ids] = await pipe([["ZREVRANGE", P + "leads", 0, (limit || 500) - 1]]);
  if (!ids || !ids.length) { return []; }
  const [vals] = await pipe([["MGET"].concat(ids.map((i) => P + "lead:" + i))]);
  const leads = [], gone = [];
  vals.forEach((v, i) => { if (v) { try { leads.push(JSON.parse(v)); } catch (e) { gone.push(ids[i]); } } else { gone.push(ids[i]); } });
  if (gone.length) { await pipe([["ZREM", P + "leads"].concat(gone)]); }   // expired under the retention period
  return leads;
}

async function updateLead(id, patch) {
  const key = P + "lead:" + String(id).replace(/[^a-z0-9]/gi, "");
  const [v] = await pipe([["GET", key]]);
  if (!v) { return null; }
  const rec = JSON.parse(v);
  if (patch.status !== undefined) { if (!STATUSES.includes(patch.status)) { throw new Error("bad status"); } rec.status = patch.status; }
  if (patch.notes !== undefined) { rec.notes = String(patch.notes).replace(/[\u0000-\u0008\u000B-\u001F\u007F]+/g, " ").slice(0, 2000); }
  rec.updated = new Date().toISOString();
  await pipe([["SET", key, JSON.stringify(rec), "KEEPTTL"]]);
  return rec;
}

async function deleteLead(id) {
  const clean = String(id).replace(/[^a-z0-9]/gi, "");
  const [n] = await pipe([["DEL", P + "lead:" + clean], ["ZREM", P + "leads", clean]]);
  return n > 0;
}

/* ---- dashboard sign-in: one shared password, constant-time compare, lock-out after repeated failures ---- */
function passwordOk(given) {
  const want = process.env.ADMIN_PASSWORD || "";
  const a = crypto.createHash("sha256").update(String(given || "")).digest(), b = crypto.createHash("sha256").update(want).digest();
  return want.length >= 12 && crypto.timingSafeEqual(a, b);
}
async function failures(ip, bump) {
  const key = P + "fail:" + String(ip || "unknown").replace(/[^0-9a-f.:]/gi, "").slice(0, 60);
  if (bump) { const [n] = await pipe([["INCR", key], ["EXPIRE", key, 900]]); return n; }
  const [n] = await pipe([["GET", key]]); return parseInt(n || "0", 10);
}

module.exports = { configured, ping, saveLead, listLeads, updateLead, deleteLead, passwordOk, failures, STATUSES };
