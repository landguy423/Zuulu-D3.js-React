import React from 'react';
import * as d3 from 'd3';
import isEqual from 'lodash.isequal';

class Legend extends React.Component {

  constructor(props) {
    super(props);
    this.saveContainer = this.saveContainer.bind(this);
  }

  componentDidMount() {
  	
  	this.div = d3.select(this.container);
  	this.draw(this.props.dataset);
  }	

  componentWillUpdate(nextProps) {
    if (!isEqual(nextProps.dataset, this.props.dataset)) {
      this.draw(nextProps.dataset);
    }
  }

  draw(dataset) {

  	this.div.select("table").remove();

  	var table = this.div.append("table")
  		.style("width", "80%");

    var rows = table.selectAll("tr.row")
      .data(dataset)
      .enter()
      .append("tr")
        .attr("class", "row")   

    rows.append("td")
      .text(function(d) { return d.color; })  

    rows.append("td")
      .text(function(d) { return d.name})    

    rows.append("td")
      .text(function(d) { return Math.ceil(d.percentage) + "%"; })                                  

  }

  saveContainer(container) {
    this.container = container;
  }

  render() {
    // const {
    //   width,
    //   height,
    //   children,
    // } = this.props;
    return (
      <div className="zulu5-legend" ref={this.saveContainer}>

      </div>
    );
  }
}

export default Legend;
