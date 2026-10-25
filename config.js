/* =====================================================================
   WALIMA INVITATION — CONFIGURATION
   ---------------------------------------------------------------------
   This is the ONLY file you need to edit for names, date, venue, RSVP
   number and music. Save the file and refresh the page to see changes.

   Rules of thumb
   • Leave a value as "" (empty) if it is not known yet. Empty details are
     shown to guests as "To be announced" — never as made-up information.
   • Set `confirmed: true` only after the family has confirmed a detail.
     Unconfirmed details are visible in PREVIEW mode (marked "unconfirmed")
     and hidden completely in LIVE mode.
   • English text goes in `en`, Urdu text in `ur`.
   • Open the page with  ?checklist  at the end of the address to see
     the pre-launch checklist at any time.
   ===================================================================== */

window.WALIMA_CONFIG = {
  /* "preview" — for you: shows a preview ribbon, the pre-launch checklist
                 and unconfirmed details (clearly marked).
     "live"    — for guests: hides the ribbon and every unconfirmed detail.
     Switch to "live" only once the checklist is complete.               */
  mode: "live",

  /* Language shown first: "en" (English) or "ur" (Urdu).
     Guests can switch with the EN / اردو button at any time.            */
  defaultLanguage: "en",

  /* ------------------------------------------------------------------
     THE COUPLE
     `en`  – name in English letters
     `ur`  – name in Urdu script
     `confirmed`      – the English spelling/name is confirmed
     `urduConfirmed`  – the Urdu spelling is confirmed
     ------------------------------------------------------------------ */
  couple: {
    bride: {
      en: "CH Mubeen Ishfaq",
      ur: "چوہدری مبین اشفاق", // suggested transliteration — please verify
      confirmed: true,
      urduConfirmed: false,
    },
    groom: {
      en: "Daughter of Muqadar Hussain", // as supplied by the family
      ur: "دختر مقدر حسین", // suggested translation — set urduConfirmed: true once verified
      confirmed: true,
      urduConfirmed: false,
    },
  },

  /* ------------------------------------------------------------------
     FAMILY INTRODUCTION
     The line below was supplied, but it is NOT yet confirmed which name
     it belongs with, so it is kept separate and is not attached to either
     name. Once confirmed, set `confirmed: true` and choose `appliesTo`:
       "bride" – shown directly under the bride's name
       "groom" – shown directly under the groom's name
       ""      – shown as a separate line beneath both names
     ------------------------------------------------------------------ */
  family: {
    introduction: {
      en: "", // now used as the second name above
      ur: "",
      confirmed: false,
      urduConfirmed: false,
      appliesTo: "",
    },
  },

  /* ------------------------------------------------------------------
     THE WALIMA (the only function on this invitation)
     date  – "YYYY-MM-DD", e.g. "2026-12-20"
     time  – 24-hour "HH:MM" in Pakistan time (PKT, UTC+05:00), e.g. "19:30"
     The countdown only runs when BOTH date and time are filled in.

     Optional display overrides — use these if you want custom wording,
     e.g. dateText: { en: "Saturday, 20 December 2026", ur: "ہفتہ، 20 دسمبر 2026" }
     ------------------------------------------------------------------ */
  event: {
    date: "2026-11-13", // Friday, 13 November 2026
    time: "",
    dateText: { en: "", ur: "" },
    timeText: { en: "", ur: "" },
  },

  /* ------------------------------------------------------------------
     VENUE
     mapsUrl – paste a Google Maps share link (optional). If empty, the
               directions button searches Google Maps for name + address.
     lat/lng – optional exact coordinates, e.g. 31.5204 and 74.3587.
               Used for directions when mapsUrl is empty.
     showEmbeddedMap – lets guests open a small map inside the page
               (it only loads when they tap "Show map").
     ------------------------------------------------------------------ */
  venue: {
    name: { en: "", ur: "" },
    address: { en: "", ur: "" },
    mapsUrl: "",
    lat: null,
    lng: null,
    showEmbeddedMap: true,
  },

  /* ------------------------------------------------------------------
     RSVP VIA WHATSAPP
     whatsappNumber – the host's number in international format.
                      Pakistani example: "923001234567" (or "+92 300 1234567",
                      or "0300 1234567" — it is converted automatically).
     maxGuests      – highest number guests can choose.
     deadline       – optional, e.g. { en: "Kindly reply by 10 December",
                                       ur: "براہِ کرم 10 دسمبر تک جواب دیں" }
     Responses are NOT stored on this website: each guest sends their own
     WhatsApp message to this number.
     ------------------------------------------------------------------ */
  rsvp: {
    whatsappNumber: "",
    maxGuests: 10,
    deadline: { en: "", ur: "" },
  },

  /* ------------------------------------------------------------------
     MUSIC & SOUND
     music.src  – a LICENSED instrumental file you have the rights to use.
                  Copy it into the assets folder and set the path, e.g.
                  src: "assets/wedding-music.mp3". Leave "" if you have none. Audio never starts by itself: it starts
                  after the guest taps "Open your invitation" (if
                  startOnOpen is true) or the music button.
     music.generatedAmbience – if the file above is missing, play a soft,
                  original harp-and-drone ambience generated in the browser.
                  Set to false for silence when no file is supplied.
     openingSound.src – optional short chime file, e.g.
                  "assets/opening-sound.mp3". If empty or missing, a gentle
                  chime is generated in the browser (if synthesizedChime).
     ------------------------------------------------------------------ */
  music: {
    src: "", // e.g. "assets/wedding-music.mp3"
    generatedAmbience: true,
    startOnOpen: true,
    volume: 0.35, // 0.0 – 1.0
  },
  openingSound: {
    src: "", // e.g. "assets/opening-sound.mp3"
    synthesizedChime: true,
    volume: 0.4,
  },

  /* ------------------------------------------------------------------
     FEATURE SWITCHES — set any to false to turn that part off.
     ------------------------------------------------------------------ */
  features: {
    intro: true,      // 3D opening sequence
    particles: true,  // floating gold particles (auto-off on low-power phones)
    parallax: true,   // gentle movement of decorative layers
    countdown: true,
    venue: true,
    rsvp: true,
    music: true,
  },

  /* ------------------------------------------------------------------
     INVITATION WORDING — edit freely. Names, date and venue are filled in
     automatically from the sections above.
     ------------------------------------------------------------------ */
  text: {
    en: {
      bismillahTranslation: "In the Name of Allah, the Most Gracious, the Most Merciful",
      introCordially: "You are cordially invited",
      introTitle: "Walima",
      introSubtitle: "Celebration",
      invitationLead:
        "With the blessings of Allah Almighty and the love and prayers of our family, we cordially invite you to celebrate the Walima of",
      invitationClose: "Your presence and prayers will make this blessed occasion even more memorable.",
      eventTitle: "Walima Celebration",
      closingTitle: "Your Presence Is Our Greatest Gift",
      closingLine: "Looking forward to celebrating this blessed occasion with you.",
    },
    ur: {
      bismillahTranslation: "بسم اللہ الرحمٰن الرحیم",
      introCordially: "آپ کو پُرخلوص دعوت دی جاتی ہے",
      introTitle: "دعوتِ ولیمہ",
      introSubtitle: "",
      invitationLead:
        "اللہ تعالیٰ کے فضل و کرم اور اہلِ خانہ کی دعاؤں کے ساتھ، آپ کو تقریبِ ولیمہ میں شرکت کی پُرخلوص دعوت دی جاتی ہے۔",
      invitationClose: "آپ کی تشریف آوری اور دعائیں ہمارے لیے باعثِ مسرت ہوں گی۔",
      eventTitle: "تقریبِ ولیمہ",
      closingTitle: "آپ کی تشریف آوری ہمارے لیے باعثِ اعزاز ہوگی۔",
      closingLine: "",
    },
  },
};
