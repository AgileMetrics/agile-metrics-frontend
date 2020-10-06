import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {PercentilesDto} from '../component/percentiles.dto';

@Injectable({
    providedIn: 'root'
})
export default class PercentilesService {

    SERVER_URL = 'http://localhost:8080/api/v1/percentiles';

    constructor(private httpClient: HttpClient) { }

    public getPercentiles(): Observable<PercentilesDto> {
        return this.httpClient.get(this.SERVER_URL)
            .pipe(
              map((percentiles: any) => this.buildPercentilesDto(percentiles)),
              catchError(this.handleError)
            );
    }

    private buildPercentilesDto(percentiles: any): PercentilesDto {
      return new PercentilesDto(
        percentiles.percentile50InDays,
        percentiles.percentile70InDays,
        percentiles.percentile85InDays,
        percentiles.percentile95InDays
      );
    }

    private handleError(error: HttpErrorResponse): Observable<PercentilesDto> {
        if (error.error instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.
            console.error('An error occurred:', error.error.message);
        } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            console.error(`Backend returned code ${error.status} body was: ${error.error}`);
        }
        // return a default value
        return of(new PercentilesDto(0, 0, 0, 0));
    }
}
