import {GenericCPU} from '../../../../lib';

describe('lib/generic-cpu/index: ', () => {
  describe('sanity: ', () => {
    it('sanity', () => {
      const genericCpu = GenericCPU({
        'root-dir-path': __dirname,
        'physical-cpu': 'testLookup1',
      });
      genericCpu.execute([
        {
          duration: 3600,
          'cpu/energy': 2,
          'network/energy': 2,
          'memory/energy': 2,
          timestamp: '2021-01-01T00:00:00Z',
        },
      ]);
    });
  });
});
