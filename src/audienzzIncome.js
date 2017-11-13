import React from 'react';
import * as d3 from 'd3';
import isEqual from 'lodash.isequal';

class AudienzzIncome extends React.Component {

  constructor(props) {
    super(props);
    this.saveContainer = this.saveContainer.bind(this);
  }

  componentDidMount() {
 
    //const component = this;

    this.margin = {top:30, right:20, bottom: 30, left:20};



    this.svg = d3.select(this.container).append("svg")
        .attr("width",  this.props.width)
        .attr("height", this.props.height)
        .attr("class", "audienzzRadar");

    this.g = this.svg.append("g")
        .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");


    this.yScale = d3.scaleLinear()
      .range([0, this.props.height - (this.margin.top + this.margin.bottom)]);


    this.g.append("line")
      .attr("x1", 0)
      .attr("y1", this.props.height - (this.margin.top + this.margin.bottom))
      .attr("x2", this.props.width)
      .attr("y2", this.props.height - (this.margin.top + this.margin.bottom))
      .style("stroke", "#D6D6D6")
      .style("stroke-width", 1);


    this.div = d3.select(this.container).append("div")   
        .attr("class", "audienzzIncomeTooltip svgTooltip")               
        .style("opacity", 0);



    var filter = this.svg.append('defs').append('filter').attr('id','audienzzincome-innershadow');
    filter.append('feGaussianBlur')
        .attr('in','SourceAlpha')
        .attr('stdDeviation','10')
        .attr('result','blur');

    filter.append('feOffset')
        .attr('dy','5')
        .attr('dx','0');  

    filter.append('feComposite')
        .attr('in2','SourceAlpha')
        .attr('operator','arithmetic')
        .attr('k2','-1') 
        .attr('k3','1') 
        .attr('result','shadowDiff') 

    filter.append('feFlood')
        .attr('flood-color','#444444')
        .attr('flood-opacity','0.5'); 

    filter.append('feComposite')
        .attr('in2','shadowDiff')
        .attr('operator','in')

    filter.append('feComposite')
        .attr('in2','SourceGraphic')
        .attr('operator','over')
        .attr('result','firstfilter')


    this.draw(this.props.dataset);


  }

  componentWillUpdate(nextProps) {
    if (!isEqual(nextProps.dataset, this.props.dataset)) {
      this.draw(nextProps.dataset);
    }
  }

  draw(dataset) {


    const component = this;

    var sum = 0;

    var t = d3.transition()
              .duration(500);

    dataset.forEach(function (d) {
      d.offset = sum;
      sum += d.value;
    })

    var sumAll = dataset.reduce(function (acc,val) {
      return acc + val.value;
    },0);  


    let barsWidth = component.props.width/2 - (component.margin.left + component.margin.right);

    let rects = this.g
      .selectAll("rect")
      .data(dataset)


    let rectsEnter = rects.enter()  
      .append("rect")
      .attr("width", function(d) { return component.props.width/2 - (component.margin.left + component.margin.right); })
      .attr("y", function(d) { return component.yScale(d.offset / sumAll); })
      .style("fill", function(d) {  return d.color; });

    rects.merge(rectsEnter)
      .transition(t)
      .attr("x",20)
      .attr("y", function(d) { return component.yScale(d.offset / sumAll); })
      .attr("height", function(d) { return component.yScale(d.value / sumAll); })
      .attr("width", barsWidth)
      .style("stroke","white")
      .style("stroke-width", 1)
      .attr("filter" , "url(#audienzzincome-innershadow")
      .attr("cursor", "pointer");




    let labels = this.g
      .selectAll("text")
      .data(dataset)

    let labelsEnter = labels.enter()  
      .append("text")
      .attr("transform", function(d) { return "translate(" + [barsWidth + 40, component.yScale((d.offset / sumAll) + (d.value/2) / sumAll)] + ")"; })
      .style("font-family", "sans-serif")
      .style("font-size", "11px")
      .style("fill", "#777777");

    labels.merge(labelsEnter)
      .transition(t)
      .attr("transform", function(d) { return "translate(" + [barsWidth + 40, component.yScale((d.offset / sumAll) + (d.value/2) / sumAll)] + ")"; })
      .text(function (d) {return d.name})

    rectsEnter.on("mouseover", mouseover);

    rectsEnter.on("mouseout", mouseout);



    function mouseover (d) {

        d3.select(component.container)
          .selectAll("rect")
          .style("opacity", 0.5)

        d3.select(this)
          .style("opacity", 1)


        d3.select(component.container).select(".audienzzIncomeTooltip")     
            .style("opacity", .9)
            .html(d.name + "<br/>Value: " + d.value)  
            .style("left", (d3.event.pageX) + "px")     
            .style("top", (d3.event.pageY - 28) + "px");



    }          

    function mouseout (d) {

        d3.select(component.container)
          .selectAll("rect")
          .style("opacity", 1)

        d3.select(component.container).select(".audienzzIncomeTooltip")     
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
  width: 500,
  height: 500,
  hoverLength: 30,
  onMouseClick: () => {},
  onMouseOver: () => {},
  onMouseOut: () => {},
};

export default AudienzzIncome;
