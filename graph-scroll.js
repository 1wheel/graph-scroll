(function(){
  var d3 = this.d3 || undefined
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      d3 = require('d3')
      exports = module.exports = graphScroll;
    }
    exports.graphScroll = graphScroll;
  } else {
    this.graphScroll = graphScroll;
  }

  function graphScroll() {
    var windowHeight,
        dispatch = d3.dispatch("scroll", "active"),
        sections = d3.select('null'),
        i = -1,
        sectionPos = [],
        n,
        graph = d3.select('null'),
        isFixed = null,
        isBelow = null,
        container = d3.select('body'),
        containerStart = 0,
        belowStart,
        eventId = Math.random(), 
        stickyTop,
        lastPageY = -Infinity,
        triggerAt = 'top',
        offset = 0;

    function reposition(){
      var i1 = 0
      var viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
      
      // If our lastPageY variable is our default but we're farther than the scroll top, then we are entering the page from somewhere not the top
      if (lastPageY == -Infinity && pageYOffset > 0) {
        direction = 'jump'
      } else if (pageYOffset > lastPageY) {
        direction = 'down'
      } else {
        direction = 'up'
      }

      sectionPos.forEach(function(d, i){
        // Trigger active section when it gets to the middle of the viewport
        if (triggerAt == 'middle' && d < (pageYOffset - containerStart + viewportHeight / 2 + offset) ) {
          i1 = i
        // Or at the top of the viewport
        } else if (triggerAt == 'top' && d < pageYOffset - containerStart + offset) {
          i1 = i
        }
      })

      i1 = Math.min(n - 1, i1)
      if (i != i1){
        sections.classed('graph-scroll-active', function(d, i){ return i === i1 })

        dispatch.active.call(sections[0][i1], i1, direction)

        i = i1
      }
      var yStickyOffset = stickyTop || 0

      var isBelow1 = pageYOffset + yStickyOffset > belowStart
      if (isBelow != isBelow1){
        isBelow = isBelow1
        graph.classed('graph-scroll-below', isBelow)
      }

      var isFixed1 = !isBelow && pageYOffset > containerStart - yStickyOffset
      if (isFixed != isFixed1){
        isFixed = isFixed1
        graph
          .classed('graph-scroll-fixed', isFixed)
      }

      var top
      if (stickyTop){
        if (isBelow) {
          top = 'auto'
        } else if (isFixed) {
          top = stickyTop + 'px'
        } else {
          top = '0px'
        }
        graph.style('top', top)
      }

      lastPageY = pageYOffset
    }

    function resize(){
      sectionPos = []
      var startPos
      sections.each(function(d, i){
        if (!i) startPos = this.getBoundingClientRect().top
        sectionPos.push(this.getBoundingClientRect().top -  startPos) })

      var containerBB = container.node().getBoundingClientRect()
      var graphBB = graph.node().getBoundingClientRect()

      containerStart = containerBB.top + pageYOffset
      belowStart = containerBB.bottom - graphBB.height  + pageYOffset
    }

    function keydown() {
      if (!isFixed) return
      var delta
      switch (d3.event.keyCode) {
        case 39: // right arrow
        if (d3.event.metaKey) return
        case 40: // down arrow
        case 34: // page down
        delta = d3.event.metaKey ? Infinity : 1 ;break
        case 37: // left arrow
        if (d3.event.metaKey) return
        case 38: // up arrow
        case 33: // page up
        delta = d3.event.metaKey ? -Infinity : -1 ;break
        case 32: // space
        delta = d3.event.shiftKey ? -1 : 1
        ;break
        default: return
      }

      var i1 = Math.max(0, Math.min(i + delta, n - 1))
      rv.scrollTo(i1)

      d3.event.preventDefault()
    }


    var rv ={}

    rv.scrollTo = function(_x){
      if (isNaN(_x)) return rv

      d3.select(document.documentElement)
          .interrupt()
        .transition()
          .duration(500)
          .tween("scroll", function() {
            var i = d3.interpolateNumber(pageYOffset, sectionPos[_x] + containerStart)
            return function(t) { scrollTo(0, i(t)) }
          })
      return rv
    }


    rv.container = function(_x){
      if (!_x) return container

      container = _x
      return rv
    }

    rv.graph = function(_x){
      if (!_x) return graph

      graph = _x
      return rv
    }

    rv.triggerAt = function(_x){
      if (!_x) return triggerAt

      triggerAt = _x
      return rv
    }

    rv.eventId = function(_x){
      if (!_x) return eventId

      eventId = _x
      return rv
    }

    rv.stickyTop = function(_x){
      if (!_x) return stickyTop

      stickyTop = _x
      return rv
    }

    rv.offset = function(_x){
      if (!_x) return offset

      offset = _x
      return rv
    }

    rv.sections = function (_x){
      if (!_x) return sections

      sections = _x
      n = sections.size()

      d3.select(window)
          .on('scroll.gscroll'  + eventId, reposition)
          .on('resize.gscroll'  + eventId, resize)
          .on('keydown.gscroll' + eventId, keydown)

      resize()
      d3.timer(function() {
        reposition()
        return true
      })

      return rv
    }

    d3.rebind(rv, dispatch, "on")

    return rv
  }
  
}).call(this)