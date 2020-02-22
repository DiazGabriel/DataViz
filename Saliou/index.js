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

import { dropdownMenu } from './dropdownMenu';
import { scatterPlot } from './scatterPlot';

const svg = select('svg');

const width = +svg.attr('width');
const height = +svg.attr('height');

let data;
let xColumn;
let yColumn;

const onXColumnClicked = column => {
  xColumn = column;
  render();
};

const onYColumnClicked = column => {
  yColumn = column;
  render();
};

const render = () => {
  
  // Menus
  select('#x-menu')
    .call(dropdownMenu, {
      options: data.columns,
    	onOptionClicked: onXColumnClicked,
    	selectedOption: xColumn
    });

  // Menus
  select('#y-menu')
    .call(dropdownMenu, {
      options: data.columns,
    	onOptionClicked: onYColumnClicked,
    	selectedOption: yColumn
    });
  
  svg.call(scatterPlot, {
    xValue: d => d[xColumn],
    xAxisLabel: xColumn,
    yValue: d => d[yColumn],
    yAxisLabel: yColumn,
    margin: { top: 60, right: 60, bottom: 70, left: 80 },
    width,
    height,
    data
  });
  
};


csv('https://vizhub.com/curran/datasets/auto-mpg.csv')
  .then(loadedData => {
  	data = loadedData;
  	data.forEach(d => {
    	d.mpg = +d.mpg;
    	d.cylinders = +d.cylinders;
    	d.displacement = +d.displacement;
    	d.horsepower = +d.horsepower;
    	d.weight = +d.weight;
    	d.acceleration = +d.acceleration;
    	d.year = +d.year;
  	});
  	xColumn = data.columns[4];
  	yColumn = data.columns[0];
  	render();
	});
