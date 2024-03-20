import {CsvDirectoryReader} from '../../../../../lib/generic-cpu/helpers/csv-directory-reader';

describe('lib/generic-cpu/helpers/csv-directory-reader: ', () => {
  describe('sanity: ', () => {
    it('sanity', () => {
      const csvReaderUnderTest: CsvDirectoryReader = new CsvDirectoryReader(
        __dirname
      );
      const actualMap = csvReaderUnderTest.read();
      expect(actualMap.get('testLookup1')).toEqual(
        'CPU_perc,Throuput_reqPerSec,POWER_W\n10,100000,0.002\n30,300000,0.020\n50,450000,0.029\n70,520000,0.033\n90,550000,0.035\n100,560000,0.035'
      );
      expect(actualMap.get('testLookup2')).toEqual(
        'CPU_perc,POWER_W\n10,0.002\n30,0.020\n50,0.032\n70,0.040\n100,0.044'
      );
    });
  });
});
