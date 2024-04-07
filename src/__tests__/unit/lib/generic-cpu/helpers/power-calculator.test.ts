import {CsvDirectoryReader} from '../../../../../lib/generic-cpu/helpers/csv-directory-reader';
import {LinearInterpolator} from '../../../../../lib/generic-cpu/helpers/linear-interpolator';
import {PowerCalculator} from '../../../../../lib/generic-cpu/helpers/power-calculator';

describe('lib/generic-cpu/helpers:', () => {
  describe('CsvDirectoryReader', () => {
    describe('sanity: ', () => {
      const powerCalculator: PowerCalculator = new PowerCalculator(
        ['prod1', 'prod2'],
        new CsvDirectoryReader(__dirname + '/test-data/'),
        new LinearInterpolator()
      );
      it('calculate', () => {
        expect(powerCalculator.calculate(15, 'prod1')).toEqual(95);
      });
      it('simulate', () => {
        expect(powerCalculator.simulate(15, 'prod1', 'prod2')).toEqual(110);
      });
      it('calculate processor not found', () => {
        const calculateCall = () => powerCalculator.calculate(15, 'prodX');
        expect(calculateCall).toThrow(Error);
      });
      it('simulate physical processor not found', () => {
        const simulateCall = () =>
          powerCalculator.simulate(15, 'prodX', 'prod2');
        expect(simulateCall).toThrow(Error);
      });
      it('simulate simualted processor not found', () => {
        const simulateCall = () =>
          powerCalculator.simulate(15, 'prod1', 'prodX');
        expect(simulateCall).toThrow(Error);
      });
    });
  });
});
