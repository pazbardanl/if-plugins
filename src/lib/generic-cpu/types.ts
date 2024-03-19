export type PowerCurveLookup = {
  readonly name: string;
  readonly keyNames: string[];
  readonly valueName: string;
  readonly lookupData: {[key: string]: number};
};
