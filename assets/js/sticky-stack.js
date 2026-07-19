;(function () {
  var root = document.querySelector(".post-content")
  if (!root) return

  var api = window.StickyHeadings
  if (!api || typeof api.bindStickyHeadings !== "function") return

  api.bindStickyHeadings(root)
})()
