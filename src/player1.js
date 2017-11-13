import React from 'react';
import * as d3 from 'd3';
import isEqual from 'lodash.isequal';

class Player1 extends React.Component {

  constructor(props) {
    super(props);
    this.saveContainer = this.saveContainer.bind(this);
  }

  componentDidMount() {
    
    //const component = this;

    this.margin = {top: 20, right: 100, bottom: 20, left: 200};
    this.width = this.props.width - this.margin.left - this.margin.right;
    this.height = this.props.height - this.margin.top - this.margin.bottom;

    this.orientations = {
      "right-to-left": {
        size: [this.height, this.width/3],
        x: function(d) { return this.width/3 - d.y; },
        y: function(d) { return d.x; }
      },
      "left-to-right": {
        size: [this.height, this.width/3],
        x: function(d) { return d.y; },
        y: function(d) { return d.x; }
      }
    };


    this.svg = d3.select(this.container).append("svg")
        .attr("width", this.width + this.margin.left + this.margin.right)
        .attr("height", this.height + this.margin.top + this.margin.bottom);


    this.leftOne = this.svg.append("g")
        .attr("transform","translate(" + [this.margin.left,this.margin.top] +  ")");   

    this.rightOne = this.svg.append("g")
        .attr("transform","translate(" + [this.width*2/3 + this.margin.left, this.margin.top] +  ")");   



    var defs = this.svg.append("defs");

    var filter = defs.append("filter")
        .attr("id", "player1-drop-shadow")
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
            .attr("slope",0.3);

    var feMerge = filter.append("feMerge");
        feMerge.append("feMergeNode");
        feMerge.append("feMergeNode")
               .attr("in", "SourceGraphic");


 //    this.div = d3.select(this.container).append("div")   
 //        .attr("class", "linechartTooltip svgTooltip")               
 //        .style("opacity", 0);

    this.draw(this.props.dataset);

  }

  componentWillUpdate(nextProps) {
    if (!isEqual(nextProps.dataset, this.props.dataset)) {
      this.draw(nextProps.dataset);
    }
  }

  draw(dataset) {


  	//const component = this;


    let treeWidth = (this.width - (this.margin.left + this.margin.right)) / 3;

    // right one

    // declares a tree layout and assigns the size
    var treemapR = d3.tree()
        .size([this.height, treeWidth]);

    //  assigns the data to a hierarchy using parent-child relationships
    var nodesR = d3.hierarchy(dataset.output, function(d) {
        return d.children;
      });

    // maps the node data to the tree layout
    nodesR = treemapR(nodesR);

    // Create the link lines.
    this.rightOne.selectAll(".link")
        .data(nodesR.descendants().slice(1))
      .enter().append("path")
        .attr("class", "link")
        .style("fill","none")
        .style("stroke", "#ccc")
        .style("stroke-width", 2)
        .attr("d", function(d) {
           return "M" + d.y + "," + d.x
             + "C" + (d.y + d.parent.y) / 2 + "," + d.x
             + " " + (d.y + d.parent.y) / 2 + "," + d.parent.x
             + " " + d.parent.y + "," + d.parent.x;
           });

    var nodeR = this.rightOne.selectAll(".node")
      .data(nodesR.descendants().filter( (d) => !d.children ))
      .enter().append("g")
        .attr("class", function(d) { return "node" + (d.children ? " node--internal" : " node--leaf"); })
        .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })

    // nodeR.append("circle")
    //     .attr("r", 2.5);

    nodeR.append("text")
        .attr("dy", 0)
        .style("font-family", "sans-serif")
        .style("font-size", 16)
        .attr("fill","#656364")
        .attr("x", function(d) { return 8; })
        .style("text-anchor", function(d) { return d.children ? "end" : "start"; })
        .text(function(d) { 
          return d.height === 0 ? d.data.percentage + "%" : ""; 
        });


    nodeR.append("text")
        .attr("dy", 12)
        .style("font-family", "sans-serif")
        .style("font-size", 10)
        .attr("fill",function(d) { return +d.data.change > 0 ? "#95E083" : "#F6857A"; })
        .attr("x", function(d) { return 8; })
        .style("text-anchor", function(d) { return d.children ? "end" : "start"; })
        .text(function(d) { 
          return d.height === 0 ? +d.data.change > 0 ? "" + d.data.change + "% ⇧"
           : "" + d.data.change + "% ⇩"
           : ""; 
        });

    let nameR = nodeR.append("g")
                     .attr("transform","translate(60,0)");

    nameR.append("circle")
          .attr("r",4)
          .style("filter", "url(#player1-drop-shadow)")
          .attr("fill", d => d.data.color)

    nameR.append("text")
          .attr("dx", 12)
          .attr("dy", 6)
          .style("font-family", "sans-serif")
          .style("fill","#7D7C7C")
          .style("font-size", 16)
          .text(d => d.data.name)     


    // left one

    // declares a tree layout and assigns the size
    var treemapL = d3.tree()
        .size([this.height, treeWidth]);

    //  assigns the data to a hierarchy using parent-child relationships
    var nodesL = d3.hierarchy(dataset.input, function(d) {
        return d.children;
      });

    // maps the node data to the tree layout
    nodesL = treemapL(nodesL);

    // Create the link lines.
    this.leftOne.selectAll(".link")
        .data(nodesL.descendants().slice(1))
      .enter().append("path")
        .attr("class", "link")
        .style("fill","none")
        .style("stroke", "#ccc")
        .style("stroke-width", 2)
        .attr("d", function(d) {
           return "M" + (treeWidth - d.y) + "," + d.x
             + "C" + ((treeWidth - d.y) + (treeWidth - d.parent.y)) / 2 + "," + d.x
             + " " + ((treeWidth - d.y) + (treeWidth - d.parent.y)) / 2 + "," + d.parent.x
             + " " + (treeWidth - d.parent.y) + "," + d.parent.x;
           });

    var nodeL = this.leftOne.selectAll(".node")
      .data(nodesL.descendants().filter( (d) => !d.children ))
      .enter().append("g")
        .attr("class", function(d) { return "node" + (d.children ? " node--internal" : " node--leaf"); })
        .attr("transform", function(d) { return "translate(" + (treeWidth - d.y) + "," + d.x + ")"; })

    nodeL.append("text")
        .attr("dy", 0)
        .style("font-family", "sans-serif")
        .style("font-size", 16)
        .attr("fill","#656364")
        .attr("x", -50)
        .style("text-anchor", function(d) { return d.children ? "end" : "start"; })
        .text(function(d) { 
          return d.height === 0 ? d.data.percentage + "%" : ""; 
        });


    nodeL.append("text")
        .attr("dy", 12)
        .style("font-family", "sans-serif")
        .style("font-size", 10)
        .attr("fill",function(d) { return +d.data.change > 0 ? "#95E083" : "#F6857A"; })
        .attr("x", -50)
        .style("text-anchor", function(d) { return d.children ? "end" : "start"; })
        .text(function(d) { 
          return d.height === 0 ? +d.data.change > 0 ? "" + d.data.change + "% ⇧"
           : "" + d.data.change + "% ⇩"
           : ""; 
        });

    let nameL = nodeL.append("g")
                     .attr("transform","translate(-150,0)");

    nameL.append("circle")
          .attr("r",4)
          .style("filter", "url(#player1-drop-shadow)")
          .attr("fill", d => d.data.color)

    nameL.append("text")
          .attr("dx", 12)
          .attr("dy", 6)
          .style("font-family", "sans-serif")
          .style("font-size", 16)
          .style("fill","#7D7C7C")
          .text(d => d.data.name) 

    let screen = this.svg.append("g")
                  .attr("transform","translate(" + [this.width/2, this.height/2] + ")")

    screen.append("image")
        .attr("width", 285)
        .attr("height", 229)
        .attr('x', 8)
        .attr('y', -80)      
        .attr("xlink:href", "player1/screen.png")   

    screen.append("circle")
          .attr("r",4)
          .attr("cx", 145)
          .attr("cy", -20)
          .style("filter", "url(#player1-drop-shadow)")
          .attr("fill", dataset.color)              

    screen.append("text")
          .attr("dx", 150)
          .attr("dy", 16)
          .style("text-anchor", "middle")
          .style("font-family", "sans-serif")
          .style("font-size", 20)
          .style("fill","#7D7C7C")
          .text(dataset.name) 
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
        className="zulu5-player1"
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

Player1.defaultProps = {
  width: 800,
  height: 480,
  hoverLength: 30,
  onMouseClick: () => {},
  onMouseOver: () => {},
  onMouseOut: () => {},
};

export default Player1;
