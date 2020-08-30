export class PercentilesDto {
  percentile50InDays: number;
  percentile70InDays: number;
  percentile85InDays: number;
  percentile95InDays: number;

  constructor(percentile50InDays: number,
              percentile70InDays: number,
              percentile85InDays: number,
              percentile95InDays: number) {

    this.percentile50InDays = percentile50InDays;
    this.percentile70InDays = percentile70InDays;
    this.percentile85InDays = percentile85InDays;
    this.percentile95InDays = percentile95InDays;
  }

}
