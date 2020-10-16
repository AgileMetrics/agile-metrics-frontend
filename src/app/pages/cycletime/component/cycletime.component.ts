import {Component, OnDestroy, OnInit} from '@angular/core';

import {CycleTimeDto} from './cycletime.dto';
import CycleTimeService from '../service/cycletime.service';
import {PercentilesDto} from './percentiles.dto';
import PercentilesService from '../service/percentiles.service';

import * as Highcharts from 'highcharts';
import {forkJoin} from 'rxjs';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-cycletime-component',
  templateUrl: './cycletime.component.html',
  styleUrls: ['./cycletime.component.css']
})
export class CycleTimeComponent implements OnInit, OnDestroy {

  constructor(private cycleTimeService: CycleTimeService,
              private percentilesService: PercentilesService) {
    console.log('construct highchart component');
  }

  ngOnInit() {
    console.log('init highchart component');
    const observables = [
      this.cycleTimeService.getCycleTimeForScatterPlot(),
      this.percentilesService.getPercentiles()
    ];

    forkJoin(observables)
      .pipe(
        map(([cycleTimes, percentiles]) => {
          return new CycleTimeDto(cycleTimes as Array<any>, percentiles as PercentilesDto);
        })
      ).subscribe(
      (scatterData: CycleTimeDto) => this.printCycleTimeScatterplot(scatterData)
    );

  }

  private printCycleTimeScatterplot(scatterData: CycleTimeDto) {
    Highcharts.chart('scatter-container', {
      chart: {
        type: 'scatter',
        height: (7 / 16 * 100) + '%', // 16:7 ratio
        zoomType: 'xy'
      },
      title: {
        text: ''
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
          text: 'Days'
        },
        labels: {
          format: '{value} days'
        },
        plotLines: [{
          color: '#2EC74E',
          dashStyle: 'Dot',
          width: 2,
          value: scatterData.percentiles.percentile70InDays,
          label: {
            align: 'right',
            style: {
              color: '#2EC74E',
              fontWeight: 'bold'
            },
            text: '70% Percentile: ' + scatterData.percentiles.percentile70InDays + ' days',
            x: -5
          },
          zIndex: 3
        },
          {
            color: '#3DA954',
            dashStyle: 'Dot',
            width: 2,
            value: scatterData.percentiles.percentile85InDays,
            label: {
              align: 'right',
              style: {
                color: '#3DA954',
                fontWeight: 'bold'
              },
              text: '85% Percentile: ' + scatterData.percentiles.percentile85InDays + ' days',
              x: -5
            },
            zIndex: 3
          }
        ]
      },
      series: [
        {
          type: 'scatter',
          name: 'Cycle Time',
          color: 'rgba(40, 40, 255, .6)',
          data: scatterData.cycleTimes
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
