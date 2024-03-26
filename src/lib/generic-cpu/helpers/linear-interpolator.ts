import {ERRORS} from '../../../util/errors';
const {InputValidationError} = ERRORS;

export class LinearInterpolator {
  interpolate(
    lookupKey: number,
    lookupSeries: number[],
    valueSeries: number[]
  ): number {
    this.validatePositiveNumbers([lookupKey], 'lookupKey');
    this.validatePositiveNumbers(lookupSeries, 'lookupSeries');
    this.validatePositiveNumbers(valueSeries, 'valueSeries');
    let x0: number;
    let x1: number;
    let y0: number;
    let y1: number;
    if (lookupKey > lookupSeries[lookupSeries.length - 1]) {
      return valueSeries[valueSeries.length - 1];
    } else if (lookupKey < lookupSeries[0]) {
      x0 = 0;
      x1 = lookupSeries[0];
      y0 = 0;
      y1 = valueSeries[0];
    } else {
      const [leftIndex, rightIndex] = this.findBoundaryIndexes(
        lookupKey,
        lookupSeries
      );
      x0 = lookupSeries[leftIndex];
      x1 = lookupSeries[rightIndex];
      y0 = valueSeries[leftIndex];
      y1 = valueSeries[rightIndex];
    }
    const interpolatedValue = y0 + (lookupKey - x0) * ((y1 - y0) / (x1 - x0));
    return interpolatedValue;
  }

  private findBoundaryIndexes(
    lookupValue: number,
    lookupSeries: number[]
  ): [number, number] {
    for (let i = 0; i < lookupSeries.length - 1; i++) {
      if (lookupValue >= lookupSeries[i] && lookupValue < lookupSeries[i + 1]) {
        return [i, i + 1];
      }
    }
    throw new InputValidationError(
      `Failed to find boundary indexes for ${lookupValue} in ${lookupSeries}`
    );
  }

  private validatePositiveNumbers(numbersArray: number[], arrayName: string) {
    if (numbersArray.some(num => num < 0)) {
      throw new InputValidationError(
        `${arrayName} contains negative value(s): ${numbersArray}`
      );
    }
  }
}
