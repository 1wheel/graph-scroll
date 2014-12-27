function gscroll() {
  var gscroll = {},
      windowHeight,
      dispatch = d3.dispatch("scroll", "active"),
      i = NaN,
      sectionPos = []

  var sections = d3.selectAll("section")
  var n = sections.size()

  d3.select(window)
      .on("scroll.stack", reposition)
      .on('scroll.resize', resize)


  function reposition(){
    var i1 = d3.bisect(sectionPos, pageYOffset + 0)
    i1 = Math.min(n - 1, i1)
    if (i != i1){
      sections.classed('active', function(d, i){ return i === i1 })

      dispatch.active(i1)

      i = i1
    }
  }

  function resize(){
    sectionPos = []
    sections.each(function(){
      sectionPos.push(this.getBoundingClientRect().top) })
  }


  resize()
  d3.timer(function() {
    reposition();
    return true;
  });

  d3.rebind(gscroll, dispatch, "on");

  return gscroll;
}