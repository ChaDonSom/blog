;(function () {
  var root = document.querySelector(".post-content")
  if (!root) return

  var api = window.StickyHeadings
  if (!api || typeof api.bindStickyHeadings !== "function") return

  api.bindStickyHeadings(root)

  var topographyApi = window.TopographyToggle
  if (!topographyApi || typeof topographyApi.bindTopographyToggle !== "function") return

  topographyApi.bindTopographyToggle(root, {
    onProgress: function () {
      if (root.classList.contains("is-topography-dragging")) return
      if (root.classList.contains("is-topography-settling")) return
      window.dispatchEvent(new Event("scroll"))
    },
  })
})()
