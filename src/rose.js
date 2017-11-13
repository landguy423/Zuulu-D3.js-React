import React from 'react';
import * as d3 from 'd3';
import isEqual from 'lodash.isequal';

class Rose extends React.Component {

  constructor(props) {
    super(props);
    this.saveContainer = this.saveContainer.bind(this);
  }

  componentDidMount() {

    this.draw(this.props.dataset);

  }

  componentWillUpdate(nextProps) {
    if (!isEqual(nextProps.dataset, this.props.dataset)) {
      this.draw(nextProps.dataset);
    }
  }

  draw(dataset) {

    const component = this;

    let data = dataset.sort(function (a, b) {
  		return a.Size - b.Size;
  	})

    d3.select(this.container).selectAll(".arcRose").remove();

    const margin = {
      top: -40,
      right: 25,
      bottom: 200,
      left: 25,
    };

    this.width = this.props.width - margin.left - margin.right;
    this.height = this.props.width - margin.top - margin.bottom;

    this.svg = d3.select(this.container)
      .append('svg')
      .attr('width', this.props.width + margin.left + margin.right)
      .attr('height', this.props.height + margin.top + margin.bottom);

    this.g = this.svg.append("g")
      .attr("transform", "translate(" + (this.width + margin.left + margin.right) / 2 + "," + (this.height) / 2 + ")");  

    this.radius = Math.min(this.width, this.height) / 2;

    var defs = this.svg.append("defs")
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    var filter = defs.append("filter")
        .attr("id", "rose-drop-shadow")
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

  	this.svg      	
  	    .append("image")
  			.attr("width", 298)
  			.attr("height", 60)
        .attr('x', this.props.width/2 - 155)
        .attr('y', this.props.height - 60)      
        .attr("xlink:href", "roseicons/roseLegend.png")

    this.div = d3.select(this.container).append("div")   
        .attr("class", "roseTooltip svgTooltip")               
        .style("opacity", 0);

  	var maxValue = d3.max(data, function(d) { return d.Size; });

  	var mainScale = d3.scaleLinear()
  				    .domain([0, maxValue])
  				    .range([0, this.radius]);


  	var pie = d3.pie()
  	    .sort(null)
  	    .value(function(d) { return d.Size; });

  	var arcGroups = this.g.selectAll(".arcRose")
  		.data(pie(data))
  		.enter().append("g")
  		  .attr("class", "arcRose");

  	var pathZero = d3.arc()
  	    .outerRadius(1)
  	    .innerRadius(0);

  	var arc = d3.arc()
  		.innerRadius(0)
  		.outerRadius(function(d,i) { return mainScale( d.value ); } );

    var arcMouseover = d3.arc()
      .innerRadius(0)
      .outerRadius(function(d,i) { return mainScale( d.value ) + 3; } );



  	let wedges = arcGroups.selectAll('path')
  	  	.data(function(d) { 

  	  		return d.data.Values
  		  		.sort(function (a,b) {
  		  			return b.value - a.value;
  		  		})
  		  		.map(function (item, i) {
  		  			return { name: item.name, 
  		  			     index: i, 
                   color: item.color,
                   hoverColor: item.hoverColor,
  		  			     value: item.value, 
  		  			     startAngle: d.startAngle, 
  		  			     endAngle: d.endAngle
  		  			 }
  		  		})
  	  	})
  	  .enter().append('path')
  	  	.attr("fill", function(d, i) { return d.color; })
        .attr("cursor", "pointer")
  	  	.style("filter", "url(#rose-drop-shadow)")
  	  	.attr('d', pathZero )


  	wedges.on("mouseover", mouseover);

  	wedges.on("mouseout", mouseout);


  	wedges  	
  	  		.transition()
  	  		.duration(250)
  	  		.delay(function (d,i) {
            return i * 130
          })
  	  	  .attr('d', arc );

    //  wedges Labels 
    arcGroups.selectAll('text')
        .data(function(d) { 

          return d.data.Values
            .sort(function (a,b) {
              return b.value - a.value;
            })
            .map(function (item, i) {
              let nextValue = i < 2 ? d.data.Values[i+1].value : 0;
              return { name: item.name, 
                   index: i, 
                   value: item.value, 
                   startAngle: d.startAngle, 
                   endAngle: d.endAngle,
                   nextValue: nextValue
               }
            })
        })
      .enter().append('text').text((d,i) => {
        return d.value >= 4 && (d.value - d.nextValue) > 3 ? "%" + d.value : "";
        //return "%" + d.value;
      })
      .attr("transform", function(d) {
        let xValue = Math.cos(((d.startAngle + d.endAngle - Math.PI)/2)) * mainScale((d.value + d.nextValue)/2);
        let yValue = Math.sin((d.startAngle + d.endAngle - Math.PI)/2) * mainScale((d.value + d.nextValue)/2);
        return "translate(" + xValue + "," + yValue + ")";
      })
      .style("font-size", 9)
      .attr("fill","white")
      .style("text-anchor", "middle")
      .style("alignment-baseline","middle")
      .attr("pointer-events","none")
      .style("font-family", "sans-serif")


  	var labels = arcGroups.append("g")
  	      	.attr("transform", function(d) {
  	        	return "translate(" + Math.cos(((d.startAngle + d.endAngle - Math.PI)/2)) * mainScale(d.value)/1.25 + "," 
  	        	+ Math.sin((d.startAngle + d.endAngle - Math.PI)/2) * mainScale(d.value)/1.25 + ")";
  	      	});


  	labels      	
  	    .append("image")
  			.attr("width", 25)
  			.attr("height", 25)
        .attr('x', -12)
        .attr('y', 20)      
        .attr("xlink:href", function (d,i) {
          return "roseicons/" + d.data.Image;
        })

  	labels
  			.append("text")
        .style("font-size", 14)
  			.style("text-anchor", "middle")
  			.attr("y", 60)
        .style("font-family", "sans-serif")
  			.text(function (d) {
  				return d.data.Type;
  			})			

  	labels
  			.append("text")
        .style("font-size", 14)
  			.style("text-anchor", "middle")
  			.attr("y", 80)
        .style("font-family", "sans-serif")
  			.text(function (d) {
  				return "%" + d.value;
  			})


  	labels
  	      	.attr("opacity", 0)
  	      	.transition(400)
  	      	.delay(function (d,i) {
  	      		return i * 100;
  	      	})
  	      	.attr("opacity", 1)

    function mouseover (d) {

        d3.select(this)
          .transition()
          .duration(200)
          .attr('d', arcMouseover);


	      d3.select(component.container).select(".roseTooltip")     
	          .style("opacity", .9)
	          .html(d.name + "<br/>%" + d.value)  
	          .style("left", (d3.event.pageX) + "px")     
	          .style("top", (d3.event.pageY - 28) + "px");



  	}          

    function mouseout (d) {

        d3.select(this)
          .transition()
          .duration(200)
          .attr('d', arc);

	      d3.select(component.container).select(".roseTooltip")     
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
        className="zulu5-rose"
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

Rose.defaultProps = {
  width: 500,
  height: 500,
  hoverLength: 30,
  onMouseClick: () => {},
  onMouseOver: () => {},
  onMouseOut: () => {},
};

export default Rose;
