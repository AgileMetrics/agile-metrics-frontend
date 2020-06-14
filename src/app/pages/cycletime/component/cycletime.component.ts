
import { Component, OnInit, OnDestroy, Injectable } from '@angular/core';
import CycleTimeService from '../service/cycletime.service'
import * as Highcharts from 'highcharts';

@Component({
    selector: 'cycletime-component',
    templateUrl: './cycletime.component.html',
    styleUrls: ['./cycletime.component.css']
})
export class CycleTimeComponent implements OnInit, OnDestroy {

    constructor(private cycleTimeService: CycleTimeService) {
        console.log("construct highchart component")
    }
    ngOnInit() {
        console.log("init highchart component")
        this.cycleTimeService.getCycleTimeForScatterPlot().subscribe((scatterData: Array<any>) => {
            //const scatterData = [[Date.UTC(2010, 1, 1), 3], [Date.UTC(2010, 1, 1), 3], [Date.UTC(2010, 1, 10), 10], [Date.UTC(2010, 1, 6), 12]]
            this.scatterChart(scatterData)
        })
    }
    scatterChart(scatterData: Array<any>) {
        Highcharts.chart('scatter-container', {
            chart: {
                type: 'scatter',
                zoomType: 'xy'
            },
            title: {
                text: 'Scatter plot example'
            },
            xAxis: {
                title: {
                    text: "Date",
                },
                showFirstLabel: true,
                showLastLabel: true,
                startOnTick: true,
                endOnTick: true,
                type: 'datetime',
                dateTimeLabelFormats: {
                    day: "%e-%b-%y",
                    month: "%b-%y"
                }
            },
            yAxis: {
                title: {
                    text: 'Days',

                }
            },
            series: [
                {
                    type: "scatter",
                    name: "Cycle time",
                    color: 'rgba(40, 40, 255, .6)',
                    data: scatterData
                }
            ],
            plotOptions: {
                scatter: {
                    marker: {
                        radius: 6,
                        states: {
                            hover: {
                                enabled: true,
                                lineColor: 'rgb(100,100,100)'
                            }
                        }
                    },
                    tooltip: {
                        headerFormat: '<b>{series.name}</b><br>',

                        pointFormatter() {
                            const dateFormatted = Highcharts.dateFormat('%d-%m-%Y', this.x)
                            return `Done Date: ${dateFormatted} <br> Cycle Time: ${this.y} days`
                        }
                    }

                }
            },
        }, null)

    }
    ngOnDestroy() {
        console.log("destroy highchart component")
    }
}

