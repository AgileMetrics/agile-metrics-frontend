import {PercentilesDto} from "./percentiles.dto";

export class CycleTimeDto {
  cycleTimes: Array<any>;
  percentiles: PercentilesDto;

  constructor(cycleTimes: Array<any>,
              percentiles: PercentilesDto) {
    this.cycleTimes = cycleTimes;
    this.percentiles = percentiles;
  }

}
