import {
  select,
  csv,
  scaleLinear,
  extent,
  axisLeft,
  axisBottom,
  format,
  rgb
} from 'd3';

export const scatterPlot = (selection, props) => {
  const {
    xValue,
    xAxisLabel,
    yValue,
    yAxisLabel,
    margin,
    width,
    height,
    data
  } = props;
  
  
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const circleRadius = 5;
  const circleOpacity = 0.5;
  
  function getBarColor(val)
  {
    const ratio = val/innerWidth;
    const r = 100 + 155*ratio;
    const g = 155;
    const b = 155 - ratio*155;
    return rgb(r, g, b);
  };
  
  const xScale = scaleLinear()
  	.domain(extent(data, xValue))
  	.range([0, innerWidth])
  	.nice();
  
  const yScale = scaleLinear()
  	.domain(extent(data, yValue))
  	.range([innerHeight, 0])
  	.nice();
  
  const g = selection.selectAll('.container').data([null]);
  const gEnter = g
  	.enter().append('g')
  		.attr('class', 'container');
  
  gEnter
    .merge(g)
      .attr('transform',
            `translate(${margin.left}, ${margin.top})`
           );
  
  const xAxis = axisBottom(xScale)
  	.tickSize(-innerHeight)
  	.tickPadding(14);
  
  const yAxis = axisLeft(yScale)
  	.tickSize(- innerWidth)
  	.tickPadding(10);
  
  const yAxisG = g.select('.y-axis');
  const yAxisGEnter = gEnter
  	.append('g')
  		.attr('class', 'y-axis');
  
  yAxisG
  	.merge(yAxisGEnter)
  		.call(yAxis)
  		.selectAll('.domain').remove();
  
  const yAxisLabelText = yAxisGEnter
    .append('text')
      .attr('class', 'axis-label')
  		.attr('y', -56)
  		.attr('fill', 'black')
  		.attr('transform', `rotate(-90)`)
      .attr('text-anchor', 'middle')
  	.merge(yAxisG.select('.axis-label'))
      .attr('x', -innerHeight/2)
      .text(yAxisLabel);
  
  const xAxisG = g.select('.x-axis');
  const xAxisGEnter = gEnter
  	.append('g')
  		.attr('class', 'x-axis');
  xAxisG
  	.merge(xAxisGEnter)
  		.attr('transform', `translate(0, ${innerHeight})`)
  		.call(xAxis)
  		.selectAll('.domain').remove();
  
  const xAxisLabelText = xAxisGEnter
    .append('text')
      .attr('class', 'axis-label')
  		.attr('y', 50)
  		.attr('fill', 'black')
      .attr('text-anchor', 'middle')
  	.merge(xAxisG.select('.axis-label'))
      .attr('x', innerWidth / 2)
      .text(xAxisLabel);
  
  // Circles
	const circles = g.merge(gEnter)
  	.selectAll('circle').data(data);
  
  circles
  	.enter().append('circle')
  		.attr('cy', innerHeight)
  		.attr('cx', 0)
  		.attr('opacity', 0)
  		.attr('r', 0)    
  	.merge(circles)
  	.transition().duration(200)
  	.delay((d, i) => i*1.5)
  		.attr('cy', d => yScale(yValue(d)))
  		.attr('cx', d => xScale(xValue(d)))
  		.attr('r', circleRadius)
  		.attr('opacity', circleOpacity)
  		.attr('fill', d => getBarColor( xScale(xValue(d)) ))
  		.attr('width', 10)
  		.attr('height', 10)
};