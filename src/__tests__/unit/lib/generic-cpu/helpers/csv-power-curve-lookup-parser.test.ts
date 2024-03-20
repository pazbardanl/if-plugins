import {CsvPowerCurveLookupParser} from '../../../../../lib/generic-cpu/helpers/csv-power-curve-lookup-parser';
import {PowerCurveLookup} from '../../../../../lib/generic-cpu/types';

describe('lib/generic-cpu/helpers/csv-power-curve-lookup-parser: ', () => {
  describe('sanity: ', () => {
    it('sanity', () => {
      const csvPowerCurveLookupParser = new CsvPowerCurveLookupParser();
      const expected: PowerCurveLookup = {
        name: 'testPowerCurveLookup',
        keyNameToSeries: new Map<string, number[]>([
          ['key1', [1, 2, 3]],
          ['key2', [4, 5, 6]],
        ]),
        valueName: 'ValueName',
        valueSeries: [10, 20, 30],
      };

      const actual = csvPowerCurveLookupParser.fromString(
        'key1,key2,ValueName\n1,4,10\n2,5,20\n3,6,30\n',
        'testPowerCurveLookup'
      );
      expect(actual).toEqual(expected);
    });
  });
});
