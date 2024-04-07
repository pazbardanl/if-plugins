import {DataTable} from '../../../../../lib/generic-cpu/models/data-table';

describe('lib/generic-cpu/models:', () => {
  describe('DataTable', () => {
    describe('init: ', () => {
      it('valid input data.', () => {
        const inputData = [
          ['id', 'grade', 'age'],
          ['6565464', '89', '12'],
          ['1230985', '91', '11'],
          ['1237899', '100', '12'],
        ];
        const dataTable = new DataTable(inputData);
        expect(dataTable.getSize()).toEqual(3);
        expect(dataTable.getColumnData('id')).toEqual([
          6565464, 1230985, 1237899,
        ]);
        expect(dataTable.getColumnData('grade')).toEqual([89, 91, 100]);
        expect(dataTable.getColumnData('age')).toEqual([12, 11, 12]);
      });
      it('missing header.', () => {
        const inputData = [
          ['id', '', 'age'],
          ['6565464', '89', '12'],
          ['1230985', '91', '11'],
          ['1237899', '100', '12'],
        ];
        const constructorCall = () => new DataTable(inputData);
        expect(constructorCall).toThrow(Error);
      });
      it('missing value.', () => {
        const inputData = [
          ['id', 'grade', 'age'],
          ['6565464', '', '12'],
          ['1230985', '91', '11'],
          ['1237899', '100', '12'],
        ];
        const constructorCall = () => new DataTable(inputData);
        expect(constructorCall).toThrow(Error);
      });
      it('invalid value (NaN).', () => {
        const inputData = [
          ['id', 'grade', 'age'],
          ['6565464', '89', '12'],
          ['1230985', 'qewrwrt', '11'],
          ['1237899', '100', '12'],
        ];
        const constructorCall = () => new DataTable(inputData);
        expect(constructorCall).toThrow(Error);
      });
    });
  });
});
