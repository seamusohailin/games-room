/* Games Room results recorder.
   Each game in games/<id>/ loads it with <script src="../../results.js"></script> in <head>.
   It records who is playing, each question answered and whether the game was finished,
   keeps them on the iPad, and sends them to the family's results sheet when online.

   Test mode (for grown-ups): add ?test=maeve or ?test=maggie to a game's address.
   The game then plays as that girl, but nothing is recorded or sent, and its saved progress
   is kept apart from hers. A banner shows while test mode is on.

   For game authors:
     GR.player()                     "maggie", "maeve" or "unknown" (from the name tapped in the Games Room)
     GR.key("my-save")               a save key that is separate for each girl
     GR.start("game-id")             begin a session (call once when play starts)
     GR.part("Stop 2")               name the part being played now
     var q = GR.ask({ item, concept, area })   start timing a question
       q.miss("what she chose")      a wrong attempt
       q.hint()                      she used a hint
       q.done()                      she got it right (records the answer)
       q.giveUp()                    she moved on without getting it right
     GR.partDone("Stop 2")           a part has been finished
     GR.finish()                     the whole game is finished
     GR.write({ prompt, text, game, part, area })   save something she typed (sent a few seconds after she stops typing;
                                     one row per girl, game, prompt and day, updated as she edits)
*/
(function () {
  var ENDPOINT = "https://script.google.com/macros/s/AKfycbxT8gXunqCv31jiyprsQu-TfLpLuyV7akTTf2j5oypMR0v-05QTwmQ6Rvh3IpamaW7M/exec"; // the results sheet's web app address
  var QKEY = "gamesroom-queue-v1";
  var PKEY = "gamesroom-pairing";      // the pairing code typed into "Pair this iPad"
  var BADKEY = "gamesroom-pairing-refused";

  function store(get, k, v) {
    try { if (get) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; }
  }
  function uid() {
    try {
      var a = new Uint32Array(3); crypto.getRandomValues(a);
      return Date.now().toString(36) + Array.prototype.map.call(a, function (n) { return n.toString(36); }).join("");
    } catch (e) { return Date.now().toString(36) + Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2); }
  }
  function device() {
    var d = store(true, "gamesroom-device");
    if (!d) { d = uid(); store(false, "gamesroom-device", d); }
    return d;
  }
  function code() { return store(true, PKEY) || ""; }
  function refused() { return store(true, BADKEY) === "1"; }
  function now() { return new Date().toISOString(); }

  var TEST = null;
  try { var m = /[?&]test(?:=(maeve|maggie))?(?:&|$)/.exec(location.search); if (m) TEST = m[1] || "maggie"; } catch (e) {}

  function player() {
    if (TEST) return TEST;
    var p = null;
    try { p = sessionStorage.getItem("gamesroom-player"); } catch (e) {}
    if (!p) p = store(true, "gamesroom-last-player");
    return p || "unknown";
  }

  var queue = [];
  try { queue = JSON.parse(store(true, QKEY) || "[]"); } catch (e) { queue = []; }
  function saveQueue() { if (queue.length > 3000) queue = queue.slice(-3000); store(false, QKEY, JSON.stringify(queue)); }
  function push(ev) { if (TEST) return; ev.id = uid(); ev.t = now(); ev.player = player(); queue.push(ev); saveQueue(); schedule(); }

  var sending = false, timer = null;
  function schedule() { if (!timer) timer = setTimeout(function () { timer = null; flush(); }, 1500); }
  function flush(onLeave) {
    if (!ENDPOINT || !queue.length || (navigator.onLine === false) || !code() || refused()) return;
    if (sending && !onLeave) return;
    sending = true;
    var batch = queue.slice(0, 200);
    fetch(ENDPOINT, { method: "POST", keepalive: !!onLeave, headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ k: code(), events: batch }) })
      .then(function (r) { return r.json(); })
      .then(function (res) {
        if (res && res.ok) {
          var ids = {}; batch.forEach(function (e) { ids[e.id] = 1; });
          queue = queue.filter(function (e) { return !ids[e.id]; }); saveQueue();
          if (queue.length) schedule();
        } else if (res && res.reason === "pairing") {
          store(false, BADKEY, "1");   // stop sending until this device is paired again
        }
      })
      .catch(function () {})
      .then(function () { sending = false; });
  }

  var drafts = {}, draftTimer = null;
  function pushDrafts() {
    clearTimeout(draftTimer); draftTimer = null;
    Object.keys(drafts).forEach(function (w) { push(drafts[w]); });
    drafts = {};
  }

  var S = null; // the current session
  function sessionEvent() {
    if (!S) return;
    push({ type: "session", game: S.game, session: S.id, started: S.started, finished: S.finished,
      status: S.finished ? "finished" : S.status, partsDone: S.partsDone.length, questions: S.questions,
      firstRight: S.firstRight, hints: S.hints, secs: Math.round((Date.now() - S.t0) / 1000), lastPart: S.part });
  }

  var GR = {
    player: player,
    key: function (base) { return base + "::" + (TEST ? "test-" : "") + player(); },
    testing: function () { return !!TEST; },
    start: function (game) {
      if (S && S.game === game && !S.finished) return S.id;
      S = { id: uid(), game: game, started: now(), t0: Date.now(), part: "", partsDone: [], questions: 0, firstRight: 0, hints: 0, finished: false, status: "playing" };
      sessionEvent();
      return S.id;
    },
    part: function (name) { if (S) S.part = name; },
    partDone: function (name) {
      if (!S) return;
      if (S.partsDone.indexOf(name) < 0) S.partsDone.push(name);
      sessionEvent();
    },
    finish: function () { if (!S) return; S.finished = true; sessionEvent(); flush(); },
    ask: function (q) {
      var t0 = q.since || Date.now(), wrong = [], hint = false, closed = false;
      function close(right) {
        if (closed || !S) return; closed = true;
        var firstTry = right && wrong.length === 0 && !hint;
        S.questions++; if (firstTry) S.firstRight++; if (hint) S.hints++;
        push({ type: "answer", game: S.game, session: S.id, part: q.part || S.part, item: q.item, concept: q.concept || "",
          area: q.area || "", firstTry: firstTry, attempts: wrong.length + (right ? 1 : 0), hint: hint,
          secs: Math.round((Date.now() - t0) / 1000), wrong: wrong.slice(0, 8) });
      }
      return {
        miss: function (given) { if (!closed) wrong.push(given == null ? "?" : String(given)); },
        hint: function () { hint = true; },
        done: function () { close(true); },
        giveUp: function () { close(false); },
        missed: function () { return wrong.length; }
      };
    },
    write: function (w) {
      if (!w || w.text == null) return;
      var d = new Date(), day = d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2);
      var game = w.game || (S && S.game) || "unknown";
      var wid = [device(), player(), game, w.prompt || "", day].join("|");
      drafts[wid] = { type: "writing", wid: wid, game: game, session: S ? S.id : "", part: w.part || (S && S.part) || "",
        prompt: w.prompt || "", text: String(w.text).slice(0, 5000), area: w.area || "" };
      clearTimeout(draftTimer); draftTimer = setTimeout(pushDrafts, 4000);
    },
    pending: function () { return queue.length; },
    paired: function () { return !!code() && !refused(); },
    pair: function (c, cb) {
      c = String(c || "").trim();
      if (!ENDPOINT) { cb && cb(false, "No results sheet address is set."); return; }
      if (c.length < 8) { cb && cb(false, "The code needs at least 8 characters."); return; }
      fetch(ENDPOINT, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify({ k: c, events: [] }) })
        .then(function (r) { return r.json(); })
        .then(function (res) {
          if (res && res.ok) {
            store(false, PKEY, c); store(false, BADKEY, "0"); flush();
            cb && cb(true, "Paired. Results from this device now go to the results sheet.");
          } else if (res && res.reason === "not set up") {
            cb && cb(false, "The results sheet has no pairing code yet. Add PAIRING_CODE in Apps Script, then try again.");
          } else {
            cb && cb(false, "That code wasn't accepted. Check it and try again.");
          }
        })
        .catch(function () { cb && cb(false, "Couldn't reach the results sheet. Check the internet connection and try again."); });
    },
    unpair: function () { store(false, PKEY, ""); },
    endpoint: function () { return ENDPOINT; },
    flush: flush
  };
  window.GR = GR;

  if (TEST) {
    var showBanner = function () {
      var b = document.createElement("div");
      b.textContent = "Test mode: playing as " + (TEST === "maeve" ? "Maeve" : "Maggie") + ". Nothing is recorded.";
      b.style.cssText = "position:fixed;z-index:2147483001;top:0;left:0;right:0;padding:6px 12px;padding-top:calc(6px + env(safe-area-inset-top,0px));background:#C92A2A;color:#fff;font:600 14px system-ui,sans-serif;text-align:center;pointer-events:none;opacity:.92";
      document.body.appendChild(b);
    };
    if (document.body) showBanner(); else document.addEventListener("DOMContentLoaded", showBanner);
  }

  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "hidden") {
      pushDrafts();
      if (S && !S.finished) { S.status = "left part-way"; sessionEvent(); }
      flush(true);
    } else { if (S && !S.finished) S.status = "playing"; flush(); }
  });
  window.addEventListener("pagehide", function () { pushDrafts(); flush(true); });
  window.addEventListener("online", flush);
  setTimeout(flush, 2000);
})();
