/* Tree Service Madison - site.js
   Everything here is enhancement. Without it the menu is simply shown expanded on small
   screens, dropdowns are native <details>, and the form posts normally to /api/lead. */
(function () {
  "use strict";

  var nav = document.getElementById("site-nav");
  var burger = document.querySelector(".nav-burger");
  var drops = nav ? Array.prototype.slice.call(nav.querySelectorAll("details")) : [];

  /* ---- mobile menu ---- */
  if (nav && burger) {
    burger.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
      burger.querySelector(".nav-burger-text").textContent = open ? "Close" : "Menu";
    });
  }

  /* ---- dropdowns: one open at a time, close on outside click / Escape ---- */
  function closeAll(except) {
    drops.forEach(function (d) { if (d !== except) { d.removeAttribute("open"); } });
  }
  drops.forEach(function (d) {
    d.addEventListener("toggle", function () { if (d.open) { closeAll(d); } });
  });
  document.addEventListener("click", function (e) {
    if (nav && !nav.contains(e.target)) { closeAll(null); }
  });
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") { return; }
    var open = drops.filter(function (d) { return d.open; })[0];
    if (open) {
      open.removeAttribute("open");
      var s = open.querySelector("summary");
      if (s) { s.focus(); }
    }
  });

  /* ---- estimate form ---- */
  var form = document.getElementById("estimate-form");
  if (form && window.fetch) {
    var status = form.querySelector(".form-status");
    var button = form.querySelector("button[type=submit]");
    var label = button ? button.textContent : "";
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.reportValidity()) { return; }
      var data = {};
      Array.prototype.forEach.call(form.elements, function (el) {
        if (el.name) { data[el.name] = el.value; }
      });
      data.page = location.pathname;
      button.disabled = true;
      button.textContent = "Sending your request\u2026";
      status.removeAttribute("data-state");
      status.textContent = "";
      fetch(form.action, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(data)
      }).then(function (r) {
        if (!r.ok) { throw new Error("HTTP " + r.status); }
        location.href = "/thank-you/";
      }).catch(function () {
        button.disabled = false;
        button.textContent = label;
        status.setAttribute("data-state", "error");
        status.textContent = "Your request didn\u2019t send. Please call (608) 571-1326 and we\u2019ll take it by phone.";
      });
    });
  }

  /* ---- ring timeline: animate once, when it scrolls into view ---- */
  var rings = document.querySelector(".hero-rings");
  if (rings) {
    document.documentElement.classList.add("rings-ready");
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { rings.classList.add("is-in"); io.disconnect(); }
        });
      }, { threshold: 0.35 });
      io.observe(rings);
    } else {
      rings.classList.add("is-in");
    }
  }

  /* ---- questions page: live search across all questions and answers ---- */
  var ff = document.getElementById("faq-filter");
  if (ff) {
    var qItems = Array.prototype.slice.call(document.querySelectorAll(".faq-group details"));
    var qGroups = Array.prototype.slice.call(document.querySelectorAll(".faq-group"));
    var qNone = document.getElementById("faq-none");
    ff.addEventListener("input", function () {
      var q = ff.value.trim().toLowerCase(), shown = 0;
      qItems.forEach(function (d) {
        var hit = !q || d.textContent.toLowerCase().indexOf(q) > -1;
        d.hidden = !hit;
        if (hit) { shown++; }
      });
      qGroups.forEach(function (g) { g.hidden = !g.querySelector("details:not([hidden])"); });
      if (qNone) { qNone.hidden = shown > 0; }
    });
  }

  /* ---- footer year ---- */
  var y = document.getElementById("year");
  if (y) { y.textContent = String(new Date().getFullYear()); }
})();
