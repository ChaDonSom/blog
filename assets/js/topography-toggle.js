;(function () {
  var root = document.querySelector(".post-content")
  if (!root) return

  var api = window.TopographyToggle
  if (!api || typeof api.bindTopographyToggle !== "function") return

  api.bindTopographyToggle(root)

  var topographyApi = window.TopographyToggle
  if (!topographyApi || typeof topographyApi.bindTopographyToggle !== "function") return

  topographyApi.bindTopographyToggle(root)
})()
