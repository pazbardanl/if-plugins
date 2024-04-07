import {CsvDirectoryReader} from '../../../../../lib/generic-cpu/helpers/csv-directory-reader';

describe('lib/generic-cpu/helpers:', () => {
  describe('CsvDirectoryReader', () => {
    describe('init: ', () => {
      it('valid', () => {
        const csvDirectoryReader: CsvDirectoryReader = new CsvDirectoryReader(
          __dirname + '/test-data/'
        );
        const expected1 = {
          simple1: [
            ['CPU_perc', 'Throughput_reqPerSec', 'POWER_W'],
            ['0', '0', '70'],
            ['10', '600000', '90'],
            ['20', '800000', '100'],
          ],
        };
        const expected2 = {
          simple2: [
            ['CPU_perc', 'Throughput_reqPerSec', 'POWER_W'],
            ['0', '0', '90'],
            ['10', '700000', '100'],
            ['20', '900000', '110'],
          ],
        };
        expect(csvDirectoryReader.read(['simple1'])).toEqual(expected1);
        expect(csvDirectoryReader.read(['simple2'])).toEqual(expected2);
      });
    });
  });
});
