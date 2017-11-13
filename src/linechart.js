import React from 'react';
import * as d3 from 'd3';
import isEqual from 'lodash.isequal';

class Linechart extends React.Component {

  constructor(props) {
    super(props);
    this.saveContainer = this.saveContainer.bind(this);
  }

  componentDidMount() {
    
    const component = this;
	this.margin = {top: 60, right: 30, bottom: 30, left: 50};
    this.width = this.props.width - this.margin.left - this.margin.right;
    this.height = this.props.height - this.margin.top - this.margin.bottom;

  this.color = d3.scaleOrdinal()
      .range(["#EF5342","#479193","#F8B15B","#EFCF71","#EA696B","#41BE9A"]);

	// parse the date / time
	this.parseTime = d3.timeParse("%d-%b-%y");
	// set the ranges
	this.x = d3.scaleTime().range([0, this.width]);
	this.y = d3.scaleLinear().range([this.height, 0]);
	// define the line
	this.valueline = d3.line()
	    .x(function(d) { return component.x(d.date); })
	    .y(function(d) { return component.y(d.value); });
	// append the svg obgect to the body of the page
	// appends a 'group' element to 'svg'
	// moves the 'group' element to the top left margin
	this.svg = d3.select(this.container).append("svg")
	    .attr("width", this.width + this.margin.left + this.margin.right)
	    .attr("height", this.height + this.margin.top + this.margin.bottom)
	  .append("g")
	    .attr("transform",
	          "translate(" + [this.margin.left, this.margin.top] + ")");


  this.svg.append("g")
    .attr("class", "xAxis")
    .attr("transform", "translate(0," + this.height + ")")
    //.call(d3.axisBottom(component.x).ticks(5))
  // Add the Y Axis
  this.svg.append("g")
    .attr("class", "yAxis")
    //.call(d3.axisLeft(component.y).ticks(5));
// <path d='M8 46 L10 48 L32 48 L40 56 L48 48 L54 48 L54 48 L56 46 L56 14 L54 12 L54 12 L54 12 L54 12 L54 12 L10 12 L10 12 L8 14 L8 44 L8 46 Z' />
  



	this.linesGroup = this.svg.append("g");
	this.series = this.svg.append("g");

    // this.g = this.svg.append("g").attr("transform", "translate(" + this.width / 2 + "," + this.height / 2 + ")");  
    // this.legend = ["Desktop", "Tablet", "Mobile"];

    var defs = this.svg.append("defs");

    var filter = defs.append("filter")
        .attr("id", "linechart-drop-shadow")
        .attr("width", "130%")
        .attr("height", "130%");

    filter.append("feGaussianBlur")
        .attr("in", "SourceAlpha")
        .attr("stdDeviation", 3);


    filter.append("feOffset")
        .attr("dx", 1)
        .attr("dy", 1)
        .attr("result", "offsetBlur");

    var feComponentTransfer = filter.append("feComponentTransfer");
        feComponentTransfer.append("feFuncA")
            .attr("type","linear") 
            .attr("slope",0.2);

    var feMerge = filter.append("feMerge");
        feMerge.append("feMergeNode");
        feMerge.append("feMergeNode")
               .attr("in", "SourceGraphic");


    this.div = d3.select(this.container).append("div")   
        .attr("class", "linechartTooltip svgTooltip")               
        .style("opacity", 0);

    this.draw(this.props.dataset);

  }

  componentWillUpdate(nextProps) {
    if (!isEqual(nextProps.dataset, this.props.dataset)) {
      this.draw(nextProps.dataset);
    }
  }

  draw(dataset) {


  	const component = this;
    d3.select(component.container).select(".linechartTooltip").remove();  

    let varNames = [];

  	dataset.forEach(function (data) { 
      varNames.push(data.name);
  		data.values.forEach(function (d,i) {
			d.date = component.parseTime(d.date);
			d.value = +d.value;
			d.name = data.name;
      d.unique = data.name + i;
  		})
  	});

    this.color.domain(varNames);

  	let data = dataset[0].values;

  	// Scale the range of the data
  	this.x.domain(d3.extent(data, function(d) { return d.date; }));
  	//this.y.domain([0, d3.max(data, function(d) { return d.value; })]);
  	this.y.domain([d3.min(dataset, function(c) { return d3.min(c.values, function(d) { return d.value; }); }), d3.max(dataset, function(c) { return d3.max(c.values, function(d) { return d.value; }); })])


  	var t = d3.transition()
  				.duration(500);


    this.svg.select(".xAxis")
              .transition(t)
              .call(d3.axisBottom(component.x).ticks(5));

    this.svg.select(".yAxis")
              .transition(t)
              .call(d3.axisLeft(component.y).ticks(5));



  	var lines = this.linesGroup
  	    .selectAll("path")
  	    .data(dataset);

  	// exit
  	lines.exit().remove();

  	// enter
  	lines.enter().append("path")
  		.attr("fill", ("none"))
  		.attr("stroke", (d,i) => component.color(d.name))
  		.attr("stroke-linejoin", "round")
  		.attr("stroke-linecap", "round")
      .style("filter", "url(#linechart-drop-shadow)")
  		.attr("stroke-width", 2)
  		.attr("d", function(d) {
  			return component.valueline(d.values); 
  		});

  	// update 
  	lines
  	    .transition(t)
  		.attr("d", function(d) {
  			return component.valueline(d.values); 
  		});


    // var series = this.svg.selectAll(".series")
    //     .data(this.props.dataset)

    var circleGroups = this.series.selectAll("g")  
    	.data(dataset, d => d.name)  

    // exit    
    circleGroups.exit().remove();

    // enter
    var seriesEnter = circleGroups.enter().append("g")


    // enter + update
    var seriesEnterUpdate = seriesEnter.merge(circleGroups)
        .attr("class", function (d,i) {
        	//console.log(d)
        	return "series";
        });    


  	// circles

    var circles = seriesEnterUpdate.selectAll(".point")
      .data(function (d) { 
      	return d.values;
      }, d => d.unique);

  	// exit 
    circles.exit().remove();




    // enter
    var circlesEnter = circles.enter().append("circle")
    	.attr("cx", function (d) { return component.x(d.date); })
    	.attr("cy", function (d) { return component.y(d.value); })
    	.attr("class", "point")
      .attr("cursor", "pointer")
    	.attr("r", "5px")
    	.style("fill", function (d,i) { return "white"; })
      .style("filter", "url(#linechart-drop-shadow)")
    	.style("stroke", (d,i) => component.color(d.name))
    	.style("stroke-width", "2px")

    circlesEnter.on("mouseover", function (d) {

      //console.log(this.cx)
      var x = d3.select(this).attr("cx") - 38;
      var y = d3.select(this).attr("cy");

      d3.select(this).attr("r", "7px")
    	              .style("fill", (d,i) => component.color(d.name));

      d3.select(component.container).select(".linechartTooltip")
          .attr("transform","translate(" + [x, y] + ")")
          .transition()     
          .style("opacity", 1)

      d3.select(component.container).select(".linechartTooltip text")
        .text( "%" + Math.round(d.value))    
          // .text(d.name)  
          // .style("left", (d3.event.pageX) + "px")     
          // .style("top", (d3.event.pageY - 28) + "px")
    })

    circlesEnter.on("mouseout", function (d) {

      d3.select(this).attr("r", "5px")
    	              .style("fill", (d,i) => "white");
                    
      d3.select(component.container).select(".linechartTooltip") 
        .transition() 
        .style("opacity", 0)

    })

  	// enter + update
    circlesEnter
    	.merge(circles)
    	.transition(t)
    	.attr("cx", function (d) { return component.x(d.date); })
    	.attr("cy", function (d) { return component.y(d.value); })


    // tooltip

    this.svgTooltip = this.svg.append("g")
      .attr("class","linechartTooltip")
      .style("pointer-events", "none")
      .style("opacity",0)


    this.svgTooltip.append("path")
      .attr("d", "M8 46 L10 48 L32 48 L40 56 L48 48 L54 48 L54 48 L56 46 L56 14 L54 12 L54 12 L54 12 L54 12 L54 12 L10 12 L10 12 L8 14 L8 44 L8 46 Z")
      .attr("fill", "white")
      .attr("stroke","lightgrey")
      .style("filter", "url(#linechart-drop-shadow)")
      .attr("transform", "translate(0, -65)")

    this.svgTooltip.append("text")
      .attr("class","tooltipText")
      .text("%25")
      .style("font-family", "sans-serif")
      .style("font-size", 13)
      .attr("transform", "translate(18, -28)")

  }

  saveContainer(container) {
    this.container = container;
  }

  render() {
    const {
      width,
      height,
      children,
    } = this.props;

    return (
      <div
        className="zulu5-inechart"
        style={{
          width,
          height,
        }}
        ref={this.saveContainer}
      >
        {children}
      </div>
    );
  }
}

// Rose.propTypes = {
//   width: React.PropTypes.number.isRequired,
//   height: React.PropTypes.number.isRequired,
//   children: React.PropTypes.node,
//   hoverLength: React.PropTypes.number.isRequired,
//   dataset: React.PropTypes.arrayOf(React.PropTypes.shape({
//     value: React.PropTypes.number.isRequired,
//     backgroundColor: React.PropTypes.string.isRequired,
//     hoverBackgroundColor: React.PropTypes.string.isRequired,
//   })),
//   onMouseClick: React.PropTypes.func.isRequired,
//   onMouseOver: React.PropTypes.func.isRequired, // eslint-disable-line react/no-unused-prop-types
//   onMouseOut: React.PropTypes.func.isRequired, // eslint-disable-line react/no-unused-prop-types
// };

Linechart.defaultProps = {
  width: 800,
  height: 480,
  hoverLength: 30,
  onMouseClick: () => {},
  onMouseOver: () => {},
  onMouseOut: () => {},
};

export default Linechart;
