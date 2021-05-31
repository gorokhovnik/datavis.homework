const width = 1000;
const barWidth = 500;
const height = 500;
const margin = 30;

const yearLabel = d3.select('#year');
const countryName = d3.select('#country-name');

const barChart = d3.select('#bar-chart')
    .attr('width', barWidth)
    .attr('height', height);

const scatterPlot = d3.select('#scatter-plot')
    .attr('width', width)
    .attr('height', height);

const lineChart = d3.select('#line-chart')
    .attr('width', width)
    .attr('height', height);

let xParam = 'fertility-rate';
let yParam = 'child-mortality';
let rParam = 'gdp';
let year = '2000';
let param = 'child-mortality';
let lineParam = 'gdp';
let chosen = null;
let selectedCountry;
let selectedRegion;

const x = d3.scaleLinear().range([margin * 2, width - margin]);
const y = d3.scaleLinear().range([height - margin, margin]);

const xBar = d3.scaleBand().range([margin * 2, barWidth - margin]).padding(0.1);
const yBar = d3.scaleLinear().range([height - margin, margin])

const xAxis = scatterPlot.append('g').attr('transform', `translate(0, ${height - margin})`);
const yAxis = scatterPlot.append('g').attr('transform', `translate(${margin * 2}, 0)`);

const xLineAxis = lineChart.append('g').attr('transform', `translate(0, ${height - margin})`);
const yLineAxis = lineChart.append('g').attr('transform', `translate(${margin * 2}, 0)`);

const xBarAxis = barChart.append('g').attr('transform', `translate(0, ${height - margin})`);
const yBarAxis = barChart.append('g').attr('transform', `translate(${margin * 2}, 0)`);

const colorScale = d3.scaleOrdinal().range(['#DD4949', '#39CDA1', '#FD710C', '#A14BE5']);
const radiusScale = d3.scaleSqrt().range([5, 40]);

loadData().then(data => {

    colorScale.domain(d3.set(data.map(d => d.region)).values());

    d3.select('#range').on('input', function () {
        year = d3.select(this).property('value');
        yearLabel.html(year);
        updateScatterPlot();
        updateBar();
    });

    d3.select('#radius').on('change', function () {
        rParam = d3.select(this).property('value');
        updateScatterPlot();
    });

    d3.select('#x').on('change', function () {
        xParam = d3.select(this).property('value');
        updateScatterPlot();
    });

    d3.select('#y').on('change', function () {
        yParam = d3.select(this).property('value');
        updateScatterPlot();
    });

    d3.select('#param').on('change', function () {
        param = d3.select(this).property('value');
        updateBar();
    });

    d3.select('#p').on('change', function () {
        lineParam = d3.select(this).property('value');
        updateLinear();
    });

    function updateSelected() {
        d3.selectAll('rect').on('click', function (selected) {
            if (chosen != this) {
                d3.selectAll('rect').style('opacity', 0.3);
                d3.select(this).style('opacity', 1);

                selectedRegion = selected.region

                d3.selectAll('circle').style('opacity', 0);
                d3.selectAll('circle').filter(function (d) {
                    return d['region'] == selectedRegion;
                }).style('opacity', 1);
                chosen = this;
            } else {
                d3.selectAll('rect').style('opacity', 1);
                d3.selectAll('circle').style('opacity', 0.9);
                chosen = null;
            }
        });
        if (chosen != null) {
            d3.selectAll('circle').style('opacity', 0);
            d3.selectAll('circle').filter(function (d) {
                return d['region'] == selectedRegion;
            }).style('opacity', 1);
        }

    }

    function updateBar() {
        uniqueRegions = d3.map(data, function (d) {
            return d['region'];
        }).keys();

        means = uniqueRegions.map(
            regions => (
                d3.mean(
                    data.filter(d => d['region'] == regions)
                        .flatMap(d => d[param][year])
                )
            )
        );

        meansRegions = [];
        uniqueRegions.forEach((key, i) => {
            let tmp = {"region": key, "mean": means[i]};
            meansRegions.push(tmp);
        });

        xBar.domain(uniqueRegions);
        xBarAxis.call(d3.axisBottom(xBar));

        yBar.domain([0, d3.max(means)]);
        yBarAxis.call(d3.axisLeft(yBar));

        barChart.selectAll('rect').data(meansRegions)
            .enter()
            .append('rect')
            .attr('width', xBar.bandwidth())
            .attr('height', function (d) {
                return height - yBar(d['mean']);
            })
            .attr('x', function (d) {
                return xBar(d['region']);
            })
            .attr('y', function (d) {
                return yBar(d['mean']) - 30;
            })
            .style("fill", function (d) {
                return colorScale(d['region']);
            });

        barChart.selectAll('rect').data(meansRegions)
            .attr('width', xBar.bandwidth())
            .attr('height', function (d) {
                return height - yBar(d['mean']);
            })
            .attr('x', function (d) {
                return xBar(d['region']);
            })
            .attr('y', function (d) {
                return yBar(d['mean']) - 30;
            })
            .style("fill", function (d) {
                return colorScale(d['region']);
            });

        updateSelected();

        return;
    }

    function updateScatterPlot() {
        let xRange = data.map(function (d) {
            return +d[xParam][year];
        });
        x.domain([0, d3.max(xRange) * 1.1]);
        xAxis.call(d3.axisBottom(x));

        let yRange = data.map(function (d) {
            return +d[yParam][year];
        });
        y.domain([0, d3.max(yRange) * 1.1]);
        yAxis.call(d3.axisLeft(y));

        let rRange = data.map(function (d) {
            return +d[rParam][year];
        });
        radiusScale.domain([d3.min(rRange), d3.max(rRange)]);

        scatterPlot.selectAll('circle').data(data)
            .enter()
            .append('circle')
            .attr("cx", function (d) {
                return x(d[xParam][year]);
            })
            .attr("cy", function (d) {
                return y(d[yParam][year]);
            })
            .attr("r", function (d) {
                return radiusScale(d[rParam][year]);
            })
            .style("fill", function (d) {
                return colorScale(d['region']);
            })
            .style("opacity", 0.9);

        scatterPlot.selectAll('circle').data(data)
            .attr("cx", function (d) {
                return x(d[xParam][year]);
            })
            .attr("cy", function (d) {
                return y(d[yParam][year]);
            })
            .attr("r", function (d) {
                return radiusScale(d[rParam][year]);
            })
            .style("fill", function (d) {
                return colorScale(d['region']);
            })
            .style("opacity", 0.9);

        scatterPlot.selectAll('circle').on('click', function (selected) {
            selectedCountry = selected['country'];
            selectedCountryRegion = selected['region'];
            d3.selectAll('circle').style('stroke-width', 1);
            this.parentNode.appendChild(this);
            d3.select(this).style('stroke-width', 5);
            updateLinear();
        });

        updateSelected()

        return;
    }

    function updateLinear() {
        if (selectedCountry) {
            d3.select('.country-name').text(selectedCountry);

            let countryData = data.filter(d => d['country'] == selectedCountry).map(d => d[lineParam])[0];

            let linearData = [];
            for (let i = 1800; i < 2021; i++)
                linearData.push({"year": i, "value": parseFloat(countryData[i])})

            linearData.splice(221, 5);

            x.domain([1800, 2020]);
            xLineAxis.call(d3.axisBottom(x).tickFormat(d3.format("d")));

            let yRange = d3.values(countryData).map(d => +d);
            y.domain([0, d3.max(yRange)]);
            yLineAxis.call(d3.axisLeft(y));

            lineChart.append('path').attr('class', 'line').datum(linearData)
                .enter()
                .append('path');

            lineChart.selectAll('.line').datum(linearData)
                .attr("fill", "none")
                .attr("stroke", colorScale(selectedCountryRegion))
                .attr("stroke-width", 5)
                .attr("d", d3.line()
                    .x(d => x(d.year))
                    .y(d => y(d.value))
                );
        }
        return;
    }

    updateBar();
    updateScatterPlot();
    updateLinear();
});


async function loadData() {
    const data = {
        'population': await d3.csv('data/population.csv'),
        'gdp': await d3.csv('data/gdp.csv'),
        'child-mortality': await d3.csv('data/cmu5.csv'),
        'life-expectancy': await d3.csv('data/life_expectancy.csv'),
        'fertility-rate': await d3.csv('data/fertility-rate.csv')
    };

    return data.population.map(d => {
        const index = data.gdp.findIndex(item => item.geo == d.geo);
        return {
            country: d.country,
            geo: d.geo,
            region: d.region,
            population: d,
            'gdp': data['gdp'][index],
            'child-mortality': data['child-mortality'][index],
            'life-expectancy': data['life-expectancy'][index],
            'fertility-rate': data['fertility-rate'][index]
        }
    })
}
