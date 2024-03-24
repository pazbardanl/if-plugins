import {LinearInterpolator} from '../../../lib/generic-cpu/helpers/linear-interpolator';

describe('lib/generic-cpu/helpers:', () => {
  describe('LinearInterpolator', () => {
    describe('sanity: ', () => {
      const linearnterpolator: LinearInterpolator = new LinearInterpolator();
      const lookupSeries = [10, 20, 40, 100];
      const valueSeries = [1000, 2000, 4000, 10000];
      it('out of range low', () => {
        expect(
          linearnterpolator.interpolate(5, lookupSeries, valueSeries)
        ).toEqual(500);
      });
      it('out of range high', () => {
        expect(
          linearnterpolator.interpolate(150, lookupSeries, valueSeries)
        ).toEqual(10000);
      });
      it('no interpolation needed', () => {
        expect(
          linearnterpolator.interpolate(40, lookupSeries, valueSeries)
        ).toEqual(4000);
      });
      it('interpolation', () => {
        expect(
          linearnterpolator.interpolate(50, lookupSeries, valueSeries)
        ).toEqual(5000);
      });
      it('interpolation with percision', () => {
        expect(
          linearnterpolator.interpolate(20.01, lookupSeries, valueSeries)
        ).toBeCloseTo(2001);
      });
    });
  });
});
