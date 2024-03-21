import {PowerCurveInterpolatorInterface} from '../interfaces/power-curve-interpolator-interface';
import {ERRORS} from '../../../util/errors';
import {PowerCurveLookup} from '../types';

const {InputValidationError, ConfigValidationError} = ERRORS;

export class PowerCurveLookupLinearInterpolator
  implements PowerCurveInterpolatorInterface
{
  interpolate(
    powerCurveLookup: PowerCurveLookup,
    keyNameToLookupValue: Map<string, number>
  ): number[] {
    var lookupKeys: string[] = [...keyNameToLookupValue.keys()];
    if (lookupKeys.length > 1) {
      throw new InputValidationError(
        'Interpolation of >1 lookup values is not supported'
      );
    }
    const lookupKeyName = lookupKeys[0];
    const lookupValue = keyNameToLookupValue.get(lookupKeyName);

    if (lookupValue === undefined) {
      throw new ConfigValidationError(
        `Key name '${lookupKeyName}' not found in the provided keyNameToLookupValue`
      );
    }

    // Get the series corresponding to the given lookupKeyName
    const series = powerCurveLookup.keyNameToSeries.get(lookupKeyName);

    if (!series) {
      throw new InputValidationError(
        `Key name '${lookupKeyName}' not found in the provided PowerCurveLookup`
      );
    }

    let x0: number;
    let x1: number;
    let y0: number;
    let y1: number;

    if (lookupValue > series[series.length - 1]) {
      return [powerCurveLookup.valueSeries[series.length - 1]];
    } else if (lookupValue < series[0]) {
      x0 = 0;
      x1 = series[0];
      y0 = 0;
      y1 = powerCurveLookup.valueSeries[0];
    } else {
      let index = 0;
      while (index < series.length - 1) {
        if (series[index] < lookupValue && lookupValue < series[index + 1]) {
          break;
        }
        index = index + 1;
      }
      // TODO PB -- this check is redundant considering the logic at the "else-if" block, need to remove it an write a unit test to cover this case.
      if (index === series.length - 1) {
        return [powerCurveLookup.valueSeries[index]];
      }
      x0 = series[index];
      x1 = series[index + 1];
      y0 = powerCurveLookup.valueSeries[index];
      y1 = powerCurveLookup.valueSeries[index + 1];
    }

    // TODO PB -- debug console
    console.log('lookupValue = ' + lookupValue);
    console.log('x0 = ' + x0);
    console.log('x1 = ' + x1);
    console.log('y0 = ' + y0);
    console.log('y1 = ' + y1);
    const interpolatedValue = y0 + ((lookupValue - x0) / (x1 - x0)) * (y1 - y0);

    return [interpolatedValue];
  }
}
