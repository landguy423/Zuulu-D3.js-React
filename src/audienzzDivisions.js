import React from 'react';
import * as d3 from 'd3';
import isEqual from 'lodash.isequal';

class AudienzzIncome extends React.Component {

  constructor(props) {
    super(props);
    this.saveContainer = this.saveContainer.bind(this);
  }

  componentDidMount() {
 
    const component = this;


    this.margin = {top: 20, right: 20, bottom: 70, left: 40};
    this.width = this.props.width - this.margin.left - this.margin.right;
    this.height = this.props.height - this.margin.top - this.margin.bottom;

    this.x = d3.scaleBand().rangeRound([0, this.width]).padding(0.5);
    this.y = d3.scaleLinear().range([this.height, 0]);

    this.xAxis = d3.axisBottom()
        .scale(this.x)

    this.yAxis = d3.axisLeft()
        .scale(this.y)


    this.svg = d3.select(this.container).append("svg")
        .attr("width", this.props.width)
        .attr("height", this.props.height)
      .append("g")
        .attr("transform","translate(" + this.margin.left + "," + this.margin.top + ")");


    this.svg.append("g")
      .attr("class", "xAxis")
      .attr("transform", "translate(0," + this.height + ")")

    this.svg.append("g")
      .attr("class", "yAxis")

    this.svg.append("line")
      .attr("x1", 0)
      .attr("y1", this.height)
      .attr("x2", this.width)
      .attr("y2", this.height)
      .style("stroke", "#D8D8D8")
      .style("stroke-width", 1);  

    this.svg.append("line")
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", 0)
      .attr("y2", this.height)
      .style("stroke", "#D8D8D8")
      .style("stroke-width", 1);  

    this.svg.append("text").text("(%)")
      .style("font-family", "sans-serif")
      .style("font-size", 10)
      .style("fill", "#777777")
      .attr("transform","translate(-15,10) rotate(90)")

    var linesData = d3.range(1,10);

    this.svg.append("g")
        .selectAll("line")
        .data(linesData)
        .enter()
        .append("line")
          .attr("x1", 0)
          .attr("y1", function (d) {return component.height / 10 * d;})
          .attr("x2", this.width)
          .attr("y2", function (d) {return component.height / 10 * d;})
          .style("stroke", "#D8D8D8")
          .style("stroke-width", 0.4); 
    
    var defs = this.svg.append("defs");

    var filter = defs.append("filter")
        .attr("id", "audienzz-divisions-drop-shadow")
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
        .attr("class", "audienzzDivisionsTooltip svgTooltip")               
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

    this.x.domain(dataset.map(function(d) { return d.name; }));
    this.y.domain([0, d3.max(dataset, function(d) { return d.value; })]);


    var t = d3.transition()
          .duration(500);


    var xAxis = this.svg.select(".xAxis")
              //.transition(t)
              .call(this.xAxis)
    xAxis
      .selectAll('text')
      .attr('y', -5)
      .attr('x', -35)
      .attr('transform', 'rotate(-90)');

    xAxis.selectAll('.tick > line')
          .style("opacity",0)

    xAxis.selectAll('path')
          .style("opacity",0)



    let bars = this.svg.selectAll("rect")
        .data(dataset,function (d) {return d.name})

    let barsEnter = bars.enter().append("rect")
        .attr("x", function(d) { return component.x(d.name); })
        .style("fill", "steelblue")
        .attr("width", this.x.bandwidth())
        .attr("y", function(d) { return component.y(0); })
        .style("filter" , "url(#audienzz-divisions-drop-shadow)");

    bars.merge(barsEnter)
        .transition(t)
        .attr("y", function(d) { return component.y(d.value); })
        .attr("height", function(d) { return component.height - component.y(d.value); });

    barsEnter.on("mouseover", mouseover);

    barsEnter.on("mouseout", mouseout);


    function mouseover (d) {

        d3.select(component.container)
          .selectAll("rect")
          .style("opacity", 0.5)

        d3.select(this)
          .style("opacity", 1)


        d3.select(component.container).select(".audienzzDivisionsTooltip")     
            .style("opacity", .9)
            .html(d.name + "<br/>Value: " + d.value)  
            .style("left", (d3.event.pageX) + "px")     
            .style("top", (d3.event.pageY - 28) + "px");

    }          

    function mouseout (d) {

        d3.select(component.container)
          .selectAll("rect")
          .style("opacity", 1)

        d3.select(component.container).select(".audienzzDivisionsTooltip")     
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



AudienzzIncome.defaultProps = {
  width: 800,
  height: 500,
  hoverLength: 30,
  onMouseClick: () => {},
  onMouseOver: () => {},
  onMouseOut: () => {},
};

export default AudienzzIncome;
