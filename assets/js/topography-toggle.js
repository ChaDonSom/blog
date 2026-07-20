;(function (global) {
  "use strict"

  function bindTopographyToggle(root, options) {
    if (!root) return function () {}

    var opts = options || {}
    var onProgress = typeof opts.onProgress === "function" ? opts.onProgress : function () {}

    var mode = "open"
    var progress = 0
    var handles = []
    var segments = []
    var rafId = 0
    var settleRafId = 0
    var dragging = null
    var resizeObserver = null

    var LOCK_DISTANCE_PX = 8
    var LOCK_RATIO = 1.2
    var DRAG_FULL_DISTANCE_PX = 220
    var SETTLE_DURATION_MS = 210
    var VELOCITY_COMMIT = 0.35

    function isHeading(node) {
      return !!node && node.nodeType === 1 && /^H[1-6]$/.test(node.tagName)
    }

    function clamp(value, min, max) {
      return Math.min(max, Math.max(min, value))
    }

    function updateModeFromProgress() {
      mode = progress >= 0.5 ? "collapsed" : "open"
    }

    function setProgress(nextProgress) {
      progress = clamp(nextProgress, 0, 1)
      root.style.setProperty("--topography-progress", String(progress))
      root.setAttribute("data-topography-mode", progress >= 1 ? "collapsed" : progress <= 0 ? "open" : "mixed")
      onProgress(progress)
    }

    function setButtonState() {
      var collapsed = mode === "collapsed"
      handles.forEach(function (button) {
        button.setAttribute("aria-pressed", collapsed ? "true" : "false")
        button.setAttribute("aria-label", collapsed ? "Expand article body" : "Collapse article body")
        button.setAttribute("title", collapsed ? "Expand article body" : "Collapse article body")
      })
    }

    function vibrateIfPossible() {
      var canVibrate =
        typeof navigator !== "undefined" &&
        typeof navigator.vibrate === "function" &&
        typeof window.matchMedia === "function" &&
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches
      if (!canVibrate) return
      navigator.vibrate(8)
    }

    function cancelSettleAnimation() {
      if (!settleRafId) return
      window.cancelAnimationFrame(settleRafId)
      settleRafId = 0
    }

    function animateTo(target, durationMs) {
      cancelSettleAnimation()

      var from = progress
      var start = 0
      var delta = target - from
      if (Math.abs(delta) < 0.001) {
        setProgress(target)
        mode = target >= 0.5 ? "collapsed" : "open"
        setButtonState()
        vibrateIfPossible()
        return
      }

      root.classList.add("is-topography-settling")

      function easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3)
      }

      function tick(ts) {
        if (!start) start = ts
        var elapsed = ts - start
        var t = clamp(elapsed / durationMs, 0, 1)
        var eased = easeOutCubic(t)
        setProgress(from + delta * eased)

        if (t < 1) {
          settleRafId = window.requestAnimationFrame(tick)
          return
        }

        settleRafId = 0
        mode = target >= 0.5 ? "collapsed" : "open"
        setProgress(target)
        setButtonState()
        root.classList.remove("is-topography-settling")
        vibrateIfPossible()
      }

      settleRafId = window.requestAnimationFrame(tick)
    }

    function toggleMode() {
      var target = mode === "collapsed" ? 0 : 1
      animateTo(target, SETTLE_DURATION_MS)
    }

    function queueMeasure() {
      if (rafId) return
      rafId = window.requestAnimationFrame(function () {
        rafId = 0
        measureSegments()
      })
    }

    function measureSegments() {
      segments.forEach(function (segment) {
        segment.style.removeProperty("--segment-height")
      })

      segments.forEach(function (segment) {
        var height = Math.ceil(segment.scrollHeight)
        segment.style.setProperty("--segment-height", height + "px")
      })

      setProgress(progress)
    }

    function wrapBodySegments() {
      var childNodes = Array.prototype.slice.call(root.childNodes)
      var pending = []
      var segmentRecords = []

      function flushPending(beforeNode) {
        if (!pending.length) return

        var segment = document.createElement("div")
        segment.className = "topography-segment"
        segment.setAttribute("data-topography-segment", "")

        var inner = document.createElement("div")
        inner.className = "topography-segment__inner"
        segment.appendChild(inner)

        pending.forEach(function (node) {
          inner.appendChild(node)
        })

        root.insertBefore(segment, beforeNode || null)
        segmentRecords.push(segment)
        pending = []
      }

      childNodes.forEach(function (node) {
        if (isHeading(node)) {
          flushPending(node)
          return
        }

        if (node.nodeType === 3 && !node.textContent.trim()) {
          pending.push(node)
          return
        }

        pending.push(node)
      })

      flushPending(null)
      segments = segmentRecords
    }

    function buildHandles() {
      var headings = root.querySelectorAll("h1, h2, h3, h4, h5, h6")
      handles = []

      headings.forEach(function (heading) {
        if (heading.querySelector(".topography-handle")) {
          handles.push(heading.querySelector(".topography-handle"))
          return
        }

        var handle = document.createElement("button")
        handle.type = "button"
        handle.className = "topography-handle"
        handle.setAttribute("aria-pressed", "false")
        handle.setAttribute("aria-label", "Collapse article body")
        handle.setAttribute("title", "Collapse article body")

        handle.addEventListener("click", function (event) {
          event.preventDefault()
          toggleMode()
        })

        handle.addEventListener("keydown", function (event) {
          if (event.key !== "Enter" && event.key !== " ") return
          event.preventDefault()
          toggleMode()
        })

        heading.appendChild(handle)
        handles.push(handle)
      })
    }

    function shouldTrackGesture(pointerType, target) {
      if (pointerType === "mouse") return false
      if (!target) return false
      if (target.closest(".topography-handle")) return false
      var heading = target.closest("h1, h2, h3, h4, h5, h6")
      return !!heading
    }

    function onPointerDown(event) {
      if (!shouldTrackGesture(event.pointerType, event.target)) return
      cancelSettleAnimation()

      dragging = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        startProgress: progress,
        locked: false,
        lastX: event.clientX,
        lastT: event.timeStamp,
        velocityX: 0,
      }
    }

    function onPointerMove(event) {
      if (!dragging || event.pointerId !== dragging.pointerId) return

      var dx = event.clientX - dragging.startX
      var dy = event.clientY - dragging.startY

      var dt = event.timeStamp - dragging.lastT
      if (dt > 0) {
        dragging.velocityX = (event.clientX - dragging.lastX) / dt
      }
      dragging.lastX = event.clientX
      dragging.lastT = event.timeStamp

      if (!dragging.locked) {
        if (Math.abs(dx) < LOCK_DISTANCE_PX) return
        if (Math.abs(dx) <= Math.abs(dy) * LOCK_RATIO) {
          dragging = null
          return
        }

        dragging.locked = true
        root.classList.add("is-topography-dragging")
      }

      event.preventDefault()
      var next = dragging.startProgress + dx / DRAG_FULL_DISTANCE_PX
      setProgress(next)
      updateModeFromProgress()
      setButtonState()
    }

    function onPointerUp(event) {
      if (!dragging || event.pointerId !== dragging.pointerId) return

      var wasLocked = dragging.locked
      var velocityX = dragging.velocityX
      dragging = null
      root.classList.remove("is-topography-dragging")

      if (!wasLocked) return

      var target = 0
      if (Math.abs(velocityX) > VELOCITY_COMMIT) target = velocityX > 0 ? 1 : 0
      else target = progress >= 0.5 ? 1 : 0

      animateTo(target, SETTLE_DURATION_MS)
    }

    function onPointerCancel(event) {
      if (!dragging || event.pointerId !== dragging.pointerId) return
      dragging = null
      root.classList.remove("is-topography-dragging")
      animateTo(mode === "collapsed" ? 1 : 0, 150)
    }

    function onEscape(event) {
      if (event.key !== "Escape") return
      if (!dragging && !settleRafId) return
      dragging = null
      root.classList.remove("is-topography-dragging")
      animateTo(mode === "collapsed" ? 1 : 0, 140)
    }

    function setupObservers() {
      if (typeof ResizeObserver === "function") {
        resizeObserver = new ResizeObserver(function () {
          queueMeasure()
        })
        resizeObserver.observe(root)
      }

      window.addEventListener("resize", queueMeasure)
      if (document.fonts && document.fonts.addEventListener) {
        document.fonts.addEventListener("loadingdone", queueMeasure)
      }
    }

    function setupEvents() {
      root.addEventListener("pointerdown", onPointerDown)
      root.addEventListener("pointermove", onPointerMove)
      root.addEventListener("pointerup", onPointerUp)
      root.addEventListener("pointercancel", onPointerCancel)
      document.addEventListener("keydown", onEscape)
    }

    function teardownEvents() {
      root.removeEventListener("pointerdown", onPointerDown)
      root.removeEventListener("pointermove", onPointerMove)
      root.removeEventListener("pointerup", onPointerUp)
      root.removeEventListener("pointercancel", onPointerCancel)
      document.removeEventListener("keydown", onEscape)
      window.removeEventListener("resize", queueMeasure)
      if (document.fonts && document.fonts.removeEventListener) {
        document.fonts.removeEventListener("loadingdone", queueMeasure)
      }
    }

    wrapBodySegments()
    buildHandles()
    setButtonState()
    setupEvents()
    setupObservers()
    queueMeasure()

    return function destroy() {
      teardownEvents()
      cancelSettleAnimation()
      if (resizeObserver) resizeObserver.disconnect()
      if (rafId) window.cancelAnimationFrame(rafId)
    }
  }

  global.TopographyToggle = {
    bindTopographyToggle: bindTopographyToggle,
  }
})(window)
