function scatter() {
  var svg,
      height = 100,
      width = 100,
      scale d3.scale.linear(),
      points = []



  scatter.scale()

  d3.rebind(scatter, dispatch, "on");
  return scatter;
}