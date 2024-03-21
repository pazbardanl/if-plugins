import { PowerCurveLookup } from "../types";

export interface PowerCurveInterpolatorInterface {
  interpolate(powerCurveLookup: PowerCurveLookup, keyNameToLookupValue: Map<string, number>): number[];
}
