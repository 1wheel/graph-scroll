# graph-scroll.js

Simple scrolling events for [d3](https://github.com/mbostock/d3) graphs. Based on [stack](https://github.com/mbostock/stack.git)

### [Demo/Documentation](http://1wheel.github.io/graph-scroll/)

*graph-scroll* takes a selection of explanatory text sections and dispatches `active` events as different sections are scrolled into to view. These `active` events can be used to update a chart's state.

```
d3.graphScroll()
    .sections(d3.selectAll('#sections > div'))
    .on('active', function(i){ console.log(i + 'th section active') })
```

The top most element scrolled fully into view is classed `graph-scroll-active`. This makes it easy to highlight the active section with css: 

```
#sections > div{
	opacity: .3
} 

#sections div.graph-scroll-active{
	opacity: 1;
}
```

To support headers and intro images/text, we use a container element containing the explanatory text and graph.

```
<h1>Page Title</div>
<div id='container'>
	<div id='sections'>
		<div>Section 0</div>
		<div>Section 1</div>
		<div>Section 2</div>
	</div>

	<div id='graph'></div>
</div>
<h1>Footer</h1>
```

If these elements are passed to graphScroll as selections with `container` and `graph`, every element in the graph selection will be classed `graph-scroll-graph` if the top of the container is out of view. 

```
d3.graphScroll()
	.graph(d3.selectAll('#graph'))
	.container(d3.select('#container'))
  .sections(d3.selectAll('#sections > div'))
  .on('active', function(i){ console.log(i + 'th section active') })

```

With a little bit of css, the graph element snaps to the top of the page while the text scrolls by. 


```
#container{
  position: relative;
  overflow: auto;
}

#sections{
  width: 200px;
  float: left;
}

#graph{
  width: 600px;
  float: left;
  margin-left: 40px;
}

#graph.graph-scroll-fixed{
  position: fixed;
  top: 0px;
  margin-left: 240px;
}
```


As the bottom of the container approaches the top of the page, the graph is classed with `graph-scroll-below`. A little more css allows the graph slide out of view gracefully:

```
#graph.graph-scroll-below{
  position: absolute;
  bottom: 0px;
  margin-left: 240px;
}
```

To adjust the amount of pixels before a new section is triggered, update `offset` :

```
graphScroll.offset(300)
```

Defaults to 200 pixels. 
