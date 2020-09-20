import { Component, OnInit, OnDestroy} from '@angular/core';
import CycleTimeService from '../service/cycletime.service';
import * as Highcharts from 'highcharts';

@Component({
    selector: 'app-cycletime-component',
    templateUrl: './cycletime.component.html',
    styleUrls: ['./cycletime.component.css']
})
export class CycleTimeComponent implements OnInit, OnDestroy {

    constructor(private cycleTimeService: CycleTimeService) {
        console.log('construct highchart component');
    }
    ngOnInit() {
        console.log('init highchart component');
        this.cycleTimeService.getCycleTimeForScatterPlot().subscribe((scatterData: Array<any>) => {
            this.scatterChart(scatterData);
        });
    }
    scatterChart(scatterData: Array<any>) {
        Highcharts.chart('scatter-container', {
            chart: {
                type: 'scatter',
                zoomType: 'xy'
            },
            title: {
                text: 'Cycle Time Scatterplot'
            },
            xAxis: {
                title: {
                    text: 'Completion Date',
                },
                showFirstLabel: true,
                showLastLabel: true,
                startOnTick: true,
                endOnTick: true,
                type: 'datetime',
                dateTimeLabelFormats: {
                    day: '%e-%b-%y',
                    month: '%b-%y'
                }
            },
            yAxis: {
                title: {
                    text: 'Days',

                }
            },
            series: [
                {
                    type: 'scatter',
                    name: 'Cycle Time',
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
                            const dateFormatted = Highcharts.dateFormat('%d-%m-%Y', this.x);
                            return `Completion Date: ${dateFormatted} <br> Cycle Time: ${this.y} days`;
                        }
                    }

                }
            },
        }, null);

    }
    ngOnDestroy() {
        console.log('destroy highchart component');
    }
}
