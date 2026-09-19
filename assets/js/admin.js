/* Leads dashboard. Everything a visitor typed is shown with textContent, never as HTML. */
(function () {
  "use strict";
  var KEY = "tsm-admin", $ = function (id) { return document.getElementById(id); };
  var login = $("login"), board = $("board"), list = $("list"), stats = $("stats"), msg = $("board-msg"), loginMsg = $("login-msg");
  var leads = [], statuses = [];

  function el(tag, cls, text) { var n = document.createElement(tag); if (cls) { n.className = cls; } if (text !== undefined) { n.textContent = text; } return n; }
  function pw() { try { return sessionStorage.getItem(KEY) || ""; } catch (e) { return pw.mem || ""; } }
  function setPw(v) { pw.mem = v; try { if (v) { sessionStorage.setItem(KEY, v); } else { sessionStorage.removeItem(KEY); } } catch (e) { /* private mode */ } }
  function say(node, text, error) { node.textContent = text; node.hidden = !text; node.classList.toggle("adm-msg--error", !!error); }

  function api(method, body) {
    return fetch("/api/leads", { method: method, headers: { "Authorization": "Bearer " + pw(), "Content-Type": "application/json", "Accept": "application/json" }, body: body ? JSON.stringify(body) : undefined })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { if (!r.ok) { var e = new Error(j.error || ("Error " + r.status)); e.status = r.status; throw e; } return j; }); });
  }

  function show(signedIn) { login.hidden = signedIn; board.hidden = !signedIn; $("signout").hidden = !signedIn; if (!signedIn) { $("pw").focus(); } }

  function load() {
    say(msg, "Loading\u2026");
    return api("GET").then(function (j) {
      leads = j.leads || []; statuses = j.statuses || [];
      fillSelect($("f-status"), statuses); fillSelect($("f-service"), uniq(leads.map(function (l) { return l.service; })));
      say(msg, ""); show(true); render();
    }).catch(function (e) {
      if (e.status === 401 || e.status === 429) { setPw(""); show(false); say(loginMsg, e.message, true); }
      else { show(!!pw()); say(pw() ? msg : loginMsg, e.message, true); if (!pw()) { show(false); } }
    });
  }

  function uniq(a) { return a.filter(function (v, i) { return v && a.indexOf(v) === i; }).sort(); }
  function fillSelect(sel, values) { var keep = sel.value; while (sel.options.length > 1) { sel.remove(1); } values.forEach(function (v) { var o = el("option", "", v); o.value = v; sel.appendChild(o); }); sel.value = keep; }
  function when(iso) { var d = new Date(iso); return isNaN(d) ? "" : d.toLocaleString([], { year: "numeric", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }); }

  function visible() {
    var q = $("q").value.trim().toLowerCase(), s = $("f-status").value, v = $("f-service").value;
    return leads.filter(function (l) {
      if (s && l.status !== s) { return false; } if (v && l.service !== v) { return false; }
      return !q || [l.name, l.phone, l.email, l.address, l.details, l.notes, l.page].join(" ").toLowerCase().indexOf(q) > -1;
    });
  }

  function render() {
    var week = Date.now() - 7 * 864e5;
    stats.textContent = "";
    [["All leads", leads.length], ["New", leads.filter(function (l) { return l.status === "New"; }).length],
     ["Last 7 days", leads.filter(function (l) { return Date.parse(l.received) >= week; }).length], ["Won", leads.filter(function (l) { return l.status === "Won"; }).length]]
      .forEach(function (s) { var c = el("div", "adm-stat"); c.appendChild(el("b", "", String(s[1]))); c.appendChild(el("span", "", s[0])); stats.appendChild(c); });
    var rows = visible(); list.textContent = "";
    if (!rows.length) { list.appendChild(el("p", "adm-empty", leads.length ? "No leads match those filters." : "No leads yet. Requests sent from the website will appear here.")); return; }
    rows.forEach(function (l) { list.appendChild(card(l)); });
  }

  function card(l) {
    var d = el("details", "adm-lead"), s = el("summary");
    s.appendChild(el("span", "adm-when", when(l.received))); s.appendChild(el("span", "adm-name", l.name || "(no name)")); s.appendChild(el("span", "adm-svc", l.service || ""));
    var badge = el("span", "adm-badge", l.status || "New"); badge.setAttribute("data-s", l.status || "New"); s.appendChild(badge); d.appendChild(s);
    var body = el("div", "adm-body"), dl = el("dl", "adm-dl");
    function row(k, v, href) { if (!v) { return; } dl.appendChild(el("dt", "", k)); var dd = el("dd"); if (href) { var a = el("a", "", v); a.href = href; dd.appendChild(a); } else { dd.textContent = v; } dl.appendChild(dd); }
    row("Phone", l.phone, "tel:" + String(l.phone || "").replace(/[^\d+]/g, "")); row("Email", l.email, l.email ? "mailto:" + l.email : ""); row("Address", l.address);
    row("Service", l.service); row("Details", l.details); row("Sent from", l.page); row("Received", when(l.received)); row("Updated", l.updated !== l.received ? when(l.updated) : "");
    body.appendChild(dl);
    var edit = el("div", "adm-edit"), sl = el("label", "", "Status"), sel = el("select"), nl = el("label", "", "Notes (only you see these)"), ta = el("textarea");
    sel.id = "s-" + l.id; sl.htmlFor = sel.id; ta.id = "n-" + l.id; nl.htmlFor = ta.id; ta.value = l.notes || ""; ta.maxLength = 2000;
    statuses.forEach(function (v) { var o = el("option", "", v); o.value = v; sel.appendChild(o); }); sel.value = l.status || "New";
    var actions = el("div", "adm-actions"), save = el("button", "btn btn--pine btn--sm", "Save"), saved = el("span", "adm-saved"), del = el("button", "adm-del", "Delete lead");
    save.type = "button"; del.type = "button";
    save.addEventListener("click", function () {
      save.disabled = true; saved.textContent = "";
      api("POST", { action: "update", id: l.id, status: sel.value, notes: ta.value }).then(function (j) {
        Object.assign(l, j.lead); badge.textContent = l.status; badge.setAttribute("data-s", l.status); saved.textContent = "Saved"; save.disabled = false; renderStatsOnly();
      }).catch(function (e) { save.disabled = false; saved.textContent = ""; say(msg, e.message, true); });
    });
    del.addEventListener("click", function () {
      if (!window.confirm("Delete this lead for good? This cannot be undone.")) { return; }
      api("POST", { action: "delete", id: l.id }).then(function () { leads = leads.filter(function (x) { return x.id !== l.id; }); render(); }).catch(function (e) { say(msg, e.message, true); });
    });
    actions.appendChild(save); actions.appendChild(saved); actions.appendChild(del);
    [sl, sel, nl, ta, actions].forEach(function (n) { edit.appendChild(n); }); body.appendChild(edit); d.appendChild(body);
    return d;
  }
  function renderStatsOnly() { var open = [].slice.call(list.querySelectorAll("details[open]")).length; if (!open) { render(); return; } var b = stats.querySelectorAll("b"); if (b.length === 4) { b[1].textContent = String(leads.filter(function (l) { return l.status === "New"; }).length); b[3].textContent = String(leads.filter(function (l) { return l.status === "Won"; }).length); } }

  function csv() {
    var cols = ["received", "name", "phone", "email", "address", "service", "details", "status", "notes", "page"];
    var cell = function (v) { v = String(v == null ? "" : v); if (/^[=+\-@\t\r]/.test(v)) { v = "'" + v; } return '"' + v.replace(/"/g, '""') + '"'; };   // no spreadsheet formulas from visitors
    var out = [cols.join(",")].concat(visible().map(function (l) { return cols.map(function (c) { return cell(l[c]); }).join(","); })).join("\r\n");
    var a = el("a"); a.href = URL.createObjectURL(new Blob(["\ufeff" + out], { type: "text/csv" })); a.download = "leads-" + new Date().toISOString().slice(0, 10) + ".csv";
    document.body.appendChild(a); a.click(); a.remove(); return out;
  }

  login.addEventListener("submit", function (e) { e.preventDefault(); say(loginMsg, ""); setPw($("pw").value); $("pw").value = ""; load(); });
  $("signout").addEventListener("click", function () { setPw(""); leads = []; list.textContent = ""; show(false); });
  $("refresh").addEventListener("click", load); $("csv").addEventListener("click", csv);
  ["q", "f-status", "f-service"].forEach(function (id) { $(id).addEventListener("input", render); });
  window.__tsmAdmin = { csv: csv };
  if (pw()) { load(); } else { show(false); }
})();
