import React from 'react';
import * as d3 from 'd3';
import isEqual from 'lodash.isequal';

class AudienzzRadar extends React.Component {

  constructor(props) {
    super(props);
    this.saveContainer = this.saveContainer.bind(this);
  }

  componentDidMount() {
 
    const component = this;
    this.cfg = {
     w: this.props.width,        
     h: this.props.height,       
     margin: 25, 
     levels: 10,       
     maxValue: 100,     
     labelFactor: 1.25,  
     wrapWidth: 60,     
     opacityArea: 0.14, 
     color: "#D74E7B" 
    };

    var maxValue = this.cfg.maxValue;

    var allAxis = (this.props.dataset.map(function(i){return i.axis})),  
        total = allAxis.length,         
        radius = Math.min(this.cfg.w/2, this.cfg.h/2) - 2*this.cfg.margin; 
    
        
    this.angleSlice = (Math.PI * 2 / total); 
    this.rotateDeg = (Math.PI * 2/8);

    //Wraps SVG text  
    function wrap(text, width) {
      text.each(function() {
        var text = d3.select(this),
            words = text.text().split(/\s+/).reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 1.4, // ems
            y = text.attr("y"),
            x = text.attr("x"),
            dy = parseFloat(text.attr("dy")),
            tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");
        
        while (words.length) {
          word = words.pop();
          line.push(word);
          tspan.text(line.join(" "));
          if (tspan.node().getComputedTextLength() > width) {
            line.pop();
            tspan.text(line.join(" "));
            line = [word];
            tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
          }
        }
      });
    }//wrap 

    this.rScale = d3.scaleLinear()
      .domain([0, maxValue])
      .range([30, radius]);

    this.svg = d3.select(this.container).append("svg")
        .attr("width",  this.cfg.w)
        .attr("height", this.cfg.h)
        .attr("class", "audienzzRadar");

    var filter = this.svg.append('defs').append('filter').attr('id','audienzzradar-drop-shadow');
        filter.append('feGaussianBlur').attr('stdDeviation','2.5').attr('result','coloredBlur');
    var feMerge = filter.append('feMerge');
        feMerge.append('feMergeNode').attr('in','coloredBlur');
        feMerge.append('feMergeNode').attr('in','SourceGraphic');

    this.radarLine = d3.radialLine()
      .radius(function(d) { return component.rScale(d.value); })
      .angle(function(d,i) {  return i*component.angleSlice + component.rotateDeg; });

    this.g = this.svg.append("g")
        .attr("transform", "translate(" + this.cfg.w/2 + "," + this.cfg.h/2 + ")");

    var axisGrid = this.g.append("g").attr("class", "axisWrapper");
    

    axisGrid.selectAll(".levels")
      .data(d3.range(1,(this.cfg.levels+1)).reverse())
      .enter()
      .append("circle")
      .attr("class", "gridCircle")
      .attr("r", function(d, i){return component.rScale(d*10);})
      .style("fill", "#fff")
      .style("stroke", function(d, i){return d === 10 ? "#D6D6D6" : "#F8F8F8";})
      .style("filter" , "url(#audienzzradar-drop-shadow)");


    axisGrid.selectAll(".axisLabel")
       .data(d3.range(1,(component.cfg.levels+1)).reverse())
       .enter().append("text")
       .attr("class", "axisLabel")
       .attr("x", 4)
       .attr("y", function(d){return -component.rScale(d*10);})
       .attr("dy", "0.4em")
       .style("font-size", "10px")
       .attr("fill", "#737373")
       .style("font-family", "sans-serif")
       .text(function(d,i) { return d === 10 ? "" : d*10 + "%"; });


    var axis = axisGrid.selectAll(".axis")
      .data(this.props.dataset)
      .enter()
      .append("g")
      .attr("class", "axis");

    axis.append("line")
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", function(d, i){ return component.rScale(maxValue*1.05) * Math.cos(component.angleSlice*i - Math.PI/2 + component.rotateDeg); })
      .attr("y2", function(d, i){ return component.rScale(maxValue*1.05) * Math.sin(component.angleSlice*i - Math.PI/2 + component.rotateDeg); })
      .attr("class", "line")
      .style("stroke", "#D6D6D6")
      .style("stroke-width", 1);

    axisGrid.append("line")
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", this.rScale(maxValue*1.05) * Math.cos(- Math.PI/2))
      .attr("y2", this.rScale(maxValue*1.05) * Math.sin(- Math.PI/2))
      .attr("class", "scaleLine")
      .style("stroke", "#D6D6D6")
      .style("stroke-width", 1);


    axisGrid.append("path")
      .attr("d","M0 4 L4 0 L8 4")
      .style("fill", "none")
      .style("stroke", "#D6D6D6")
      .attr("transform", "translate("+ [this.rScale(maxValue*1.05) * Math.cos(- Math.PI/2) - 4,this.rScale(maxValue*1.05) * Math.sin(- Math.PI/2)-1]+")")



    axis.append("image")
        .attr("width", 24)
        .attr("height", 24)
        .attr("x", function(d, i){ return Math.round(component.rScale(maxValue * component.cfg.labelFactor) * Math.cos(component.angleSlice*i - Math.PI/2 + component.rotateDeg)) -11; })
        .attr("y", function(d, i){ return Math.round(component.rScale(maxValue * component.cfg.labelFactor) * Math.sin(component.angleSlice*i - Math.PI/2 + component.rotateDeg)) -30; })  
        .attr("xlink:href", function (d,i) {
          return "audienzzRadar/" + d.image;
        })


    axis.append("text")
      .attr("class", "radarLegend")
      .style("font-family", "sans-serif")
      .style("font-size", "11px")
      .style("fill", "#777777")
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .attr("x", function(d, i){ return component.rScale(maxValue * component.cfg.labelFactor) * Math.cos(component.angleSlice*i - Math.PI/2 + component.rotateDeg); })
      .attr("y", function(d, i){ return component.rScale(maxValue * component.cfg.labelFactor) * Math.sin(component.angleSlice*i - Math.PI/2 + component.rotateDeg); })
      .text(function(d){return d.axis})
      .call(wrap, this.cfg.wrapWidth);


    this.draw(this.props.dataset);


  }

  componentWillUpdate(nextProps) {
    if (!isEqual(nextProps.dataset, this.props.dataset)) {
      this.draw(nextProps.dataset);
    }
  }

  draw(dataset) {


  	const component = this;

    var t = d3.transition()
              .duration(500);

    var radarArea = this.g.selectAll(".radarArea")
      .data([dataset])

    var radarAreaEnter = radarArea
      .enter()
      .append("path")
      .attr("class", "radarArea")
      .style("fill-opacity", 0)
      .style("fill", component.cfg.color)

    radarArea
      .merge(radarAreaEnter)
      .transition(t)
      .attr("d", function(d,i) { return component.radarLine(d) + "Z"; })
      .style("fill", component.cfg.color)
      .style("stroke", this.cfg.color)
      .style("fill-opacity", this.cfg.opacityArea)
      .style("filter" , "url(#audienzzradar-drop-shadow)")


    var tooltip = this.g.append("text")
      .style("font-family", "sans-serif")
      .style("font-size", 12)
      .style("text-anchor", "middle")
      .attr("class", "tooltip")
      .style("text-shadow","0 1px 0 #fff, 1px 0 0 #fff, -1px 0 0 #fff, 0 -1px 0 #fff")
      .style("opacity", 0);

    var circles = this.g.selectAll(".radarCircle")
      .data(dataset,function (d) {return d.axis;})

    circles.exit().remove();

    var circlesEnter = circles  
      .enter().append("circle")
      .attr("class", "radarCircle")
      .style("opacity", 0)


    circles
      .merge(circlesEnter)
      .transition(t)
      .style("opacity", 1)
      .attr("r", 4)
      .attr("cx", function(d,i){ return component.rScale(d.value) * Math.cos(component.angleSlice*i - Math.PI/2 + component.rotateDeg); })
      .attr("cy", function(d,i){ return component.rScale(d.value) * Math.sin(component.angleSlice*i - Math.PI/2 + component.rotateDeg); })
      .style("fill", "#fff")
      .style("stroke", component.cfg.color)
      .style("stroke-width", 2);

    circlesEnter  
      .on("mouseover", function(d,i) {

        d3.select(this)
          .attr("r", 6)
          .style("fill", component.cfg.color)

        let newX = parseFloat(d3.select(this).attr('cx')) + 2;
        let newY = parseFloat(d3.select(this).attr('cy')) - 10;
            
        tooltip
          .attr('x', newX)
          .attr('y', newY)
          .text(d.value + "%")
          .transition().duration(200)
          .style('opacity', 1);
      })
      .on("mouseout", function(){
        d3.select(this)
          .attr("r", 4)
          .style("fill", "#fff")

        tooltip.transition().duration(200)
          .style("opacity", 0);
      });


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
        className="audienzz-radar"
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



AudienzzRadar.defaultProps = {
  width: 500,
  height: 500,
  hoverLength: 30,
  onMouseClick: () => {},
  onMouseOver: () => {},
  onMouseOut: () => {},
};

export default AudienzzRadar;
