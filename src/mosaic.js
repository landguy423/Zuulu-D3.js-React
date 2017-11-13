import React from 'react';
import * as d3 from 'd3';
import isEqual from 'lodash.isequal';

class Mosaic extends React.Component {

  constructor(props) {
    super(props);
    this.saveContainer = this.saveContainer.bind(this);
  }

  componentDidMount() {
    

    this.width = this.props.width;
    this.height = this.props.height;
    this.margin = 20;

    this.x = d3.scaleLinear()
        .range([0, this.width - 5 * this.margin]);

    this.y = d3.scaleLinear()
        .range([0, this.height - 5 * this.margin]);

    this.n = d3.format(",d");
    this.p = d3.format("%");


    this.svg = d3.select(this.container)
      .append('svg')
      .attr('width', this.props.width)
      .attr('height', this.props.height);

    this.g = this.svg.append("g").attr("transform", "translate(" + 4 * this.margin + "," + this.margin + ")");
    this.legend = ["Desktop", "Tablet", "Mobile"];

    var defs = this.svg.append("defs");

    var filter = defs.append("filter")
        .attr("id", "mosaic-drop-shadow")
        .attr("width", "130%")
        .attr("height", "130%");

    filter.append("feGaussianBlur")
        .attr("in", "SourceAlpha")
        .attr("stdDeviation", 2);


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
        .attr("class", "mosaicTooltip svgTooltip")               
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

    this.g.selectAll(".yLabelsGroup").remove();
    this.g.selectAll(".xLabels").remove();
    this.g.selectAll(".segment").remove();

    //let offset = 0;

    let colors = {
            "Desktop": "#E06B6C", 
              "Tablet": "#F2B158", 
              "Mobile": "#5CC19E"  
            };

    let deviceImages = {
            "Desktop": "matrixIcons/Desktop.png", 
              "Tablet": "matrixIcons/Tablet.png", 
              "Mobile": "matrixIcons/Mobile.png"
            };

    let typeImages = {
            "Video": "matrixIcons/Video.png", 
              "Html": "matrixIcons/Html.png", 
              "Image": "matrixIcons/Image.png"  
            };

    let data = [];

    dataset.forEach(function (type) {
      type.Values.forEach(function (d,i) {
        data.push({type: type.Type, device: d.name, value: d.value})
      })
    })



    let types = d3.nest()
        .key(function(d) { return d.type; })
        .entries(data);


    let sum = types.reduce(function(v, p) {
      return (p.offset = v) + (p.sum = p.values.reduceRight(function(v, d) {
        d.parent = p;
        return (d.offset = v) + d.value;
      }, 0));
    }, 0);


  var segments = this.g.selectAll(".segment")
      .data(types)
    .enter().append("g")
      .attr("class", "segment")
      .attr("transform", function(d) { return "translate(" + component.x(d.offset / sum) + ")"; });


  var device = segments.selectAll(".device")
      .data(function(d) { return d.values; })
    .enter().append("g")
      .attr("class", "device")
      //.attr("xlink:title", function(d) { return d.device + " " + d.parent.key + ": " + component.n(d.value); })
    
  let rects = device  
    .append("rect")
    .attr("y", function(d) { return component.y(d.offset / d.parent.sum); })
    .attr("height", function(d) { return component.y(d.value / d.parent.sum); })
    .attr("width", function(d) { return component.x(d.parent.sum / sum); })
    .style("fill", function(d) {  return colors[d.device]; })
    .style("stroke","white")
    .style("stroke-width", 0.5)
    .style("filter", "url(#mosaic-drop-shadow)")
    .style("opacity",0)
    .attr("cursor", "pointer")

  rects.on("mouseover", mouseover);

  rects.on("mouseout", mouseout);

  rects    
        .transition()
        .duration(250)
        .delay(function (d,i) {
          return i * 50
        })
        .style('opacity', 1 );



  device
    .append("text").text(function (d) {return d.value + "%";})
    .attr("transform", function (d) {
      let x = component.x(d.parent.sum / sum) / 2;
      let y = component.y(d.offset / d.parent.sum) + component.y(d.value / d.parent.sum) / 2;
      return "translate(" + [x,y] + ")";
    })
    .style("text-anchor", "middle")
    .style("alignment-baseline","middle")
    .style("font-family", "sans-serif")
    .style("font-size", 11)
    .attr("fill","white")
    .style("pointer-events", "none");

  // xlabels

  let xLabels = this.g.selectAll(".xLabels")
    .data(types)
    .enter().append("g")
      .attr("class", "xLabels")
      .attr("transform", function(d) { 
        let x = component.x((d.offset + d.sum/2) / sum);
        let y = component.height - 4 * component.margin + 10;
        // component.x(d.offset / sum)
        return "translate(" + [x,y] + ")"; 
      }).style("pointer-events", "none")

  xLabels        
      .append("image")
      .attr("width", 24)
      .attr("height", 24)
      .attr('x', -12)
      .attr('y', -22)      
      .attr("xlink:href", function (d,i) {
        return typeImages[d.key];
      })

  xLabels
      .append("text")
      .style("font-size", 10)
      .style("text-anchor", "middle")
      .attr("y", 12)
      .style("font-family", "sans-serif")
      .text(function (d) {
        return d.key;
      })      

  xLabels
      .append("text")
      .style("font-size", 9)
      .style("text-anchor", "middle")
      .attr("y", 22)
      .style("font-family", "sans-serif")
      .text(function (d) {
        return "%" + d.sum;
      })


  xLabels
          .attr("opacity", 0)
          .transition(400)
          .delay(function (d,i) {
            return i * 100;
          })
          .attr("opacity", 1)

  let yLabelsGroup = this.g.append("g")
    .attr("transform","translate(" + [-3 * this.margin, 0] + ")")
    .attr("class","yLabelsGroup")

  let yLabels = yLabelsGroup.selectAll(".yLabels")
    .data(types[0].values)
    .enter().append("g")
      .attr("class", "yLabels")
      .attr("transform", function(d) { 
        let x = 5; //component.x((d.offset + d.sum/2) / sum);
        let y = component.y((d.offset + d.value/2) / types[0].sum);
        // component.x(d.offset / sum)
        return "translate(" + [x,y] + ")"; 
      }).style("pointer-events", "none")

  yLabels.enter().append("g")
      .attr("class", "yLabels")
      .attr("transform", function(d) { 
        let x = 5; //component.x((d.offset + d.sum/2) / sum);
        let y = component.y((d.offset + d.value/2) / types[0].sum);
        // component.x(d.offset / sum)
        return "translate(" + [x,y] + ")"; 
      })

  yLabels.attr("transform", function(d) { 
        let x = 5; //component.x((d.offset + d.sum/2) / sum);
        let y = component.y((d.offset + d.value/2) / types[0].sum);
        // component.x(d.offset / sum)
        return "translate(" + [x,y] + ")"; 
      })


  yLabels        
      .append("image")
      .attr("width", 24)
      .attr("height", 24)
      .attr('x', -12)
      .attr('y', -11)      
      .attr("xlink:href", function (d,i) {
        return deviceImages[d.device];
      })

  yLabels
      .append("text")
      .style("font-size", 10)
      //.style("text-anchor", "middle")
      .attr("x", 12)
      .attr("y", 4)
      .style("font-family", "sans-serif")
      .text(function (d) {
        return d.device;
      })   

  yLabels
          .attr("opacity", 0)
          .transition(400)
          .delay(function (d,i) {
            return i * 100 + 200;
          })
          .attr("opacity", 1)


    function mouseover (d) {

      d3.select(component.container).selectAll("rect")
          .style("opacity", 0.3);

      d3.select(this)
          .style("opacity", 1);


	      d3.select(component.container).select(".mosaicTooltip")     
	          .style("opacity", .9)
	          .html(d.type + "<br/>" + d.device)  
	          .style("left", (d3.event.pageX) + "px")     
	          .style("top", (d3.event.pageY - 28) + "px");



  	}          

    function mouseout (d) {

       //  d3.select(this)
       //    .transition()
       //    .duration(200)
       //    .attr('d', arc);

      d3.select(component.container).selectAll("rect")
          .style("opacity", 1);

	      d3.select(component.container).select(".mosaicTooltip")     
	          .style("opacity", 0)

  	}  



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
        className="zulu5-mosaic"
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


Mosaic.defaultProps = {
  width: 500,
  height: 500,
  hoverLength: 30,
  onMouseClick: () => {},
  onMouseOver: () => {},
  onMouseOut: () => {},
};

export default Mosaic;
