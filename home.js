/* Adds a small "back to the Games Room" button to a game kept in this site.
   Each game in games/<id>/index.html loads it with:
   <script src="../../home.js"></script>   (just before </body>) */
(function () {
  if (window.self !== window.top) return;
  var a = document.createElement("a");
  a.href = "../../index.html";
  a.setAttribute("aria-label", "Back to the Games Room");
  a.title = "Games Room";
  a.innerHTML = '<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path d="M3 11.2 12 3.5l9 7.7V21h-6.2v-6H9.2v6H3z" fill="currentColor"/></svg>';
  a.style.cssText = [
    "position:fixed", "z-index:2147483000",
    "left:calc(12px + env(safe-area-inset-left, 0px))",
    "bottom:calc(12px + env(safe-area-inset-bottom, 0px))",
    "width:50px", "height:50px", "border-radius:50%",
    "display:flex", "align-items:center", "justify-content:center",
    "background:#1F2A4D", "color:#FFD34D", "border:3px solid #FFD34D",
    "box-shadow:0 3px 0 rgba(0,0,0,.35)", "text-decoration:none", "opacity:.92"
  ].join(";");
  document.body.appendChild(a);
})();
