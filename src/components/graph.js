/**
 * displays a timeline of temperatures in a line graph
 */

import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';

import { connect } from 'react-redux';

// decides on whether to display hourly (of the current day), or daily data
const FILTERS = {
    HOURLY: 'HOURLY',
    DAILY: 'DAILY'
};

class Graph extends Component {

    constructor(props) {
        super(props);
        this.state = {
            temps: [],
            graph: {
                datasets: [],
                labels: []
            },
            filter: FILTERS.DAILY,
            // checks if the window has been resized to decide on whether to update the graoh's state or not
            windowResized: false
        }
    }

    componentDidMount() {
        window.addEventListener('resize', () => this.setState({ windowResized: true }));

        // check if the tempretures has been fetched
        if (this.props.temps && this.props.temps.length !== undefined) {
            this.groupTempsByDate();
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        // check if the temperature or the location have been updated
        if ((prevProps.temps === undefined && this.props.temps.length !== undefined) || (this.props.city !== prevProps.city) ||
            (prevProps.temps.length !== this.props.temps.length)) {
            this.groupTempsByDate();
        }

        // check if the temperatures or filter have been updated
        if (this.state.temps !== prevState.temps || prevState.filter !== this.state.filter) {
            // check if the filter is set to hourly
            if (this.state.filter === FILTERS.HOURLY) {
                // update the state to display hourly data
                this.displayHourlyData();
            } else {
                // otherwise update the state to display daily data
                this.displayDailyData();
            }
        }
    }

    /**
     * gets the max, and min temperatures of each day
     */
    groupTempsByDate() {
        const groupedTemps = [];

        for (let i = 0; i < this.props.temps.length; i++) {
            // always add the first element
            if (i === 0) {
                groupedTemps.push(this.props.temps[i]);
                continue;
            }

            // get the current and previous array values
            const currentItem = this.props.temps[i];
            const prevItem = this.props.temps[i - 1];
            const currentItemDate = new Date(this.props.temps[i].datetime);
            const prevItemDate = new Date(this.props.temps[i - 1].datetime);

            // check if the dates are different
            if (currentItemDate.getDate() !== prevItemDate.getDate()) {
                // add a new value to the list
                groupedTemps.push(this.props.temps[i]);
            } else {
                // otherwise compare the max temperature of the current value with the max and min 
                // temperatures of the previous value, and update the last item in the list accordingly
                const tempsSize = groupedTemps.length;

                if (currentItem.minTemp < prevItem.minTemp) {
                    groupedTemps[tempsSize - 1].minTemp = currentItem.minTemp;
                }

                if (currentItem.maxTemp > prevItem.maxTemp) {
                    groupedTemps[tempsSize - 1].maxTemp = currentItem.maxTemp;
                }
            }
        }

        this.setState({ temps: groupedTemps });
    }

    /**
     * displays maximum daily temperatures
     */
    displayDailyData() {
        // check if the temps array has been initialized properly
        if (!this.state.temps[0]) {
            return;
        }

        const data = [];
        const labels = [];

        // set the labels as the daytime value of each item, and the points on the graph as the max temperatures of each day
        for (const item of this.state.temps) {
            const datetime = new Date(item.datetime);
            labels.push(datetime.toLocaleString('en-US', { day: '2-digit', weekday: 'short' }));
            data.push(item.maxTemp);
        }

        // update the state of the graph
        this.setState({
            graph: {
                datasets: [{
                    data,
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderWidth: 5,
                    fill: false
                }], labels
            }
        });
    }

    /**
     * displays the maximum hourly temperatures
     */
    displayHourlyData() {
        // check if the temps array has been initialized properly
        if (!this.state.temps[0]) {
            return;
        }

        const data = [];
        const labels = [];
        // get today's and tomorrow's dates
        const today = new Date(Date.now());

        for (const item of this.props.temps) {
            // get the datetime of the current item
            const datetime = new Date(item.datetime);

            // check if the datetime is equal to today's datetime
            if (today.getDay() === datetime.getDay()
                && today.getMonth() === datetime.getMonth()
                && today.getFullYear() === datetime.getFullYear()) {
                labels.push(datetime.toLocaleString('en-US', { hour: '2-digit', minute: '2-digit' }));
                // add it to the data list
                data.push(item.maxTemp);
            } else if (today.getDay() < datetime.getDay()
                && today.getMonth() < datetime.getMonth()
                && today.getFullYear() < datetime.getFullYear()) {
                // otherwise break out of the loop if we reach tomorrow's data
                break;
            }
        }

        // update the graph's state
        this.setState({
            graph: {
                datasets: [{
                    data,
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderWidth: 5,
                    fill: false
                }], labels
            }
        });
    }

    render() {
        return (
            <div className='graph-container'>

                {/* the graph's filters */}
                <div className='filters'>
                    <p className={this.state.filter === FILTERS.DAILY ? 'active' : ''}
                        onClick={() => { this.state.filter !== FILTERS.DAILY && this.setState({ filter: FILTERS.DAILY }) }}>
                        6 Days
                    </p>

                    {/* vertical line separating the filter items */}
                    <p className='separator'>|</p>

                    <p className={this.state.filter === FILTERS.HOURLY ? 'active' : ''}
                        onClick={() => { this.state.filter !== FILTERS.HOURLY && this.setState({ filter: FILTERS.HOURLY }) }}>
                        Today
                    </p>
                </div>

                { //only display the graph if there is data to plot
                    this.state.graph.datasets.length > 0 &&
                    <div className='chart-container'>
                        <Line data={this.state.graph}
                            id='chart'
                            plugins={[{
                                // check when the graph updates
                                afterUpdate: (chart) => {
                                    // get the pixel value of the zero point in the graph
                                    const yScale = chart.scales['y-axis-0'];
                                    const zero = yScale.getPixelForValue(0);

                                    // get the top and bottom points of the graph
                                    const ctx = document.getElementById('chart').getContext("2d");
                                    const top = ctx.canvas.clientTop;
                                    const bottom = ctx.canvas.clientTop + ctx.canvas.clientHeight;
                                    // create a gradient from the top to the bottom of the graph
                                    const gradient = ctx.createLinearGradient(0, top, 0, bottom);

                                    // set a threshold for the gradient, so that the line color would be red if the temperature is >= 0, 
                                    // or blue if the temperature is < 0
                                    const ratio = Math.min((zero - top) / (bottom - top), 1);
                                    gradient.addColorStop(0, '#ff7d7d');
                                    gradient.addColorStop(Math.abs(ratio), '#ff7d7d');
                                    gradient.addColorStop(Math.abs(ratio), '#6b7cfa');
                                    gradient.addColorStop(1, '#6b7cfa');

                                    // only update the state if the gradient color has not been specified before or if the window has been resized
                                    if (this.state.graph.datasets[0].borderColor === undefined || this.state.windowResized) {
                                        const graph = { ...this.state.graph };
                                        graph.datasets[0].borderColor = gradient;
                                        this.setState({
                                            graph,
                                            windowResized: false
                                        });
                                    }
                                }
                            }]}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                scales: {
                                    yAxes: [
                                        {
                                            ticks: {
                                                beginAtZero: true
                                            },
                                        },
                                    ],
                                },
                                legend: {
                                    display: false
                                }
                            }} />
                    </div>
                }
            </div>
        )
    }
}

function mapStateToProps(state) {
    return state.searchedWeather;
}

export default connect(mapStateToProps)(Graph);