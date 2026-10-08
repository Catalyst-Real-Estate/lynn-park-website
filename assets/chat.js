/*
 * Shared chat loader for Catalyst property sites.
 * Lives in Catalyst-Real-Estate/property-site-theme and syncs to every property repo.
 * To change the chat vendor or site key, edit THIS file in property-site-theme only.
 * Include once per page, just before </body>:
 *   <script src="assets/chat.js"></script>        (root pages)
 *   <script src="../assets/chat.js"></script>     (pages one folder down)
 */
(function () {
  if (document.querySelector('script[src*="embed.wayline.com"]')) return;
  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://embed.wayline.com/v1.js';
  s.setAttribute('data-site-key', 'ce992963-062a-4b40-9640-19711b23f371');
  (document.body || document.head).appendChild(s);
})();
