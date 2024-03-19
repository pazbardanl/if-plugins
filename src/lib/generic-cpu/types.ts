export type PowerCurveLookup = {
  readonly name: string;
  readonly keyNameToSeries: Map<string, number[]>; // matches a lookup key name to a data series
  readonly valueName: string; // name of the value name
  readonly valueSeries: number[]; // data series for the value name.
};
