import React from 'react';
import * as d3 from 'd3';
import isEqual from 'lodash.isequal';


class Sunburst extends React.Component {

  constructor(props) {
    super(props);
    this.saveContainer = this.saveContainer.bind(this);
  }

  componentDidMount() {

    //d3.select(this.container).select("svg").remove();

    var margin = 15;
    var width = this.props.width;
    var height = this.props.height;
    this.radius = (Math.min(width, height) / 2) - margin;


    this.svg = d3.select(this.container).append("svg")
                .attr("width", width)
                .attr("height", height);
        
    var defs = this.svg.append("defs");

    var filter = defs.append("filter")
        .attr("id", "sunburst-drop-shadow")
        .attr("width", "150%")
        .attr("height", "150%");

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

    this.vis = this.svg 
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("id", "container")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    this.vis.append("text")
          .attr("class","centerText")
          .attr("text-anchor", "middle")
          .attr("alignment-baseline", "middle")
          .style("fill", "#EF5342")
          .style("font-size", 14)
          .text("");    

    this.partition = d3.partition()
        .size([2 * Math.PI, Math.pow(this.radius,1.3)]);

    this.arc = d3.arc()
        .startAngle(function(d) { return d.x0; })
        .endAngle(function(d) { return d.x1; })
        .innerRadius(function(d) { return Math.pow(d.y0,1/1.3); })
        .outerRadius(function(d) { return Math.pow(d.y1,1/1.3); });

    this.div = d3.select(this.container).append("div")   
        .attr("class", "sunburstTooltip svgTooltip")               
        .style("opacity", 0);

    this.draw(this.props.dataset);

  }

  componentWillUpdate(nextProps) {

    if (!isEqual(nextProps.dataset, this.props.dataset)) {
      this.draw(nextProps.dataset);
    } 

  }

  draw(dataset) {

    var component = this;

    var totalSize = 0; 

    var json = {
      "name": "root",
      "children": dataset.data
    }

    this.vis.selectAll("path").remove();

    this.vis.append("circle")
        .attr("r", this.radius)
        .style("opacity", 0);

    // Turn the data into a d3 hierarchy and calculate the sums.
    var root = d3.hierarchy(json)
        .sum(function(d) { return d.size; })
        .sort(function(a, b) { return b.value - a.value; });
    
    // For efficiency, filter nodes to keep only those large enough to see.
    var nodes = this.partition(root).descendants()
        .filter(function(d) {
            return (d.x1 - d.x0 > 0.005); // 0.005 radians = 0.29 degrees
        });

    var path = this.vis.data([json]).selectAll("path")
        .data(nodes)
        .enter().append("path")
        .attr("display", function(d) { return d.depth ? null : "none"; })
        .attr("d", component.arc)
        .attr("fill-rule", "evenodd")
        .style("filter", "url(#sunburst-drop-shadow)")
        .attr("class", function (d) { return "sun" + d.data.name.split(" ").join("")})
        .style("fill", function (d) { return dataset.colors[d.data.name]; })
        .style("opacity", 0);

    path
        .transition()
        .duration(200)
        .delay(function (d, i) {
          return i * 50;
        })
        .style("opacity", 1);

    // Get total size of the tree = value of root node from partition.
    totalSize = path.datum().value;      

    // legend 

    this.createLegend(d3.entries(dataset.colors)); 

    path.on("mouseover", mouseover);

    // Add the mouseleave handler to the bounding circle.
    d3.select("#container").on("mouseleave", mouseleave);

    // Fade all but the current sequence, and show it in the breadcrumb trail.
    function mouseover(d) {


      d3.select(component.container).select(".sunburstTooltip")     
          .style("opacity", .9)
          .text(d.data.name)  
          .style("left", (d3.event.pageX) + "px")     
          .style("top", (d3.event.pageY - 28) + "px")

      var percentage = (100 * d.value / totalSize).toPrecision(3);
      var percentageString =  "%" + percentage;
      if (percentage < 0.1) {
        percentageString = "< 0.1%";
      }

      d3.select(component.container).select(".centerText")
          .text(percentageString);

      // d3.select("#explanation")
      //     .style("visibility", "");

      var sequenceArray = d.ancestors().reverse();
      sequenceArray.shift(); // remove root node from the array

      //updateBreadcrumbs(sequenceArray, percentageString);

      var breadcrumbArray = sequenceArray.map(function (d) {
        return d.data.name;
      })

      component.createBreadcrumb(breadcrumbArray, percentageString);

      // Fade all the segments.
      d3.select(component.container).selectAll("path")
          .style("opacity", 0.1);

      // Then highlight only those that are an ancestor of the current segment.
      d3.select(component.container).selectAll("path")
          .filter(function(node) {
                    return (sequenceArray.indexOf(node) >= 0);
                  })
          .style("opacity", 1);
    }

    // Restore everything to full opacity when moving off the visualization.
    function mouseleave(d) {

      d3.select(component.container).select(".sunburstTooltip")     
          .style("opacity", 0)

      d3.select(".centerText")
          .text(null);  

      // Hide the breadcrumb trail
      // d3.select("#trail")
      //     .style("visibility", "hidden");

      // Deactivate all segments during transition.
      d3.select(component.container).selectAll("path").on("mouseover", null);

      // Transition each segment to full opacity and then reactivate it.
      d3.select(component.container).selectAll("path")
          .transition()
          .duration(200)
          .style("opacity", 1)
          .on("end", function() {
              d3.select(this).on("mouseover", mouseover);
          });

      // d3.select("#explanation")
      //     .style("visibility", "hidden");
    }

  }

  createLegend (data) {
        //console.log(data) 
  }

  createBreadcrumb (breadcrumbArray, percentageString) {
          //console.log(breadcrumbArray, percentageString);
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
      <div>
        <div
          className="zulu5-sunburst"
          style={{
            width,
            height,
          }}
          ref={this.saveContainer}
        >
          {children}
          
        </div>

        
        
      </div>

    );
  }
}


Sunburst.defaultProps = {
  width: 500,
  height: 500,
  hoverLength: 30,
  onMouseClick: () => {},
  onMouseOver: () => {},
  onMouseOut: () => {},
};





export default Sunburst;
