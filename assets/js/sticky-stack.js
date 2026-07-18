;(function () {
  var root = document.querySelector(".post-content")
  if (!root) return

  var selector = "h1,h2,h3,h4,h5,h6"
  var attr = "data-sticky-active"

  function levelOf(el) {
    var m = el.tagName.match(/^H([1-6])$/)
    return Number(m && m[1]) || 0
  }

  function collect() {
    var arr = []
    root.querySelectorAll(selector).forEach(function (node, index) {
      var level = levelOf(node)
      if (!level) return
      var rect = node.getBoundingClientRect()
      arr.push({
        node: node,
        level: level,
        top: rect.top,
        height: Math.ceil(rect.height),
        index: index,
      })
    })
    return arr
  }

  function stickyTopFromActive(activeByLevel, level) {
    var top = 0
    for (var l = 1; l < level; l += 1) {
      var active = activeByLevel[l]
      if (active) top += active.height
    }
    return top
  }

  function applyStickyTops(activeByLevel) {
    for (var level = 1; level <= 6; level += 1) {
      root.style.setProperty("--heading-sticky-top-" + level, stickyTopFromActive(activeByLevel, level) + "px")
    }
  }

  function nearestParent(activeByLevel, level) {
    for (var p = level - 1; p >= 1; p -= 1) {
      if (activeByLevel[p]) return p
    }
    return 0
  }

  function nextBoundary(headings, current) {
    for (var i = current.index + 1; i < headings.length; i += 1) {
      if (headings[i].level < current.level) return i
    }
    return headings.length
  }

  function nextPeer(headings, current, end) {
    for (var i = current.index + 1; i < end; i += 1) {
      if (headings[i].level === current.level) return headings[i]
    }
    return null
  }

  function updateActive() {
    var headings = collect()
    var activeByLevel = [null, null, null, null, null, null, null]

    for (var i = 0; i < headings.length; i += 1) {
      var heading = headings[i]
      var stickyTop = stickyTopFromActive(activeByLevel, heading.level)
      if (heading.top > stickyTop + 0.5) break
      activeByLevel[heading.level] = heading
      for (var l = heading.level + 1; l <= 6; l += 1) activeByLevel[l] = null
    }

    applyStickyTops(activeByLevel)

    var parentByLevel = [0, 0, 0, 0, 0, 0, 0]
    for (var level = 1; level <= 6; level += 1) {
      if (!activeByLevel[level]) continue
      parentByLevel[level] = nearestParent(activeByLevel, level)
    }

    var stackH = [0, 0, 0, 0, 0, 0, 0]
    for (var levelA = 1; levelA <= 6; levelA += 1) {
      var active = activeByLevel[levelA]
      if (active) stackH[levelA] = active.height
    }
    for (var levelB = 6; levelB >= 1; levelB -= 1) {
      var parent = parentByLevel[levelB]
      if (parent) stackH[parent] += stackH[levelB]
    }

    var pushBy = new Map()
    for (var levelC = 1; levelC <= 6; levelC += 1) {
      var current = activeByLevel[levelC]
      if (!current) continue

      var currentStickyTop = stickyTopFromActive(activeByLevel, levelC)
      var stack = stackH[levelC] || current.height
      var end = nextBoundary(headings, current)
      var peer = nextPeer(headings, current, end)

      var ownPush = peer ? Math.min(0, peer.top - (currentStickyTop + stack)) : 0
      var parentLevel = parentByLevel[levelC]
      var inherited = parentLevel && activeByLevel[parentLevel] ? pushBy.get(activeByLevel[parentLevel]) || 0 : 0

      pushBy.set(current, Math.min(ownPush, inherited))
    }

    var activeSet = new Set(activeByLevel.filter(Boolean))
    headings.forEach(function (h) {
      if (activeSet.has(h)) h.node.setAttribute(attr, "true")
      else h.node.removeAttribute(attr)

      h.node.style.transform = ""
      if (activeSet.has(h)) {
        var py = pushBy.get(h)
        if ((py || 0) < 0) h.node.style.transform = "translateY(" + py + "px)"
      }
    })
  }

  var raf = 0
  function schedule() {
    if (raf) return
    raf = requestAnimationFrame(function () {
      raf = 0
      updateActive()
    })
  }

  var observer = new MutationObserver(schedule)
  observer.observe(root, { childList: true, subtree: true, characterData: true })

  addEventListener("scroll", schedule, { passive: true })
  addEventListener("resize", schedule)

  if (document.fonts && document.fonts.addEventListener) {
    document.fonts.addEventListener("loadingdone", schedule)
  }

  schedule()
})()
