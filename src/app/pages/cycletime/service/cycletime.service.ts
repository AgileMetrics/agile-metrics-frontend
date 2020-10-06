import {Injectable} from '@angular/core';

import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {of} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export default class CycleTimeService {

  SERVER_URL = 'http://localhost:8080/api/v1/cycle-time-scatterplot';

  private static handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(`Backend returned code ${error.status} body was: ${error.error}`);
    }
    // return a default value
    return of([]);
  }

  constructor(private httpClient: HttpClient) {
  }

  public getCycleTimeForScatterPlot() {
    return this.httpClient.get(this.SERVER_URL)
      .pipe(map((cycleTimeArray: Array<any>) => this.transformCycleTimeToScatterPlotItem(cycleTimeArray)),
        catchError(CycleTimeService.handleError));
  }

  private transformCycleTimeToScatterPlotItem(cycleTimeArray: Array<any>): Array<any> {
    return cycleTimeArray.map(cycleTimeItem => {
      const completionDate: moment.Moment = moment.utc(cycleTimeItem.completionDate, 'YYYY-MM-DD');
      return [completionDate.valueOf(), cycleTimeItem.cycleTimeInDays];
    });
  }

}
