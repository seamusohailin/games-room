/* Games Room results recorder.
   Each game in games/<id>/ loads it with <script src="../../results.js"></script> in <head>.
   It records who is playing, each question answered and whether the game was finished,
   keeps them on the iPad, and sends them to the family's results sheet when online.

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
*/
(function () {
  var ENDPOINT = "";            // the results sheet's web app address
  var KEY = "gr-2026-kq7";
  var QKEY = "gamesroom-queue-v1";

  function store(get, k, v) {
    try { if (get) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; }
  }
  function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 8); }
  function now() { return new Date().toISOString(); }

  function player() {
    var p = null;
    try { p = sessionStorage.getItem("gamesroom-player"); } catch (e) {}
    if (!p) p = store(true, "gamesroom-last-player");
    return p || "unknown";
  }

  var queue = [];
  try { queue = JSON.parse(store(true, QKEY) || "[]"); } catch (e) { queue = []; }
  function saveQueue() { if (queue.length > 3000) queue = queue.slice(-3000); store(false, QKEY, JSON.stringify(queue)); }
  function push(ev) { ev.id = uid(); ev.t = now(); ev.player = player(); queue.push(ev); saveQueue(); schedule(); }

  var sending = false, timer = null;
  function schedule() { if (!timer) timer = setTimeout(function () { timer = null; flush(); }, 1500); }
  function flush(onLeave) {
    if (!ENDPOINT || !queue.length || (navigator.onLine === false)) return;
    if (sending && !onLeave) return;
    sending = true;
    var batch = queue.slice(0, 200);
    fetch(ENDPOINT, { method: "POST", keepalive: !!onLeave, headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ k: KEY, events: batch }) })
      .then(function (r) { return r.json(); })
      .then(function (res) {
        if (res && res.ok) {
          var ids = {}; batch.forEach(function (e) { ids[e.id] = 1; });
          queue = queue.filter(function (e) { return !ids[e.id]; }); saveQueue();
          if (queue.length) schedule();
        }
      })
      .catch(function () {})
      .then(function () { sending = false; });
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
    key: function (base) { return base + "::" + player(); },
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
    pending: function () { return queue.length; },
    flush: flush
  };
  window.GR = GR;

  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "hidden") {
      if (S && !S.finished) { S.status = "left part-way"; sessionEvent(); }
      flush(true);
    } else { if (S && !S.finished) S.status = "playing"; flush(); }
  });
  window.addEventListener("pagehide", function () { flush(true); });
  window.addEventListener("online", flush);
  setTimeout(flush, 2000);
})();
