import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, retry, map } from 'rxjs/operators';
import * as moment from 'moment'

@Injectable({
    providedIn: 'root'
})
export default class CycleTimeService {

    SERVER_URL: string = "http://localhost:8080/api/v1/cycle-time-scatterplot";

    constructor(private httpClient: HttpClient) { }

    public getCycleTimeForScatterPlot() {
        return this.httpClient.get(this.SERVER_URL)
            .pipe(map((cicleTimeArray: Array<any>) => this.transformCycleTimeToScatterPlotItem(cicleTimeArray)),
                catchError(this.handleError))
    }

    private transformCycleTimeToScatterPlotItem(cicleTimeArray: Array<any>): Array<any> {
        return cicleTimeArray.map(cicleTimeItem => {
            const starDate: moment.Moment = moment.utc(cicleTimeItem.startDate, 'YYYY-MM-DD')
            const endDate: moment.Moment = moment.utc(cicleTimeItem.endDate, 'YYYY-MM-DD')
            const cycleTimeDays = endDate.diff(starDate, 'days')
            return [endDate.valueOf(), cycleTimeDays]
        })
    }

    private handleError(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.
            console.error('An error occurred:', error.error.message);
        } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            console.error(`Backend returned code ${error.status} body was: ${error.error}`);
        }
        // return a default value
        return of([])
    }
}