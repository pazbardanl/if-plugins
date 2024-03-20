import {PowerCurveLookup} from '../types';

export interface PowerCurveLookupParserInterface {
  fromString(stringData: string): PowerCurveLookup;
}
