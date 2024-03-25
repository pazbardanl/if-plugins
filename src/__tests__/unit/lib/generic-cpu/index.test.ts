import {GenericCPU} from '../../../../lib';
import {PluginParams} from '../../../../types/common';

describe('lib/generic-cpu/helpers:', () => {
  describe('CsvDirectoryReader', () => {
    describe('sanity: ', () => {
      it('calculate-no-interpolation', async () => {
        const globalConfig = {
          'power-curves-root-dir': __dirname + '/helpers/test-data/',
          'physical-processor': 'prod1',
        };
        const inputs: PluginParams[] = [
          {
            duration: 1,
            'cpu/utilization': 20,
            timestamp: '2021-01-01T00:00:00Z',
          },
          {
            duration: 1,
            'cpu/utilization': 30,
            timestamp: '2021-01-01T00:00:01Z',
          },
          {
            duration: 1,
            'cpu/utilization': 90,
            timestamp: '2021-01-01T00:00:02Z',
          },
        ];
        const expected: PluginParams[] = [
          {
            duration: 1,
            'cpu/utilization': 20, // => 100 W
            timestamp: '2021-01-01T00:00:00Z',
            'cpu/energy': 0.000027777777777777776, // (100 * 1/3600) / 1000
          },
          {
            duration: 1,
            'cpu/utilization': 30, // => 120 W
            timestamp: '2021-01-01T00:00:01Z',
            'cpu/energy': 0.000033333333333333335, // (120 * 1/3600) / 1000
          },
          {
            duration: 1,
            'cpu/utilization': 90, // => 180 W
            timestamp: '2021-01-01T00:00:02Z',
            'cpu/energy': 0.00005, // (120 * 1/3600) / 1000
          },
        ];
        const genericCpu = GenericCPU(globalConfig);
        const actual = await genericCpu.execute(inputs);
        expect(actual).toEqual(expected);
      });

      it('calculate-with-interpolation', async () => {
        const globalConfig = {
          'power-curves-root-dir': __dirname + '/helpers/test-data/',
          'physical-processor': 'prod1',
        };
        const inputs: PluginParams[] = [
          {
            duration: 1,
            'cpu/utilization': 15,
            timestamp: '2021-01-01T00:00:00Z',
          },
          {
            duration: 1,
            'cpu/utilization': 24,
            timestamp: '2021-01-01T00:00:01Z',
          },
          {
            duration: 1,
            'cpu/utilization': 61,
            timestamp: '2021-01-01T00:00:02Z',
          },
        ];
        const expected: PluginParams[] = [
          {
            duration: 1,
            'cpu/utilization': 15, // => 95 W
            timestamp: '2021-01-01T00:00:00Z',
            'cpu/energy': 0.00002638888888888889, // (95 * 1/3600) / 1000
          },
          {
            duration: 1,
            'cpu/utilization': 24, // => 108 W
            timestamp: '2021-01-01T00:00:01Z',
            'cpu/energy': 0.000029999999999999997, // (108 * 1/3600) / 1000
          },
          {
            duration: 1,
            'cpu/utilization': 61, // => 171 W
            timestamp: '2021-01-01T00:00:02Z',
            'cpu/energy': 0.0000475, // (171 * 1/3600) / 1000
          },
        ];
        const genericCpu = GenericCPU(globalConfig);
        const actual = await genericCpu.execute(inputs);
        expect(actual).toEqual(expected);
      });
      it('simulate-with-interpolation', async () => {
        const globalConfig = {
          'power-curves-root-dir': __dirname + '/helpers/test-data/',
          'physical-processor': 'prod1',
          'simulated-processor': 'prod2',
        };
        const inputs: PluginParams[] = [
          {
            duration: 1,
            'cpu/utilization': 20,
            timestamp: '2021-01-01T00:00:00Z',
          },
          {
            duration: 1,
            'cpu/utilization': 55,
            timestamp: '2021-01-01T00:00:01Z',
          },
          {
            duration: 1,
            'cpu/utilization': 61,
            timestamp: '2021-01-01T00:00:02Z',
          },
        ];
        const expected: PluginParams[] = [
          {
            duration: 1,
            'cpu/utilization': 20, // => 800000 req/sec => 22% => 114 W
            timestamp: '2021-01-01T00:00:00Z',
            'cpu/energy': 0.000031666666666666666, // (114 * 1/3600) / 1000
          },
          {
            duration: 1,
            'cpu/utilization': 55, // => 2000000 req/sec => 52.5% => 172.5 W
            timestamp: '2021-01-01T00:00:01Z',
            'cpu/energy': 0.00004791666666666667, // (172.5 * 1/3600) / 1000
          },
          {
            duration: 1,
            'cpu/utilization': 61, // => 2230000 req/sec => 58.25% => 178.25 W
            timestamp: '2021-01-01T00:00:02Z',
            'cpu/energy': 0.00004951388888888889, // (178.25 * 1/3600) / 1000
          },
        ];
        const genericCpu = GenericCPU(globalConfig);
        const actual = await genericCpu.execute(inputs);
        expect(actual).toEqual(expected);
      });
    });
  });
});
