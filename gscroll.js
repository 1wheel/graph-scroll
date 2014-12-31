function gscroll() {
  var gscroll = {},
      windowHeight,
      dispatch = d3.dispatch("scroll", "active"),
      i = NaN,
      startPos = 0,
      sectionPos = []

  sections = d3.selectAll("section")
  var n = sections.size()

  d3.select(window)
      .on("scroll.stack", reposition)
      .on('scroll.resize', resize)
      .on('keydown.resize', keydown)


  function reposition(){
    var i1 = d3.bisect(sectionPos, pageYOffset - 10)
    i1 = Math.min(n - 1, i1)
    if (i != i1){
      sections.classed('active', function(d, i){ return i === i1 })

      dispatch.active(i1)

      i = i1
    }
  }

  function resize(){
    sectionPos = []
    sections.each(function(d, i){
      if (!i) startPos = this.getBoundingClientRect().top
      sectionPos.push(this.getBoundingClientRect().top - startPos) })
  }


  resize()
  d3.timer(function() {
    reposition();
    return true;
  });


  function keydown() {
    var delta;
    switch (d3.event.keyCode) {
      case 39: // right arrow
      if (d3.event.metaKey) return;
      case 40: // down arrow
      case 34: // page down
      delta = d3.event.metaKey ? Infinity : 1; break;
      case 37: // left arrow
      if (d3.event.metaKey) return;
      case 38: // up arrow
      case 33: // page up
      delta = d3.event.metaKey ? -Infinity : -1; break;
      case 32: // space
      delta = d3.event.shiftKey ? -1 : 1;
      break;
      default: return;
    }

    var i1 = Math.max(0, Math.min(i + delta, n - 1))
    d3.select(document.documentElement)
        .interrupt()
      .transition()
        .duration(500)
        .tween("scroll", function() {
          var i = d3.interpolateNumber(pageYOffset, sectionPos[i1]);
          return function(t) { scrollTo(0, i(t)); };
        })

    d3.event.preventDefault();
  }




  d3.rebind(gscroll, dispatch, "on");

  return gscroll;
}