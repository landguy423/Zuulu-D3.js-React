import React from 'react';
import * as d3 from 'd3';
import isEqual from 'lodash.isequal';


class AudienzzDots extends React.Component {

  constructor(props) {
    super(props);
    this.saveContainer = this.saveContainer.bind(this);
  }

  componentDidMount() {

    d3.select(this.container).select("svg").remove();

    this.svg = d3.select(this.container).append("svg")
                .attr("width", this.props.width)
                .attr("height", this.props.height);
        

    var defs = this.svg.append("defs");

    var filter = defs.append("filter")
        .attr("id", "dots-drop-shadow")
        .attr("width", "150%")
        .attr("height", "150%");

    filter.append("feGaussianBlur")
        .attr("in", "SourceAlpha")
        .attr("stdDeviation", 1);


    filter.append("feOffset")
        .attr("dx", 1)
        .attr("dy", 1)
        .attr("result", "offsetBlur");

    var feComponentTransfer = filter.append("feComponentTransfer");
        feComponentTransfer.append("feFuncA")
            .attr("type","linear") 
            .attr("slope",0.4);

    var feMerge = filter.append("feMerge");
        feMerge.append("feMergeNode");
        feMerge.append("feMergeNode")
               .attr("in", "SourceGraphic");


    this.div = d3.select(this.container).append("div")   
        .attr("class", "dotsTooltip svgTooltip")               
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
    var svgWidth = component.props.width;

    var placeCircle = (data) => {
        
        d3.select(this.container).selectAll(".table").remove();
        
        var mainGroup = this.svg.append("g")
                            //.attr("alignment-baseline","central")
                            .attr("transform",function () { return "translate(" + (svgWidth/2 - 183) + ",0)"});

        var groups = mainGroup.selectAll("g")
            .data(data).enter()
            .append("g")
            .attr("transform", function (d, i) {
            var x = 17 * d.position[0];
            var y = (17 * d.position[1]) + 30;
            // console.log([x, y]);

            return "translate(" + [x, y] + ")";
        }).attr("class", "table");

        var squares = groups.append("rect")
                        .attr("width", 17)
                        .attr("height", 17)
                        .style("opacity", 0)
                        .style("cursor", "pointer");

        var circles = groups.append("circle")
            .attr("r", 4)
            .attr("transform", "translate(3,3)")
            .style("opacity", 0)
            .style("pointer-events", "none")
            .attr("class", function  (d) {
              return "dots" + d.name.split(" ")[0];
            })

        squares    
        .on('mouseover', function onMouseOver (d) { 

            d3.select(component.container).selectAll(".dots" + d.name)
              .attr("r", 5);

            d3.select(component.container).select(".dotsTooltip")     
                .style("opacity", .9)
                .text(d.name)  
                .style("left", (d3.event.pageX) + "px")     
                .style("top", (d3.event.pageY - 28) + "px")

        }) 
        .on("mouseout", function onMouseOut (d) {  

            d3.select(component.container).selectAll("circle")
              .attr("r", 4)

            d3.select(component.container).select(".dotsTooltip")
                .style("opacity", 0)
        });

        circles   
            .transition()
            .attr("fill", function (d, i) {
                return d.color
            })
            .style("opacity", 1)
            .style("filter", "url(#dots-drop-shadow)")
            .duration(200)
            .delay(function (d, i) {
            return i * 10;
        })



    };




    //calculatePositions(20, 5);

    var datasetPosition = 0;
    var percentageSum = dataset[0].percentage;

    (function () {
        var myArray = [];
        for (var i = 1; i <= 20; i += 1) {
            for (var n = 1; n <= 5; n += 1) {
            myArray.push({position:[i,n]})
          }
        }   

        let data = myArray.map(function (d,i) {

            

            if (i > percentageSum && datasetPosition < dataset.length - 1) {
                datasetPosition += 1;
                percentageSum += dataset[datasetPosition].percentage;
            }

            return {position: d.position, color: dataset[datasetPosition].color, name: dataset[datasetPosition].name}
        })

        placeCircle(data); 

    }())

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
          className="zulu5-dots"
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


AudienzzDots.defaultProps = {
  width: 500,
  height: 150,
  hoverLength: 30,
  onMouseClick: () => {},
  onMouseOver: () => {},
  onMouseOut: () => {},
};





export default AudienzzDots;
