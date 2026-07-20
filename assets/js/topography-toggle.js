;(function (global) {
  "use strict"

  function bindTopographyToggle(root, options) {
    if (!root) return function () {}

    var opts = options || {}
    var onProgress = typeof opts.onProgress === "function" ? opts.onProgress : function () {}

    var CONFIG = {
      LOCK_DISTANCE_PX: 8,
      LOCK_RATIO: 1.2,
      DRAG_FULL_DISTANCE_PX: 220,
      COMMIT_DISTANCE_PX: 42,
      VELOCITY_COMMIT: 0.35,
      SETTLE_DURATION_MS: 210,
      CANCEL_DURATION_MS: 150,
      ESCAPE_DURATION_MS: 140,
    }

    var state = {
      committed: 0,
      progress: 0,
      handles: [],
      segments: [],
      dragging: null,
      rafMeasureId: 0,
      rafSettleId: 0,
      resizeObserver: null,
    }

    init()

    return function destroy() {
      unbindEvents()
      teardownObservers()
      cancelSettleAnimation()

      if (state.rafMeasureId) {
        window.cancelAnimationFrame(state.rafMeasureId)
        state.rafMeasureId = 0
      }

      clearHeadingTransforms()
    }

    function init() {
      wrapBodySegments()
      buildHandles()
      syncHandleState()
      bindEvents()
      setupObservers()
      queueMeasure()
    }

    function bindEvents() {
      root.addEventListener("pointerdown", onPointerDown)
      root.addEventListener("pointermove", onPointerMove)
      root.addEventListener("pointerup", onPointerUp)
      root.addEventListener("pointercancel", onPointerCancel)
      document.addEventListener("keydown", onEscape)
      window.addEventListener("resize", queueMeasure)

      if (document.fonts && document.fonts.addEventListener) {
        document.fonts.addEventListener("loadingdone", queueMeasure)
      }
    }

    function unbindEvents() {
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

    function setupObservers() {
      if (typeof ResizeObserver !== "function") return

      state.resizeObserver = new ResizeObserver(function () {
        queueMeasure()
      })

      state.resizeObserver.observe(root)
    }

    function teardownObservers() {
      if (!state.resizeObserver) return
      state.resizeObserver.disconnect()
      state.resizeObserver = null
    }

    function clamp(value, min, max) {
      return Math.min(max, Math.max(min, value))
    }

    function isHeading(node) {
      return !!node && node.nodeType === 1 && /^H[1-6]$/.test(node.tagName)
    }

    function clearHeadingTransforms() {
      var headings = root.querySelectorAll("h1, h2, h3, h4, h5, h6")
      headings.forEach(function (heading) {
        heading.style.transform = ""
      })
    }

    function setProgress(next) {
      state.progress = clamp(next, 0, 1)
      root.style.setProperty("--topography-progress", String(state.progress))
      root.setAttribute(
        "data-topography-mode",
        state.progress >= 1 ? "collapsed" : state.progress <= 0 ? "open" : "mixed",
      )
      onProgress(state.progress)
    }

    function setCommitted(target) {
      state.committed = target >= 0.5 ? 1 : 0
    }

    function syncHandleState() {
      var collapsed = state.committed === 1
      state.handles.forEach(function (button) {
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
      if (state.rafSettleId) {
        window.cancelAnimationFrame(state.rafSettleId)
        state.rafSettleId = 0
      }

      root.classList.remove("is-topography-settling")
    }

    function animateTo(target, durationMs, options) {
      cancelSettleAnimation()

      var opts = options || {}
      var shouldCommit = !!opts.commit
      var shouldVibrate = !!opts.vibrate
      var from = state.progress
      var delta = target - from
      var startedAt = 0

      if (Math.abs(delta) < 0.001) {
        setProgress(target)
        if (shouldCommit) setCommitted(target)
        syncHandleState()
        if (shouldVibrate) vibrateIfPossible()
        return
      }

      root.classList.add("is-topography-settling")

      function easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3)
      }

      function tick(ts) {
        if (!startedAt) startedAt = ts

        var elapsed = ts - startedAt
        var t = clamp(elapsed / durationMs, 0, 1)
        var eased = easeOutCubic(t)

        setProgress(from + delta * eased)

        if (t < 1) {
          state.rafSettleId = window.requestAnimationFrame(tick)
          return
        }

        state.rafSettleId = 0
        root.classList.remove("is-topography-settling")
        setProgress(target)

        if (shouldCommit) setCommitted(target)
        syncHandleState()
        if (shouldVibrate) vibrateIfPossible()
      }

      state.rafSettleId = window.requestAnimationFrame(tick)
    }

    function toggleFromHandle() {
      var target = state.committed === 1 ? 0 : 1
      animateTo(target, CONFIG.SETTLE_DURATION_MS, {
        commit: true,
        vibrate: true,
      })
    }

    function queueMeasure() {
      if (state.rafMeasureId) return

      state.rafMeasureId = window.requestAnimationFrame(function () {
        state.rafMeasureId = 0
        measureSegments()
      })
    }

    function measureSegments() {
      state.segments.forEach(function (segment) {
        segment.style.removeProperty("--segment-height")
      })

      state.segments.forEach(function (segment) {
        var height = Math.ceil(segment.scrollHeight)
        segment.style.setProperty("--segment-height", height + "px")
      })

      setProgress(state.progress)
    }

    function wrapBodySegments() {
      var childNodes = Array.prototype.slice.call(root.childNodes)
      var pending = []
      var collected = []

      function flush(beforeNode) {
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
        collected.push(segment)
        pending = []
      }

      childNodes.forEach(function (node) {
        if (isHeading(node)) {
          flush(node)
          return
        }

        if (node.nodeType === 3 && !node.textContent.trim()) {
          pending.push(node)
          return
        }

        pending.push(node)
      })

      flush(null)
      state.segments = collected
    }

    function buildHandles() {
      var headings = root.querySelectorAll("h1, h2, h3, h4, h5, h6")
      state.handles = []

      headings.forEach(function (heading) {
        var existing = heading.querySelector(".topography-handle")
        if (existing) {
          state.handles.push(existing)
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
          toggleFromHandle()
        })

        handle.addEventListener("keydown", function (event) {
          if (event.key !== "Enter" && event.key !== " ") return
          event.preventDefault()
          toggleFromHandle()
        })

        heading.appendChild(handle)
        state.handles.push(handle)
      })
    }

    function shouldTrackGesture(pointerType, target) {
      if (pointerType === "mouse") return false
      if (!target) return false
      if (target.closest(".topography-handle")) return false
      return !!target.closest("h1, h2, h3, h4, h5, h6")
    }

    function releasePointerCaptureSafe(dragState, pointerId) {
      if (!dragState || !dragState.headingNode) return
      var headingNode = dragState.headingNode

      if (!headingNode.releasePointerCapture || !headingNode.hasPointerCapture) return
      if (!headingNode.hasPointerCapture(pointerId)) return

      headingNode.releasePointerCapture(pointerId)
    }

    function clearDragState(pointerId) {
      var dragState = state.dragging
      if (!dragState) return null

      releasePointerCaptureSafe(dragState, pointerId)
      state.dragging = null
      root.classList.remove("is-topography-dragging")
      return dragState
    }

    function onPointerDown(event) {
      if (!shouldTrackGesture(event.pointerType, event.target)) return

      cancelSettleAnimation()
      clearHeadingTransforms()

      var headingNode = event.target.closest("h1, h2, h3, h4, h5, h6")

      state.dragging = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        startProgress: state.progress,
        startCommitted: state.committed,
        lastX: event.clientX,
        lastT: event.timeStamp,
        velocityX: 0,
        locked: false,
        headingNode: headingNode,
      }

      if (headingNode && headingNode.setPointerCapture) {
        headingNode.setPointerCapture(event.pointerId)
      }
    }

    function onPointerMove(event) {
      var dragState = state.dragging
      if (!dragState || event.pointerId !== dragState.pointerId) return

      var dx = event.clientX - dragState.startX
      var dy = event.clientY - dragState.startY

      var dt = event.timeStamp - dragState.lastT
      if (dt > 0) {
        dragState.velocityX = (event.clientX - dragState.lastX) / dt
      }
      dragState.lastX = event.clientX
      dragState.lastT = event.timeStamp

      if (!dragState.locked) {
        if (Math.abs(dx) < CONFIG.LOCK_DISTANCE_PX) return

        if (Math.abs(dx) <= Math.abs(dy) * CONFIG.LOCK_RATIO) {
          clearDragState(event.pointerId)
          return
        }

        dragState.locked = true
        root.classList.add("is-topography-dragging")
      }

      event.preventDefault()

      var next = dragState.startProgress + dx / CONFIG.DRAG_FULL_DISTANCE_PX
      setProgress(next)
      syncHandleState()
    }

    function onPointerUp(event) {
      var dragState = state.dragging
      if (!dragState || event.pointerId !== dragState.pointerId) return

      clearDragState(event.pointerId)
      if (!dragState.locked) return

      var totalDx = event.clientX - dragState.startX
      var absDx = Math.abs(totalDx)
      var absVx = Math.abs(dragState.velocityX)
      var committed = absDx >= CONFIG.COMMIT_DISTANCE_PX || absVx >= CONFIG.VELOCITY_COMMIT

      if (committed) {
        var target = totalDx > 0 || dragState.velocityX > 0 ? 1 : 0
        animateTo(target, CONFIG.SETTLE_DURATION_MS, {
          commit: true,
          vibrate: true,
        })
        return
      }

      animateTo(dragState.startCommitted, CONFIG.CANCEL_DURATION_MS, {
        commit: false,
        vibrate: false,
      })
    }

    function onPointerCancel(event) {
      var dragState = state.dragging
      if (!dragState || event.pointerId !== dragState.pointerId) return

      clearDragState(event.pointerId)

      animateTo(dragState.startCommitted, CONFIG.CANCEL_DURATION_MS, {
        commit: false,
        vibrate: false,
      })
    }

    function onEscape(event) {
      if (event.key !== "Escape") return
      if (!state.dragging && !state.rafSettleId) return

      if (state.dragging) clearDragState(state.dragging.pointerId)

      animateTo(state.committed, CONFIG.ESCAPE_DURATION_MS, {
        commit: false,
        vibrate: false,
      })
    }
  }

  global.TopographyToggle = {
    bindTopographyToggle: bindTopographyToggle,
  }
})(window)
