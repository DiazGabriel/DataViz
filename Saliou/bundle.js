(function (d3) {
  'use strict';

  const dropdownMenu = (selection, props) => {
    const {
      options,
      onOptionClicked,
      selectedOption
    } = props;

    let select = selection.selectAll('select').data([null]);
    select = select.enter().append('select')
      .merge(select)
      .on('change', function () {
        onOptionClicked(this.value);
      });

    const option = select.selectAll('option').data(options);
    option.enter().append('option')
      .merge(option)
      .attr('value', d => d)
      .property('selected', d => d === selectedOption)
      .text(d => d);

  };

  const scatterPlot = (selection, props) => {
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

    function getBarColor(val) {
      const ratio = val / innerWidth;
      const r = 100 + 155 * ratio;
      const g = 155;
      const b = 155 - ratio * 155;
      return d3.rgb(r, g, b);
    }
    const xScale = d3.scaleLinear()
      .domain(d3.extent(data, xValue))
      .range([0, innerWidth])
      .nice();

    const yScale = d3.scaleLinear()
      .domain(d3.extent(data, yValue))
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

    const xAxis = d3.axisBottom(xScale)
      .tickSize(-innerHeight)
      .tickPadding(14);

    const yAxis = d3.axisLeft(yScale)
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
      .attr('x', -innerHeight / 2)
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
      .delay((d, i) => i * 1.5)
      .attr('cy', d => yScale(yValue(d)))
      .attr('cx', d => xScale(xValue(d)))
      .attr('r', circleRadius)
      .attr('opacity', circleOpacity)
      .attr('fill', d => getBarColor(xScale(xValue(d))))
      .attr('width', 10)
      .attr('height', 10);
    //.on("end", repeat);

  };

  const svg = d3.select('svg');

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
    
    d3.select('#x-menu')
      .call(dropdownMenu, {
        options: data.columns,
      	onOptionClicked: onXColumnClicked,
      	selectedOption: xColumn
      });
      

    // Menus
    d3.select('#y-menu')
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


  d3.csv('../Data/scatter_data.csv')
    .then(loadedData => {
      data = loadedData;

      /*
      data = data.map(function (d) {
        if (d.secondeVoiture != "true") {
          d.secondeVoiture = "0";
        }
        else {
          d.secondeVoiture = "1";
        }
        return d;

      });
      */

      data.forEach(d => {
        d.Age = +d.Age;
        d.Taux = +d.Taux;
        d.Enfants = +d.Enfants;
        d.secondeVoiture = +d.secondeVoiture;
      });
      xColumn = data.columns[3];
      yColumn = data.columns[0];
      render();
    });

}(d3));