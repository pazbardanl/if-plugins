import {EMemModel} from '../../../../lib';
import {ENetModel} from '../../../../lib';
//import { ERRORS } from '../../../../util/errors';
//const { InputValidationError } = ERRORS;

jest.setTimeout(30000);

describe('lib/e-mem: ', () => {
  describe('init: ', () => {
    it('initalizes object with properties.', async () => {
      const eNetModel = await new ENetModel();
      expect(eNetModel).toHaveProperty('configure');
      expect(eNetModel).toHaveProperty('execute');
    });
  });

  describe('configure(): ', () => {
    it('configures model instance with given params.', async () => {
      const params = {};
      const model = await new ENetModel().configure(params);
      expect(model).toBeInstanceOf(ENetModel);
    });
    it('configures model instance with given params.', async () => {
      const model = await new ENetModel().configure();
      expect(model).toBeInstanceOf(ENetModel);
    });
  });

  describe('configure(): ', () => {
    it('configure returns name and empty config', async () => {
      const eNetModel = new ENetModel();
      await expect(eNetModel.configure({})).resolves.toBeInstanceOf(ENetModel);
      expect(eNetModel.staticParams).toStrictEqual({});
    });
  });

  describe('execute(): ', () => {
    it('throws error for missing input data.', async () => {
      const eNetModel = new ENetModel();
      expect.assertions(3);
      expect(await eNetModel.configure({})).toBeInstanceOf(ENetModel);
      try {
        await eNetModel.execute([]);
      } catch (error) {
        if (error instanceof Error) {
          expect(error).toBeInstanceOf(Error);
          expect(error.message).toEqual('ENetModel: Input data is missing.');
        }
      }
    });
    it('throws error for missing mem-util input field.', async () => {
      const eMemModel = new EMemModel();
      expect.assertions(2);
      expect(await eMemModel.configure({})).toBeInstanceOf(EMemModel);
      await expect(
        eMemModel.execute([
          {
            timestamp: '2023-11-02T10:35:31.820Z',
            duration: 3600,
            'total-memoryGB': 3,
            coefficient: 0.38,
          },
        ])
      ).rejects.toThrowError();
    });
    it('throws error for missing total-memoryGB input field.', async () => {
      const eMemModel = new EMemModel();
      expect.assertions(2);
      expect(await eMemModel.configure({})).toBeInstanceOf(EMemModel);
      await expect(
        eMemModel.execute([
          {
            timestamp: '2023-11-02T10:35:31.820Z',
            duration: 3600,
            'mem-util': 30,
            coefficient: 0.38,
          },
        ])
      ).rejects.toThrowError();
    });
    it('throws error for invalid total-memoryGB input field.', async () => {
      const eMemModel = new EMemModel();
      expect.assertions(2);
      expect(await eMemModel.configure({})).toBeInstanceOf(EMemModel);
      await expect(
        eMemModel.execute([
          {
            timestamp: '2023-11-02T10:35:31.820Z',
            duration: 3600,
            'mem-util': 30,
            coefficient: 0.38,
            'total-memoryGB': 0,
          },
        ])
      ).rejects.toThrowError();
    });
    it('throws error for invalid coefficient input field.', async () => {
      const eMemModel = new EMemModel();
      expect.assertions(2);
      expect(await eMemModel.configure({})).toBeInstanceOf(EMemModel);
      await expect(
        eMemModel.execute([
          {
            timestamp: '2023-11-02T10:35:31.820Z',
            duration: 3600,
            'mem-util': 30,
            coefficient: 0,
            'total-memoryGB': 2,
          },
        ])
      ).rejects.toThrowError();
    });
    it('throws error for invalid mem-util input field.', async () => {
      const eMemModel = new EMemModel();
      expect.assertions(2);
      expect(await eMemModel.configure({})).toBeInstanceOf(EMemModel);
      await expect(
        eMemModel.execute([
          {
            timestamp: '2023-11-02T10:35:31.820Z',
            duration: 3600,
            'mem-util': 300,
            coefficient: 0.2,
            'total-memoryGB': 2,
          },
        ])
      ).rejects.toThrowError();
    });
    it('does not throw error for missing coefficient, but uses default 0.38.', async () => {
      const eMemModel = new EMemModel();
      await expect(
        eMemModel.execute([
          {
            timestamp: '2023-11-02T10:35:31.820Z',
            duration: 3600,
            'mem-util': 30,
            'total-memoryGB': 3,
          },
        ])
      ).resolves.toEqual([
        {
          timestamp: '2023-11-02T10:35:31.820Z',
          duration: 3600,
          'mem-util': 30,
          'total-memoryGB': 3,
          'energy-memory': 0.34199999999999997,
        },
      ]);
    });
  });
  describe('calculateEnergy(): ', () => {
    it('allows coefficient to vary.', async () => {
      const eMemModel = new EMemModel();
      await expect(
        eMemModel.execute([
          {
            timestamp: '2023-11-02T10:35:31.820Z',
            duration: 3600,
            'mem-util': 30,
            'total-memoryGB': 3,
            coefficient: 0.98,
          },
        ])
      ).resolves.toEqual([
        {
          timestamp: '2023-11-02T10:35:31.820Z',
          duration: 3600,
          'mem-util': 30,
          'total-memoryGB': 3,
          coefficient: 0.98,
          'energy-memory': 0.8819999999999999,
        },
      ]);
    });
  });
  describe('calculateEnergy(): ', () => {
    it('calculates correct energy-memory with input set 1.', async () => {
      const eMemModel = new EMemModel();
      await expect(
        eMemModel.execute([
          {
            timestamp: '2023-11-02T10:35:31.820Z',
            duration: 3600,
            'mem-util': 10,
            'total-memoryGB': 1,
            coefficient: 0.38,
          },
        ])
      ).resolves.toEqual([
        {
          timestamp: '2023-11-02T10:35:31.820Z',
          duration: 3600,
          'mem-util': 10,
          'total-memoryGB': 1,
          coefficient: 0.38,
          'energy-memory': 0.038000000000000006,
        },
      ]);
    });
    it('calculates correct energy-memory with input set 2.', async () => {
      const eMemModel = new EMemModel();
      await expect(
        eMemModel.execute([
          {
            timestamp: '2023-11-02T10:35:31.820Z',
            duration: 3600,
            'mem-util': 30,
            'total-memoryGB': 1,
            coefficient: 0.38,
          },
        ])
      ).resolves.toEqual([
        {
          timestamp: '2023-11-02T10:35:31.820Z',
          duration: 3600,
          'mem-util': 30,
          'total-memoryGB': 1,
          coefficient: 0.38,
          'energy-memory': 0.11399999999999999,
        },
      ]);
    });
  });
});
