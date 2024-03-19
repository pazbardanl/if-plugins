import path = require('path');
import {CsvReader} from '../../../../../lib/generic-cpu/helpers/CsvReader';

describe('lib/generic-cpu/helpers/CsvReader: ', () => {
  describe('read csv: ', () => {
    it('read lookup csv.', async () => {
      const testFilePath = __filename; // Absolute path of the current test file
      const inputFileRelativePath = 'testLookup.csv'; // Relative path of the input file
      const absoluteInputFilePath = path.resolve(
        path.dirname(testFilePath),
        inputFileRelativePath
      );
      const csvReader = CsvReader(absoluteInputFilePath);
      const actualString: string = await csvReader.read();
      const expectedString =
        'CPU_perc,Throuput_reqPerSec,POWER_W\n10,100000,0.002\n30,300000,0.020\n50,450000,0.032\n70,550000,0.040\n100,600000,0.044';
      expect(actualString).toContain(expectedString);
    });
  });
});
