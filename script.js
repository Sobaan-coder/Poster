/* =====================================================================
   Royal Walima Invitation — behaviour
   Everything wedding-specific comes from config.js (window.WALIMA_CONFIG).
   ===================================================================== */
(function () {
  "use strict";

  // ------------------------------------------------------------------
  // Config (with safe defaults so a partially edited file never breaks)
  // ------------------------------------------------------------------
  const RAW = window.WALIMA_CONFIG || {};
  const C = {
    mode: RAW.mode === "live" ? "live" : "preview",
    defaultLanguage: RAW.defaultLanguage === "ur" ? "ur" : "en",
    couple: Object.assign({ bride: {}, groom: {} }, RAW.couple),
    family: Object.assign({ introduction: {} }, RAW.family),
    event: Object.assign({ date: "", time: "", dateText: {}, timeText: {} }, RAW.event),
    venue: Object.assign({ name: {}, address: {}, mapsUrl: "", lat: null, lng: null, showEmbeddedMap: true }, RAW.venue),
    rsvp: Object.assign({ whatsappNumber: "", maxGuests: 10, deadline: {} }, RAW.rsvp),
    music: Object.assign({ src: "", generatedAmbience: true, startOnOpen: true, volume: 0.35 }, RAW.music),
    openingSound: Object.assign({ src: "", synthesizedChime: true, volume: 0.4 }, RAW.openingSound),
    features: Object.assign({ intro: true, particles: true, parallax: true, countdown: true, venue: true, rsvp: true, music: true }, RAW.features),
    text: { en: Object.assign({}, (RAW.text || {}).en), ur: Object.assign({}, (RAW.text || {}).ur) },
  };
  const LIVE = C.mode === "live";
  const params = new URLSearchParams(location.search);
  const PKT_OFFSET_MIN = 5 * 60; // Pakistan Standard Time, UTC+05:00 (no daylight saving)

  // ------------------------------------------------------------------
  // Interface strings
  // ------------------------------------------------------------------
  const STR = {
    en: {
      open: "Open your invitation", tapHint: "Tap the ribbon to open your invitation", skip: "Skip",
      walimaCelebration: "Walima Celebration", walimaWord: "Walima", scroll: "Scroll",
      date: "Date", time: "Time", venue: "Venue", amp: "&",
      tba: "To be announced", dateTba: "Date to be announced", pkt: "Pakistan Standard Time (PKT)",
      detailsEyebrow: "The Celebration", detailsTitle: "Walima Details",
      directions: "Get directions", openMaps: "Open in Google Maps", showMap: "Show map", hideMap: "Hide map",
      directionsPending: "Directions will appear here once the venue is announced.",
      countdownEyebrow: "Counting the moments", countdownTitle: "Until the Walima",
      days: "Days", hours: "Hours", minutes: "Minutes", seconds: "Seconds",
      countdownPending: "The countdown will begin as soon as the date and time are announced.",
      countdownNow: "The Walima celebration is underway.",
      countdownToday: "The Walima is today — we look forward to welcoming you.",
      countdownPast: "The Walima has been celebrated. Thank you for your prayers.",
      venueEyebrow: "Finding your way", venueTitle: "Venue & Directions",
      rsvpEyebrow: "RSVP", rsvpTitle: "Kindly Respond",
      rsvpIntro: "Please let the family know whether you will be able to join.",
      yourName: "Your name", nameError: "Please enter your name.", willAttend: "Will you attend?",
      yes: "Yes, with pleasure", no: "Regretfully, I cannot attend",
      guests: "Number of attendees", message: "Message (optional)",
      rsvpBtn: "Confirm attendance on WhatsApp", rsvpBtnNo: "Send your reply on WhatsApp",
      rsvpNote: "This opens WhatsApp with your reply already written. Please press Send in WhatsApp — replies are not stored on this website.",
      rsvpDisabled: "WhatsApp RSVP will be available here once the family adds a contact number.",
      rsvpDisabledPreview: "Owner: add rsvp.whatsappNumber in config.js to enable this button.",
      backToTop: "Back to top",
      previewRibbon: "Preview mode — not every detail is final yet", checklist: "Checklist",
      checklistTitle: "Pre-launch checklist",
      checklistNote: "Complete every item marked ✗ in config.js, then set mode to \"live\" before sharing the link. Dotted-underlined text on the page is unconfirmed.",
      close: "Close",
      musicOn: "Music on", musicOff: "Music off", music: "Music", replay: "Replay introduction", switchLang: "اردو میں دیکھیں",
      musicGenerated: "Playing a soft generated ambience. Owner: add a licensed track and set music.src in config.js to replace it.",
      musicNoFile: "No music file has been added yet.",
      waGreeting: "Assalam-o-Alaikum!", waFor: "RSVP for the Walima", waOf: "of",
      waName: "Name", waAttending: "Attending", waYes: "Yes, InshaAllah", waNo: "Regretfully unable to attend",
      waGuests: "Number of attendees", waMessage: "Message",
    },
    ur: {
      open: "اپنا دعوت نامہ کھولیں", tapHint: "دعوت نامہ کھولنے کے لیے ربن پر ٹیپ کریں", skip: "آگے بڑھیں",
      walimaCelebration: "تقریبِ ولیمہ", walimaWord: "ولیمہ", scroll: "نیچے دیکھیں",
      date: "تاریخ", time: "وقت", venue: "مقام", amp: "اور",
      tba: "اعلان بعد میں کیا جائے گا", dateTba: "تاریخ کا اعلان جلد کیا جائے گا", pkt: "پاکستان کا معیاری وقت",
      detailsEyebrow: "تقریب", detailsTitle: "تفصیلاتِ ولیمہ",
      directions: "راستہ دیکھیں", openMaps: "گوگل میپس میں کھولیں", showMap: "نقشہ دکھائیں", hideMap: "نقشہ چھپائیں",
      directionsPending: "مقام کے اعلان کے بعد راستے کی معلومات یہاں دستیاب ہوں گی۔",
      countdownEyebrow: "لمحوں کا شمار", countdownTitle: "ولیمہ میں باقی وقت",
      days: "دن", hours: "گھنٹے", minutes: "منٹ", seconds: "سیکنڈ",
      countdownPending: "تاریخ اور وقت کے اعلان کے بعد الٹی گنتی شروع ہو جائے گی۔",
      countdownNow: "تقریبِ ولیمہ جاری ہے۔",
      countdownToday: "تقریبِ ولیمہ آج ہے — ہمیں آپ کی تشریف آوری کا انتظار رہے گا۔",
      countdownPast: "تقریبِ ولیمہ منعقد ہو چکی ہے۔ آپ کی دعاؤں کا شکریہ۔",
      venueEyebrow: "راستے کی رہنمائی", venueTitle: "مقام اور راستہ",
      rsvpEyebrow: "جوابی اطلاع", rsvpTitle: "براہِ کرم جواب دیں",
      rsvpIntro: "براہِ کرم اہلِ خانہ کو اپنی شرکت سے آگاہ کریں۔",
      yourName: "آپ کا نام", nameError: "براہِ کرم اپنا نام درج کریں۔", willAttend: "کیا آپ تشریف لائیں گے؟",
      yes: "جی ہاں، ان شاء اللہ", no: "معذرت، شرکت ممکن نہیں",
      guests: "شرکاء کی تعداد", message: "پیغام (اختیاری)",
      rsvpBtn: "واٹس ایپ پر شرکت کی تصدیق کریں", rsvpBtnNo: "واٹس ایپ پر جواب بھیجیں",
      rsvpNote: "اس سے واٹس ایپ میں آپ کا جواب تیار ہو کر کھل جائے گا۔ براہِ کرم واٹس ایپ میں ’سینڈ‘ دبائیں — جوابات اس ویب سائٹ پر محفوظ نہیں کیے جاتے۔",
      rsvpDisabled: "اہلِ خانہ کی جانب سے رابطہ نمبر شامل ہونے کے بعد واٹس ایپ پر جواب کی سہولت یہاں دستیاب ہوگی۔",
      rsvpDisabledPreview: "Owner: add rsvp.whatsappNumber in config.js to enable this button.",
      backToTop: "اوپر جائیں",
      previewRibbon: "پیش نظارہ — تمام تفصیلات ابھی حتمی نہیں", checklist: "فہرست",
      checklistTitle: "Pre-launch checklist",
      checklistNote: "Complete every item marked ✗ in config.js, then set mode to \"live\" before sharing the link. Dotted-underlined text on the page is unconfirmed.",
      close: "بند کریں",
      musicOn: "موسیقی جاری", musicOff: "موسیقی بند", music: "موسیقی", replay: "تعارف دوبارہ دیکھیں", switchLang: "View in English",
      musicGenerated: "Playing a soft generated ambience. Owner: add a licensed track and set music.src in config.js to replace it.",
      musicNoFile: "No music file has been added yet.",
      waGreeting: "السلام علیکم!", waFor: "ولیمہ کی دعوت کا جواب", waOf: "—",
      waName: "نام", waAttending: "شرکت", waYes: "جی ہاں، ان شاء اللہ", waNo: "معذرت، شرکت ممکن نہیں",
      waGuests: "شرکاء کی تعداد", waMessage: "پیغام",
    },
  };

  const EN_MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const EN_DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const UR_MONTHS = ["جنوری", "فروری", "مارچ", "اپریل", "مئی", "جون", "جولائی", "اگست", "ستمبر", "اکتوبر", "نومبر", "دسمبر"];
  const UR_DAYS = ["اتوار", "پیر", "منگل", "بدھ", "جمعرات", "جمعہ", "ہفتہ"];

  // ------------------------------------------------------------------
  // Helpers
  // ------------------------------------------------------------------
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const html = document.documentElement;
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* storage unavailable */ } },
  };
  const motionQuery = window.matchMedia ? matchMedia("(prefers-reduced-motion: reduce)") : { matches: false };
  const reducedMotion = () => motionQuery.matches;
  const lowPower = !!(
    (navigator.connection && navigator.connection.saveData) ||
    (navigator.deviceMemory && navigator.deviceMemory <= 2) ||
    (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2)
  );
  if (lowPower) html.classList.add("lowfx");
  const supports3d = !window.CSS || !CSS.supports ||
    CSS.supports("transform-style", "preserve-3d") || CSS.supports("-webkit-transform-style", "preserve-3d");
  if (!supports3d) html.classList.add("no3d");

  let lang = (params.get("lang") || store.get("walima-lang") || C.defaultLanguage) === "ur" ? "ur" : "en";
  const t = (key) => (STR[lang][key] != null ? STR[lang][key] : STR.en[key] || "");
  const txt = (key) => {
    const v = C.text[lang][key];
    return v != null ? v : C.text.en[key] || "";
  };
  const filled = (v) => typeof v === "string" && v.trim() !== "";

  /* Decide what to show for a configurable value.
     Returns { text, unconfirmed } or null (hide it).
     Unconfirmed values appear only in preview mode. */
  function pick(field, l = lang) {
    if (!field || (!filled(field.en) && !filled(field.ur))) return null;
    let unconfirmed = field.confirmed === false;
    if (unconfirmed && LIVE) return null;
    let text = filled(field.en) ? field.en : field.ur;
    if (l === "ur" && filled(field.ur)) {
      const urOk = field.urduConfirmed !== false;
      if (urOk || !LIVE) {
        text = field.ur;
        if (!urOk) unconfirmed = true;
      }
    }
    return { text: text.trim(), unconfirmed };
  }

  // ------------------------------------------------------------------
  // Event date / time (always interpreted as Pakistan time)
  // ------------------------------------------------------------------
  const dateMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec((C.event.date || "").trim());
  const timeMatch = /^(\d{1,2}):(\d{2})$/.exec((C.event.time || "").trim());
  const dateParts = dateMatch ? { y: +dateMatch[1], m: +dateMatch[2], d: +dateMatch[3] } : null;
  const timeParts = timeMatch && +timeMatch[1] < 24 && +timeMatch[2] < 60 ? { h: +timeMatch[1], min: +timeMatch[2] } : null;
  const endMatch = /^(\d{1,2}):(\d{2})$/.exec((C.event.endTime || "").trim());
  const endParts = timeParts && endMatch && +endMatch[1] < 24 && +endMatch[2] < 60 ? { h: +endMatch[1], min: +endMatch[2] } : null;
  const eventStart = dateParts && timeParts
    ? Date.UTC(dateParts.y, dateParts.m - 1, dateParts.d, timeParts.h, timeParts.min) - PKT_OFFSET_MIN * 60000
    : null;
  // date known but time not yet: count down to the start of that day in Pakistan
  const dayStart = dateParts
    ? Date.UTC(dateParts.y, dateParts.m - 1, dateParts.d) - PKT_OFFSET_MIN * 60000
    : null;

  function formatDate(l) {
    if (C.event.dateText && filled(C.event.dateText[l])) return C.event.dateText[l];
    if (!dateParts) return null;
    const wd = new Date(Date.UTC(dateParts.y, dateParts.m - 1, dateParts.d)).getUTCDay();
    return l === "ur"
      ? `${UR_DAYS[wd]}، ${dateParts.d} ${UR_MONTHS[dateParts.m - 1]} ${dateParts.y}`
      : `${EN_DAYS[wd]}, ${dateParts.d} ${EN_MONTHS[dateParts.m - 1]} ${dateParts.y}`;
  }
  function formatTime(l) {
    if (C.event.timeText && filled(C.event.timeText[l])) return C.event.timeText[l];
    if (!timeParts) return null;
    const clock = (p) => `${p.h % 12 || 12}:${String(p.min).padStart(2, "0")}`;
    if (l === "ur") {
      const h = timeParts.h;
      const period = h < 4 ? "رات" : h < 12 ? "صبح" : h < 15 ? "دوپہر" : h < 18 ? "سہ پہر" : h < 20 ? "شام" : "رات";
      return endParts ? `${period} ${clock(timeParts)} تا ${clock(endParts)} بجے` : `${period} ${clock(timeParts)} بجے`;
    }
    const en = (p) => `${clock(p)} ${p.h < 12 ? "AM" : "PM"}`;
    return endParts ? `${en(timeParts)} – ${en(endParts)}` : en(timeParts);
  }

  // ------------------------------------------------------------------
  // Venue / maps
  // ------------------------------------------------------------------
  const hasCoords = Number.isFinite(+C.venue.lat) && Number.isFinite(+C.venue.lng) && C.venue.lat !== null && C.venue.lng !== null && C.venue.lat !== "" && C.venue.lng !== "";
  const venueQuery = [C.venue.name.en || C.venue.name.ur, C.venue.address.en || C.venue.address.ur].filter(filled).join(", ");
  function directionsUrl() {
    if (filled(C.venue.mapsUrl) && /^https:\/\//i.test(C.venue.mapsUrl.trim())) return C.venue.mapsUrl.trim();
    if (hasCoords) return `https://www.google.com/maps/dir/?api=1&destination=${+C.venue.lat},${+C.venue.lng}`;
    if (venueQuery) return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(venueQuery)}`;
    return null;
  }
  function embedUrl() {
    if (hasCoords) return `https://maps.google.com/maps?q=${+C.venue.lat},${+C.venue.lng}&z=16&output=embed`;
    if (venueQuery) return `https://maps.google.com/maps?q=${encodeURIComponent(venueQuery)}&z=15&output=embed`;
    return null;
  }

  // ------------------------------------------------------------------
  // WhatsApp number
  // ------------------------------------------------------------------
  function normalizePhone(raw) {
    if (!filled(raw)) return null;
    let s = raw.trim().replace(/[^\d+]/g, "");
    if (s.startsWith("+")) s = s.slice(1);
    else if (s.startsWith("00")) s = s.slice(2);
    else if (/^0\d{10}$/.test(s)) s = "92" + s.slice(1); // Pakistani local format 03xx…
    s = s.replace(/\D/g, "");
    return /^\d{10,15}$/.test(s) ? s : null;
  }
  const waNumber = normalizePhone(C.rsvp.whatsappNumber);

  // ------------------------------------------------------------------
  // Rendering (safe to call again on language change)
  // ------------------------------------------------------------------
  function setBind(name, value, opts = {}) {
    $$(`[data-bind="${name}"]`).forEach((el) => {
      const isTba = !value && opts.tba;
      const text = value ? value.text : isTba ? opts.tba : "";
      el.textContent = text;
      el.classList.toggle("is-unconfirmed", !!(value && value.unconfirmed));
      el.classList.toggle("tba", !!isTba);
      if (value && value.unconfirmed) el.title = "Unconfirmed — edit config.js";
      else el.removeAttribute("title");
    });
  }

  function coupleNames() {
    const bride = pick(C.couple.bride);
    const groom = pick(C.couple.groom);
    return { bride, groom };
  }

  function render() {
    html.lang = lang;
    html.dir = lang === "ur" ? "rtl" : "ltr";

    $$("[data-t]").forEach((el) => { el.textContent = t(el.dataset.t); });
    $$("[data-txt]").forEach((el) => { el.textContent = txt(el.dataset.txt); });

    const { bride, groom } = coupleNames();
    setBind("bride", bride);
    setBind("groom", groom);
    setBind("amp", bride && groom ? { text: t("amp") } : null);

    const fam = pick(C.family.introduction);
    const applies = C.family.introduction.appliesTo;
    const famConfirmed = fam && !fam.unconfirmed;
    setBind("familyBride", famConfirmed && applies === "bride" ? fam : null);
    setBind("familyGroom", famConfirmed && applies === "groom" ? fam : null);
    setBind("familySeparate", fam && !(famConfirmed && (applies === "bride" || applies === "groom")) ? fam : null);
    setBind("family", fam);

    const d = formatDate(lang);
    const tm = formatTime(lang);
    setBind("date", d ? { text: d } : null, { tba: t("tba") });
    setBind("time", tm ? { text: tm } : null, { tba: t("tba") });
    setBind("tz", tm && !(C.event.timeText && filled(C.event.timeText[lang])) ? { text: t("pkt") } : null);
    setBind("dateLine", d ? { text: tm ? `${d} · ${tm}` : d } : null, { tba: t("dateTba") });

    const vName = pick(C.venue.name);
    const vAddr = pick(C.venue.address);
    setBind("venueName", vName, { tba: t("tba") });
    setBind("venueAddress", vAddr);
    setBind("deadline", pick(C.rsvp.deadline));
    setBind("closingUrdu", lang === "en" && filled(C.text.ur.closingTitle) ? { text: C.text.ur.closingTitle } : null);

    // controls
    $("#lang-btn").setAttribute("aria-label", t("switchLang"));
    $("#replay-btn").setAttribute("aria-label", t("replay"));
    $("#replay-btn").title = t("replay");
    $("#music-btn").title = t("music");
    $("#card3d").setAttribute("aria-label", t("open"));
    $("#intro-label").textContent = `${t("walimaCelebration")}`;
    document.title = lang === "ur" ? "دعوتِ ولیمہ" : "Walima Invitation · دعوتِ ولیمہ";

    renderVenue();
    renderRsvp();
    Countdown.renderNote();
    if (mapOpen) $("#map-btn").textContent = t("hideMap");
  }

  // ------------------------------------------------------------------
  // Pre-launch checklist
  // ------------------------------------------------------------------
  function checklistItems() {
    const b = C.couple.bride, g = C.couple.groom, f = C.family.introduction;
    return [
      { ok: filled(b.en) && b.confirmed !== false, label: "Bride's name confirmed", hint: "couple.bride" },
      { ok: filled(g.en) && g.confirmed !== false, label: "Groom's name confirmed", hint: "couple.groom (currently \"" + (g.en || "") + "\")" },
      { ok: !filled(f.en) || f.confirmed === true, label: "Family introduction confirmed, and which name it belongs to", hint: "family.introduction — confirmed / appliesTo" },
      { ok: filled(b.ur) && b.urduConfirmed !== false, label: "Urdu spelling of the bride's name", hint: "couple.bride.ur / urduConfirmed" },
      { ok: filled(g.ur) && g.urduConfirmed !== false, label: "Urdu spelling of the groom's name", hint: "couple.groom.ur / urduConfirmed" },
      { ok: !filled(f.ur) || f.urduConfirmed !== false, label: "Urdu family introduction", hint: "family.introduction.ur / urduConfirmed" },
      { ok: !!dateParts, label: "Walima date", hint: "event.date — \"YYYY-MM-DD\"" },
      { ok: !!timeParts, label: "Walima time (Pakistan time)", hint: "event.time — \"HH:MM\", 24-hour" },
      { ok: filled(C.venue.name.en) || filled(C.venue.name.ur), label: "Venue name", hint: "venue.name" },
      { ok: filled(C.venue.address.en) || filled(C.venue.address.ur), label: "Venue address", hint: "venue.address" },
      { ok: filled(C.venue.mapsUrl) || hasCoords, optional: true, label: "Exact map pin (recommended)", hint: "venue.mapsUrl or venue.lat / venue.lng" },
      { ok: !!waNumber, label: "WhatsApp number for RSVP", hint: filled(C.rsvp.whatsappNumber) && !waNumber ? "rsvp.whatsappNumber is not a valid number" : "rsvp.whatsappNumber" },
      { ok: filled(C.music.src), optional: true, label: "Licensed music file (optional)", hint: "music.src, e.g. assets/wedding-music.mp3" },
      { ok: LIVE, label: "Switch to live mode", hint: "mode: \"live\"" },
    ];
  }
  function renderChecklist() {
    const list = $("#checklist-list");
    list.innerHTML = "";
    checklistItems().forEach((it) => {
      const li = document.createElement("li");
      li.className = it.ok ? "ok" : it.optional ? "opt" : "todo";
      li.innerHTML = `<span class="st">${it.ok ? "✓" : it.optional ? "○" : "✗"}</span><span></span>`;
      li.lastChild.textContent = it.label;
      const small = document.createElement("small");
      small.textContent = it.hint;
      li.lastChild.appendChild(small);
      list.appendChild(li);
    });
  }
  function setupPreview() {
    const missing = checklistItems().filter((i) => !i.ok && !i.optional && i.label !== "Switch to live mode");
    if (LIVE && missing.length) {
      console.warn("[Walima] Live mode, but these details are still missing:", missing.map((i) => i.label).join("; "));
    }
    const wantChecklist = params.has("checklist");
    if (!LIVE || wantChecklist) {
      $("#preview-ribbon").hidden = false;
      document.body.classList.add("has-ribbon");
    }
    const dlg = $("#checklist");
    $("#checklist-btn").addEventListener("click", () => {
      renderChecklist();
      if (dlg.showModal) dlg.showModal(); else dlg.setAttribute("open", "");
    });
    if (wantChecklist) setTimeout(() => $("#checklist-btn").click(), 400);
  }

  // ------------------------------------------------------------------
  // Toast
  // ------------------------------------------------------------------
  let toastTimer;
  function toast(msg, ms = 4200) {
    const el = $("#toast");
    el.textContent = msg;
    el.classList.add("is-shown");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("is-shown"), ms);
  }

  // ------------------------------------------------------------------
  // Audio — never starts without a tap; music file optional
  // ------------------------------------------------------------------
  const Sound = {
    ctx: null, musicGain: null, el: null, gen: null, on: false, starting: false,

    context() {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      if (!this.ctx) {
        try { this.ctx = new AC(); } catch (e) { return null; }
      }
      if (this.ctx.state === "suspended") this.ctx.resume();
      return this.ctx;
    },

    reverb(ctx, seconds = 3) {
      const len = Math.floor(ctx.sampleRate * seconds);
      const buf = ctx.createBuffer(2, len, ctx.sampleRate);
      for (let ch = 0; ch < 2; ch++) {
        const data = buf.getChannelData(ch);
        for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3.2);
      }
      const node = ctx.createConvolver();
      node.buffer = buf;
      return node;
    },

    pluck(ctx, dest, freq, when, vel) {
      const detune = (Math.random() - 0.5) * 6;
      const env = ctx.createGain();
      env.gain.setValueAtTime(0.0001, when);
      env.gain.exponentialRampToValueAtTime(vel, when + 0.008);
      env.gain.exponentialRampToValueAtTime(0.0001, when + 3.4);
      env.connect(dest);
      [[1, 1, "sine"], [2, 0.32, "sine"], [3, 0.09, "triangle"], [4.01, 0.04, "sine"]].forEach(([mult, amp, type]) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = type;
        o.frequency.value = freq * mult;
        o.detune.value = detune;
        g.gain.value = amp;
        o.connect(g).connect(env);
        o.start(when);
        o.stop(when + 3.6);
      });
    },

    playChime() {
      const src = C.openingSound.src;
      const vol = Math.max(0, Math.min(1, +C.openingSound.volume || 0.4));
      const synth = () => {
        if (!C.openingSound.synthesizedChime) return;
        const ctx = this.context();
        if (!ctx) return;
        const out = ctx.createGain();
        out.gain.value = vol * 0.5;
        const rv = this.reverb(ctx, 2.6);
        const wet = ctx.createGain(); wet.gain.value = 0.5;
        out.connect(ctx.destination);
        out.connect(rv).connect(wet).connect(ctx.destination);
        const base = 587.33; // D5 — a gentle rising Yaman phrase: Sa Ga Pa Ni Sa'
        [0, 4, 7, 11, 12].forEach((semi, i) => {
          this.pluck(ctx, out, base * Math.pow(2, semi / 12), ctx.currentTime + 0.05 + i * 0.11, 0.22 - i * 0.02);
        });
        this.pluck(ctx, out, base * 2, ctx.currentTime + 0.75, 0.12);
      };
      if (filled(src)) {
        const a = new Audio(src);
        a.volume = vol;
        a.play().catch(synth);
      } else synth();
    },

    generated() {
      const ctx = this.ctx;
      const out = ctx.createGain();
      out.gain.value = 1;
      const dry = ctx.createGain(); dry.gain.value = 0.7;
      const wet = ctx.createGain(); wet.gain.value = 0.55;
      const rv = this.reverb(ctx, 3.4);
      const tone = ctx.createBiquadFilter(); tone.type = "lowpass"; tone.frequency.value = 3600;
      tone.connect(dry).connect(out);
      tone.connect(rv).connect(wet).connect(out);

      // soft tanpura-like drone on Sa and Pa
      const drones = [];
      const droneBus = ctx.createGain(); droneBus.gain.value = 0.05;
      const droneLp = ctx.createBiquadFilter(); droneLp.type = "lowpass"; droneLp.frequency.value = 900;
      droneBus.connect(droneLp).connect(out);
      droneLp.connect(rv);
      [[73.42, "triangle", 0.8], [146.83, "sine", 1], [220, "sine", 0.55], [293.66, "sine", 0.35]].forEach(([f, type, amp], i) => {
        const o = ctx.createOscillator(); o.type = type; o.frequency.value = f; o.detune.value = (i - 1.5) * 2;
        const g = ctx.createGain(); g.gain.value = amp;
        const lfo = ctx.createOscillator(); lfo.frequency.value = 0.05 + i * 0.023;
        const lfoGain = ctx.createGain(); lfoGain.gain.value = amp * 0.35;
        lfo.connect(lfoGain).connect(g.gain);
        o.connect(g).connect(droneBus);
        o.start(); lfo.start();
        drones.push(o, lfo);
      });

      // gentle Raag Yaman-flavoured phrases (semitones from D4)
      const SA = 293.66;
      const phrases = [
        [[-1, 1], [2, 1], [4, 2], [2, 1], [0, 3]],
        [[-1, 1], [2, 1], [4, 1], [6, 1], [7, 4]],
        [[7, 1], [6, 1], [4, 1], [6, 1], [4, 1], [2, 1], [0, 3]],
        [[4, 1], [7, 1], [11, 1], [12, 3], [11, 1], [9, 1], [7, 3]],
        [[0, 0.5], [4, 0.5], [7, 0.5], [12, 2.5], [7, 0.5], [4, 0.5], [0, 3]],
        [[9, 1], [7, 1], [6, 1], [4, 2], [2, 1], [-1, 1], [0, 4]],
      ];
      const beat = 0.6;
      let next = ctx.currentTime + 0.3, p = 0, n = 0, stopped = false;
      const schedule = () => {
        if (stopped) return;
        while (next < ctx.currentTime + 1.4) {
          const phrase = phrases[p % phrases.length];
          const [semi, beats] = phrase[n];
          this.pluck(ctx, tone, SA * Math.pow(2, semi / 12), next, 0.13 + Math.random() * 0.05);
          if (n === 0) this.pluck(ctx, tone, SA / 2 * Math.pow(2, (semi < 4 ? 0 : 7) / 12), next, 0.08);
          next += beats * beat;
          n++;
          if (n >= phrase.length) { n = 0; p++; next += beat * (2 + Math.random() * 2); }
        }
      };
      schedule();
      const timer = setInterval(schedule, 200);
      return {
        out,
        stop() {
          stopped = true;
          clearInterval(timer);
          setTimeout(() => { drones.forEach((o) => { try { o.stop(); } catch (e) { /* already stopped */ } }); out.disconnect(); }, 1600);
        },
      };
    },

    fadeTo(v, secs) {
      if (!this.musicGain) return;
      const g = this.musicGain.gain, now = this.ctx.currentTime;
      g.cancelScheduledValues(now);
      g.setValueAtTime(g.value, now);
      g.linearRampToValueAtTime(v, now + secs);
    },

    startMusic() {
      if (!C.features.music || this.on) return;
      const ctx = this.context();
      const vol = Math.max(0, Math.min(1, +C.music.volume || 0.35));
      this.on = true;
      updateMusicBtn();
      if (ctx && !this.musicGain) {
        this.musicGain = ctx.createGain();
        this.musicGain.gain.value = 0;
        this.musicGain.connect(ctx.destination);
      }
      const useGenerated = () => {
        if (!this.on) return;
        if (!C.music.generatedAmbience || !ctx) {
          this.on = false; updateMusicBtn();
          if (!LIVE) toast(t("musicNoFile"));
          return;
        }
        if (!this.gen) { this.gen = this.generated(); this.gen.out.connect(this.musicGain); }
        this.fadeTo(vol, 2.5);
        if (!LIVE) toast(t("musicGenerated"), 6000);
      };
      if (filled(C.music.src)) {
        if (!this.el) {
          this.el = new Audio();
          this.el.loop = true;
          this.el.preload = "auto";
          this.el.src = C.music.src;
          if (ctx) {
            try { ctx.createMediaElementSource(this.el).connect(this.musicGain); } catch (e) { this.el.volume = vol; }
          } else this.el.volume = vol;
        }
        const p = this.el.play();
        if (ctx) this.fadeTo(vol, 2.5);
        if (p && p.catch) p.catch(() => { this.el = null; useGenerated(); });
      } else {
        useGenerated();
      }
    },

    stopMusic() {
      if (!this.on) return;
      this.on = false;
      updateMusicBtn();
      if (this.ctx && this.musicGain) {
        this.fadeTo(0, 1.2);
        const el = this.el, gen = this.gen;
        this.gen = null;
        setTimeout(() => { if (!this.on && el) el.pause(); }, 1300);
        if (gen) gen.stop();
      } else if (this.el) this.el.pause();
    },
  };
  function updateMusicBtn() {
    const btn = $("#music-btn");
    btn.setAttribute("aria-pressed", Sound.on ? "true" : "false");
    btn.setAttribute("aria-label", Sound.on ? t("musicOn") : t("musicOff"));
  }
  // read-only hook used by the automated tests
  window.WALIMA_DEBUG = { audioState: () => (Sound.ctx ? Sound.ctx.state : "none"), musicOn: () => Sound.on };
  document.addEventListener("visibilitychange", () => {
    if (!Sound.ctx) return;
    if (document.hidden) Sound.ctx.suspend();
    else if (Sound.on) Sound.ctx.resume();
  });

  // ------------------------------------------------------------------
  // Gold particles (canvas 2D, paused when hidden)
  // ------------------------------------------------------------------
  function Particles(canvas) {
    const ctx = canvas.getContext("2d");
    let w = 0, h = 0, dpr = 1, parts = [], raf = 0, running = false;
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(64, (w * h) / 14000));
      parts = Array.from({ length: count }, () => spawn(true));
    };
    const spawn = (anywhere) => ({
      x: Math.random() * w,
      y: anywhere ? Math.random() * h : h + 10,
      r: 0.6 + Math.random() * 1.8,
      vy: 0.12 + Math.random() * 0.32,
      sway: Math.random() * Math.PI * 2,
      tw: Math.random() * Math.PI * 2,
    });
    const frame = () => {
      if (!running) return;
      ctx.clearRect(0, 0, w, h);
      for (const p of parts) {
        p.y -= p.vy; p.sway += 0.012; p.tw += 0.03;
        if (p.y < -10) Object.assign(p, spawn(false));
        const x = p.x + Math.sin(p.sway) * 10;
        const a = 0.35 + Math.sin(p.tw) * 0.3;
        ctx.globalAlpha = Math.max(0.05, a);
        ctx.fillStyle = "#E5CE91";
        ctx.beginPath(); ctx.arc(x, p.y, p.r, 0, 6.283); ctx.fill();
        if (p.r > 1.7) {
          ctx.globalAlpha = Math.max(0, a * 0.18);
          ctx.beginPath(); ctx.arc(x, p.y, p.r * 3.2, 0, 6.283); ctx.fill();
        }
      }
      raf = requestAnimationFrame(frame);
    };
    const enabled = C.features.particles && !lowPower && !reducedMotion();
    return {
      start() {
        if (!enabled || running) return;
        running = true; resize(); raf = requestAnimationFrame(frame);
      },
      stop() { running = false; cancelAnimationFrame(raf); },
      resize() { if (running) resize(); },
    };
  }

  // ------------------------------------------------------------------
  // Intro: 3D opening sequence
  // ------------------------------------------------------------------
  const Intro = (function () {
    const intro = $("#intro"), card = $("#card3d"), inner = $(".inner-card"), hero = $("#hero-card"), camera = $("#camera");
    const skipBtn = $("#skip-btn");
    const particles = Particles($("#particles-intro"));
    let state = "idle", timers = [];
    const later = (fn, ms) => timers.push(setTimeout(fn, ms));

    // copy the card front design into both doors
    const tpl = $("#front-tpl");
    $$("[data-front]").forEach((slot) => slot.appendChild(tpl.content.cloneNode(true)));

    function lock(on) {
      document.body.classList.toggle("is-locked", on);
      document.body.classList.toggle("intro-active", on);
      $("#main").inert = on;
      $(".footer").inert = on;
    }

    function open(e) {
      if (state !== "idle") return;
      if (e) e.preventDefault();
      state = "opening";
      Sound.playChime();
      if (C.music.startOnOpen) Sound.startMusic();

      if (reducedMotion()) {
        intro.classList.add("is-open");
        inner.classList.add("is-drawn");
        later(() => finish(true), 500);
        return;
      }
      // freeze the idle float exactly where it is, then ease to face the guest
      const m = getComputedStyle(card).transform;
      card.style.animation = "none";
      card.style.transform = m === "none" ? "" : m;
      void card.offsetWidth;
      card.style.transition = "transform 1.4s cubic-bezier(.6,.02,.2,1)";
      card.style.transform = "rotateX(0deg) rotateY(0deg)";
      intro.classList.add("is-open");
      skipBtn.hidden = false;
      landOnHero();
      later(() => inner.classList.add("is-drawn"), 1200);
      later(() => intro.classList.add("is-settling"), 3900);
      later(finish, 4350);
    }

    // move the camera so the opened card lands exactly where the page's cover card sits
    function landOnHero() {
      if (html.classList.contains("no3d")) return;
      const cr = camera.getBoundingClientRect(), hr = hero.getBoundingClientRect();
      if (!cr.width || !hr.width) return;
      const s = hr.width / cr.width;
      const dx = hr.left + hr.width / 2 - (cr.left + cr.width / 2);
      const dy = hr.top + hr.height / 2 - (cr.top + cr.height / 2);
      camera.style.transform = `translate3d(${dx.toFixed(1)}px, ${dy.toFixed(1)}px, 0) scale(${s.toFixed(4)})`;
    }

    function finish(fast) {
      if (state === "done") return;
      state = "done";
      timers.forEach(clearTimeout); timers = [];
      skipBtn.hidden = true;
      if (fast) intro.style.transitionDuration = ".35s";
      intro.classList.add("is-leaving");
      lock(false);
      inner.classList.add("is-drawn");
      hero.classList.add("is-instant", "is-drawn");
      setTimeout(() => {
        intro.classList.add("is-gone");
        intro.style.transitionDuration = "";
        particles.stop();
        CoverFx.start();
      }, fast ? 400 : 950);
      $("#cover").setAttribute("tabindex", "-1");
      $("#cover").focus({ preventScroll: true });
    }

    function replay() {
      timers.forEach(clearTimeout); timers = [];
      window.scrollTo({ top: 0, behavior: "auto" });
      intro.classList.remove("is-gone", "is-leaving", "is-open", "is-settling");
      inner.classList.remove("is-drawn");
      hero.classList.remove("is-drawn");
      camera.style.transform = "";
      card.style.animation = ""; card.style.transform = ""; card.style.transition = "";
      state = "idle";
      lock(true);
      particles.start();
      $("#open-btn").focus({ preventScroll: true });
    }

    function init() {
      if (!C.features.intro || params.has("nointro")) {
        intro.classList.add("is-gone");
        hero.classList.add("is-drawn");
        $("#replay-btn").hidden = true;
        CoverFx.start();
        return;
      }
      lock(true);
      particles.start();
      card.addEventListener("click", open);
      card.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") open(e); });
      $("#open-btn").addEventListener("click", open);
      skipBtn.addEventListener("click", () => finish(true));
      $("#replay-btn").addEventListener("click", replay);
      window.addEventListener("resize", () => particles.resize());
    }
    return { init };
  })();

  // ------------------------------------------------------------------
  // Cover effects: particles + pointer tilt
  // ------------------------------------------------------------------
  const CoverFx = (function () {
    const particles = Particles($("#particles-cover"));
    const cover = $("#cover"), card = $("#hero-card");
    let started = false;
    function start() {
      if (started) return;
      started = true;
      if ("IntersectionObserver" in window) {
        new IntersectionObserver((entries) => {
          entries.forEach((en) => (en.isIntersecting ? particles.start() : particles.stop()));
        }).observe(cover);
      } else particles.start();
      window.addEventListener("resize", () => particles.resize());
      if (!reducedMotion() && window.matchMedia && matchMedia("(pointer: fine)").matches) {
        cover.addEventListener("pointermove", (e) => {
          const r = card.getBoundingClientRect();
          const x = (e.clientX - (r.left + r.width / 2)) / r.width;
          const y = (e.clientY - (r.top + r.height / 2)) / r.height;
          card.style.setProperty("--ry", `${(x * 8).toFixed(2)}deg`);
          card.style.setProperty("--rx", `${(-y * 6).toFixed(2)}deg`);
        });
        cover.addEventListener("pointerleave", () => {
          card.style.setProperty("--ry", "0deg");
          card.style.setProperty("--rx", "0deg");
        });
      }
    }
    return { start };
  })();

  // ------------------------------------------------------------------
  // Scroll reveals + parallax
  // ------------------------------------------------------------------
  function setupReveals() {
    const els = $$("[data-reveal]");
    if (!("IntersectionObserver" in window)) { els.forEach((el) => el.classList.add("is-visible")); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    els.forEach((el) => io.observe(el));
  }
  function setupParallax() {
    if (!C.features.parallax || lowPower || reducedMotion()) return;
    const els = $$("[data-parallax]");
    let ticking = false;
    const update = () => {
      ticking = false;
      const vh = window.innerHeight;
      els.forEach((el) => {
        const r = el.parentElement.getBoundingClientRect();
        if (r.bottom < -100 || r.top > vh + 100) return;
        const off = (r.top + r.height / 2 - vh / 2) * parseFloat(el.dataset.parallax);
        el.style.translate = `0 ${off.toFixed(1)}px`;
      });
    };
    window.addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    update();
  }

  // ------------------------------------------------------------------
  // Countdown (to the configured PKT start time only)
  // ------------------------------------------------------------------
  const Countdown = (function () {
    const timer = $("#timer"), note = $("#timer-note");
    const nums = {};
    $$("[data-unit]").forEach((el) => { nums[el.dataset.unit] = el; });
    let iv = 0, phase = "pending";
    function set(unit, value) {
      const el = nums[unit];
      const v = String(value).padStart(2, "0");
      if (el.textContent === v) return;
      el.textContent = v;
      if (!reducedMotion()) { el.classList.remove("tick"); void el.offsetWidth; el.classList.add("tick"); }
    }
    const target = eventStart || dayStart;
    // how long after the target the event still counts as "happening"
    const window_ = eventStart ? 6 * 3600 * 1000 : 24 * 3600 * 1000;
    function tick() {
      const diff = target - Date.now();
      if (diff > 0) {
        phase = "running";
        const s = Math.floor(diff / 1000);
        set("d", Math.floor(s / 86400));
        set("h", Math.floor((s % 86400) / 3600));
        set("m", Math.floor((s % 3600) / 60));
        set("s", s % 60);
      } else {
        const wasRunning = phase === "running";
        phase = diff > -window_ ? (eventStart ? "now" : "today") : "past";
        ["d", "h", "m", "s"].forEach((u) => set(u, 0));
        if (wasRunning || phase === "past") renderNote();
        if (phase === "past") { timer.hidden = true; clearInterval(iv); }
      }
    }
    function renderNote() {
      if (!target) { note.textContent = t("countdownPending"); return; }
      if (phase === "now") note.textContent = t("countdownNow");
      else if (phase === "today") note.textContent = t("countdownToday");
      else if (phase === "past") note.textContent = t("countdownPast");
      else if (!eventStart) note.textContent = `${formatDate(lang)} · ${t("time")}: ${t("tba")}`;
      else note.textContent = `${formatDate(lang)} · ${formatTime(lang)} — ${t("pkt")}`;
    }
    function init() {
      if (!C.features.countdown) { $("#countdown").hidden = true; return; }
      if (target) {
        timer.hidden = false;
        tick();
        iv = setInterval(tick, 1000);
      }
      renderNote();
    }
    return { init, renderNote };
  })();

  // ------------------------------------------------------------------
  // Venue section
  // ------------------------------------------------------------------
  let mapOpen = false;
  function renderVenue() {
    const url = directionsUrl();
    $$(".js-directions").forEach((a) => {
      a.hidden = !url;
      if (url) a.href = url;
    });
    $$(".js-directions-pending").forEach((p) => { p.hidden = !!url || LIVE; });
    if (LIVE && C.features.venue) $("#venue").hidden = !url;
    const mapBtn = $("#map-btn");
    mapBtn.hidden = !(C.venue.showEmbeddedMap && embedUrl());
  }
  function setupVenue() {
    if (!C.features.venue) { $("#venue").hidden = true; return; }
    const btn = $("#map-btn"), frame = $("#map-frame");
    btn.addEventListener("click", () => {
      mapOpen = !mapOpen;
      if (mapOpen && !frame.firstChild) {
        const ifr = document.createElement("iframe");
        ifr.src = embedUrl();
        ifr.loading = "lazy";
        ifr.referrerPolicy = "no-referrer-when-downgrade";
        ifr.title = "Map";
        frame.appendChild(ifr);
      }
      frame.hidden = !mapOpen;
      btn.textContent = mapOpen ? t("hideMap") : t("showMap");
    });
  }

  // ------------------------------------------------------------------
  // RSVP via WhatsApp (the guest sends the message themselves)
  // ------------------------------------------------------------------
  const form = $("#rsvp-form");
  const max = Math.max(1, Math.min(50, parseInt(C.rsvp.maxGuests, 10) || 10));
  function rsvpValues() {
    const name = $("#rsvp-name").value.trim().replace(/\s+/g, " ");
    const attending = form.querySelector('input[name="attending"]:checked').value === "yes";
    let guests = parseInt($("#rsvp-guests").value, 10);
    if (!Number.isFinite(guests) || guests < 1) guests = 1;
    guests = Math.min(guests, max);
    const message = $("#rsvp-message").value.trim();
    return { name, attending, guests, message };
  }
  function waMessage(v) {
    const { bride, groom } = coupleNames();
    const couple = [bride, groom].filter(Boolean).map((n) => n.text).join(lang === "ur" ? " اور " : " & ");
    const lines = [
      t("waGreeting"),
      couple ? `${t("waFor")} ${t("waOf")} ${couple}` : t("waFor"),
      "",
      `${t("waName")}: ${v.name}`,
      `${t("waAttending")}: ${v.attending ? t("waYes") : t("waNo")}`,
    ];
    if (v.attending) lines.push(`${t("waGuests")}: ${v.guests}`);
    if (v.message) lines.push(`${t("waMessage")}: ${v.message}`);
    return lines.join("\n");
  }
  function renderRsvp() {
    const btn = $("#rsvp-btn"), note = $("#rsvp-note");
    const v = rsvpValues();
    $("#guests-field").classList.toggle("is-off", !v.attending);
    btn.querySelector("span").textContent = v.attending ? t("rsvpBtn") : t("rsvpBtnNo");
    if (!waNumber) {
      btn.setAttribute("aria-disabled", "true");
      btn.removeAttribute("href");
      note.textContent = t("rsvpDisabled");
      if (!LIVE) {
        const owner = document.createElement("span");
        owner.className = "owner-note";
        owner.dir = "ltr";
        owner.lang = "en";
        owner.textContent = t("rsvpDisabledPreview");
        note.appendChild(owner);
      }
      return;
    }
    btn.removeAttribute("aria-disabled");
    note.textContent = t("rsvpNote");
    btn.href = `https://wa.me/${waNumber}?text=${encodeURIComponent(waMessage(v))}`;
  }
  function setupRsvp() {
    if (!C.features.rsvp || (LIVE && !waNumber)) { $("#rsvp").hidden = true; return; }
    const guests = $("#rsvp-guests");
    guests.max = String(max);
    form.addEventListener("input", renderRsvp);
    form.addEventListener("change", renderRsvp);
    $$(".step", form).forEach((b) => b.addEventListener("click", () => {
      const v = Math.min(max, Math.max(1, (parseInt(guests.value, 10) || 1) + +b.dataset.step));
      guests.value = v;
      renderRsvp();
    }));
    guests.addEventListener("blur", () => { guests.value = rsvpValues().guests; renderRsvp(); });
    $("#rsvp-name").addEventListener("input", () => {
      $("#name-error").hidden = true;
      $("#rsvp-name").closest(".field").classList.remove("has-error");
    });
    form.addEventListener("submit", (e) => e.preventDefault());
    $("#rsvp-btn").addEventListener("click", (e) => {
      if (!waNumber) { e.preventDefault(); return; }
      renderRsvp();
      if (!rsvpValues().name) {
        e.preventDefault();
        $("#name-error").hidden = false;
        $("#rsvp-name").closest(".field").classList.add("has-error");
        $("#rsvp-name").focus();
      }
    });
  }

  // ------------------------------------------------------------------
  // Language + controls
  // ------------------------------------------------------------------
  function setLang(l) {
    lang = l;
    store.set("walima-lang", l);
    render();
    updateMusicBtn();
  }
  function setupControls() {
    $("#lang-btn").addEventListener("click", () => setLang(lang === "en" ? "ur" : "en"));
    $("#music-btn").addEventListener("click", () => (Sound.on ? Sound.stopMusic() : Sound.startMusic()));
    if (!C.features.music) $("#music-btn").hidden = true;
    $("#back-top").addEventListener("click", (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: reducedMotion() ? "auto" : "smooth" });
    });
  }

  // ------------------------------------------------------------------
  // Boot
  // ------------------------------------------------------------------
  try {
    render();
    updateMusicBtn();
    setupControls();
    setupPreview();
    setupVenue();
    setupRsvp();
    renderRsvp();
    Countdown.init();
    setupReveals();
    setupParallax();
    Intro.init();
  } catch (err) {
    // never leave guests stuck behind the intro
    console.error("[Walima]", err);
    const intro = $("#intro");
    if (intro) intro.classList.add("is-gone");
    document.body.classList.remove("is-locked");
    $$("[data-reveal]").forEach((el) => el.classList.add("is-visible"));
    const hero = $("#hero-card");
    if (hero) hero.classList.add("is-drawn");
  }
})();
