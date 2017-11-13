import React from 'react';
import * as d3 from 'd3';
import isEqual from 'lodash.isequal';

class D3Pie extends React.Component {

  constructor(props) {
    super(props);
    this.saveContainer = this.saveContainer.bind(this);
  }

  componentDidMount() {
    this.radius = (Math.min(this.props.width, this.props.height) / 2) - this.props.hoverLength;

    this.arc = d3.arc()
      .innerRadius(this.radius/3)
      .outerRadius(this.radius/1.5);

    this.pie = d3.pie()
      .value(d => d.value)
      .sort(null);

    this.svg = d3.select(this.container)
      .append('svg')
      .attr('width', this.props.width)
      .attr('height', this.props.height);

    this.mainGroup = this.svg  
      .append('g')
      .attr('transform', `translate(${this.props.width / 2}, ${this.props.height / 2})`);


    this.labelGroup = this.svg.append("g")
      .attr("class", "label_group")
      .attr("transform", `translate(${this.props.width / 2}, ${this.props.height / 2})`);


    var defs = this.svg.append("defs");

    var filter = defs.append("filter")
        .attr("id", "donut-drop-shadow")
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
        .attr("class", "donutTooltip svgTooltip")               
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

    //let thirdBiggest = dataset.sort(function (a,b) { return b.value - a.value})[2].value;

    // console.log(thirdBiggest)    

    const tweenArcs = function tweenArcs(a) {
      const i = d3.interpolate(this.current, a);
      this.current = i(0);
      return t => component.arc(i(t));
    };

    const tweenFillOver = function tweenFillOver(d) {
      const i = d3.interpolateRgb(d.data.backgroundColor, d.data.hoverBackgroundColor);
      return t => i(t);
    };
    const tweenFillOut = function tweenFillOut(d) {
      const i = d3.interpolateRgb(d.data.hoverBackgroundColor, d.data.backgroundColor);
      return t => i(t);
    };
    const tweenArcOver = function tweenArcOver(d) {
      const i = d3.interpolateNumber(d.outerRadius, component.radius/1.5 + 5);
      return (t) => {
        const newValue = i(t);
        d.outerRadius = newValue; // eslint-disable-line no-param-reassign
        return component.arc.outerRadius(newValue)(d);
      };
    };

    const tweenArcOut = function tweenArcOut(d) {
      const i = d3.interpolateNumber(d.outerRadius, component.radius/1.5);
      return (t) => {
        const newValue = i(t);
        d.outerRadius = newValue; // eslint-disable-line no-param-reassign
        return component.arc.outerRadius(newValue)(d);
      };
    };

    const tweenIcons = function (a) {

      var c = (this.current.startAngle + this.current.endAngle - Math.PI)/2; 
      var b = (a.startAngle + a.endAngle - Math.PI)/2;

      var fn = d3.interpolateNumber(c, b);
      return function(t) {
        var val = fn(t);
        return "translate(" + Math.cos(val) * component.radius/1.1 + "," + Math.sin(val) * component.radius/1.1 + ")";
      };
    };


    // update data to element binding
    const g = this.mainGroup
      .selectAll('path')
      .data(this.pie(dataset));

    // update existing
    g
      .each((d) => {
        d.outerRadius = this.radius/1.5; // eslint-disable-line no-param-reassign
      })
      .transition()
      .duration(500)
      .attrTween('d', tweenArcs);

    // add new
    g
      .enter()
      .append('path')
      .style("filter", "url(#donut-drop-shadow)")
      .each((d) => {
        d.outerRadius = this.radius/1.5; // eslint-disable-line no-param-reassign
      })
      .on('mouseover', function onMouseOver(d) {

        d3.select(component.container).select(".donutTooltip")     
            .style("opacity", .9)
            .text(d.data.name)  
            .style("left", (d3.event.pageX) + "px")     
            .style("top", (d3.event.pageY - 28) + "px")

        d3.select(this)
          .transition()
          .duration(200)
          .attrTween('d', tweenArcOver)
          .attrTween('fill', tweenFillOver)
          .on('end', () => component.props.onMouseOver(d));
      })
      .on('mouseout', function onMouseOut(d) {

        d3.select(component.container).select(".donutTooltip")
            .style("opacity", 0)

        d3.select(this)
          .transition()
          .duration(200)
          .attrTween('d', tweenArcOut)
          .attrTween('fill', tweenFillOut)
          .on('end', () => component.props.onMouseOut(d));
      })
      .on('click.callback', this.props.onMouseClick)
      .transition()
      .duration(500)
      .attr('fill', d => d.data.backgroundColor)
      .attr('d', this.arc)
      .each(function saveCurrent(d) {
        this.current = d;
      });

    // remove missing
    g
      .exit()
      .remove();




    // donut icons
    let icons = this.labelGroup.selectAll("image").data(this.pie(dataset))
      .attr("xlink:href", function (d,i) {
        return "donutIcons/" + d.data.icon;
      })

    icons.enter().append("image")
      .attr("class", "donutIcon")
      .attr("transform", function(d) {
        return "translate(" + Math.cos(((d.startAngle + d.endAngle - Math.PI)/2)) * component.radius/1.1 + "," + Math.sin((d.startAngle + d.endAngle - Math.PI)/2) * component.radius/1.1 + ")";
      })
      .attr('x', -25)
      .attr('y', -25)
      .attr("width", 60)
      .attr("height", 60)      
      .attr("xlink:href", function (d,i) {
        return "donutIcons/" + d.data.icon;
      })
      .attr("display", function(d) { 
        // display if arc is bigger that 1 radian
        return (d.endAngle - d.startAngle > 1) ? null : "none";
      })      
      .each(function (d) {
        this.current = d;
      });

    icons.attr("display", function(d) { 
        return (d.endAngle - d.startAngle > 1) ? null : "none";
      })
    .transition()
    .duration(500)
    .attrTween("transform", tweenIcons);

    icons.exit().remove();

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
        className="zulu5-pie"
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

D3Pie.propTypes = {
  width: React.PropTypes.number.isRequired,
  height: React.PropTypes.number.isRequired,
  children: React.PropTypes.node,
  hoverLength: React.PropTypes.number.isRequired,
  dataset: React.PropTypes.arrayOf(React.PropTypes.shape({
    value: React.PropTypes.number.isRequired,
    backgroundColor: React.PropTypes.string.isRequired,
    hoverBackgroundColor: React.PropTypes.string.isRequired,
  })),
  onMouseClick: React.PropTypes.func.isRequired,
  onMouseOver: React.PropTypes.func.isRequired, // eslint-disable-line react/no-unused-prop-types
  onMouseOut: React.PropTypes.func.isRequired, // eslint-disable-line react/no-unused-prop-types
};

D3Pie.defaultProps = {
  width: 500,
  height: 500,
  hoverLength: 30,
  onMouseClick: () => {},
  onMouseOver: () => {},
  onMouseOut: () => {},
};

export default D3Pie;
