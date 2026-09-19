/* GET /api/health  - "why isn't the form working?" in one click. Reports only yes/no answers, never a secret. */
const store = require("./_store");

module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Robots-Tag", "noindex, nofollow");
  const database_connected = store.configured();
  let database_answers = null;
  if (database_connected) { try { database_answers = await store.ping(); } catch (e) { database_answers = false; } }
  const email_alerts = Boolean(process.env.RESEND_API_KEY && process.env.LEAD_TO && process.env.LEAD_FROM);
  const webhook = Boolean(process.env.LEAD_WEBHOOK_URL);
  const dashboard_password_set = (process.env.ADMIN_PASSWORD || "").length >= 12;
  const form_will_send = Boolean(database_answers || email_alerts || webhook);
  let next_step;
  if (!database_connected && !email_alerts && !webhook) {
    next_step = "Nothing is set up to receive leads yet, so the form tells visitors to call. In Vercel open this project > Storage > Create Database > Upstash for Redis > connect it to this project (Production). Then Deployments > ... > Redeploy. Settings only reach the site after a redeploy.";
  } else if (database_connected && !database_answers) {
    next_step = "The database settings exist but the database did not answer. In Vercel > Storage, check the Upstash database is connected to THIS project and to the Production environment, then redeploy.";
  } else if (!dashboard_password_set) {
    next_step = "The form will send. To open the dashboard at /admin/, add ADMIN_PASSWORD (12 or more characters) under Settings > Environment Variables, then redeploy.";
  } else {
    next_step = "Everything is set. Send a test request from the homepage form, then look for it at /admin/.";
  }
  return res.status(200).json({ functions_running: true, database_connected, database_answers, email_alerts, webhook, dashboard_password_set, form_will_send, next_step });
};
