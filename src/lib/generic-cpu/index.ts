import {PluginInterface} from '../../interfaces';
import {ConfigParams, PluginParams} from '../../types/common';
import {CsvDirectoryReader} from './helpers/csv-directory-reader';
import {LinearInterpolator} from './helpers/linear-interpolator';
import {PowerCalculator} from './helpers/power-calculator';

export const GenericCPU = (globalConfig: ConfigParams): PluginInterface => {
  const metadata = {
    kind: 'execute',
  };

  /**
   * TODO PB - doc
   */
  const execute = async (inputs: PluginParams[]) => {
    const powerCurvesRootDir = globalConfig['power-curves-root-dir'];
    const physicalProcessor = globalConfig['physical-processor'];
    const simulatedProcessor = globalConfig['simulated-processor'];
    const processorNames = shouldSimulate(simulatedProcessor)
      ? [physicalProcessor, simulatedProcessor]
      : [physicalProcessor];
    const powerCalculator = new PowerCalculator(
      processorNames,
      new CsvDirectoryReader(powerCurvesRootDir),
      new LinearInterpolator()
    );

    return inputs.map((input: PluginParams) => {
      const cpuUtil = input['cpu/utilization'];
      const duration = input['duration'];
      const power = shouldSimulate(simulatedProcessor)
        ? powerCalculator.simulate(
            cpuUtil,
            physicalProcessor,
            simulatedProcessor
          )
        : powerCalculator.calculate(cpuUtil, physicalProcessor);
      return {
        ...input,
        'cpu/energy': calculateEnergy(power, duration),
      };
    });
  };

  const shouldSimulate = (simulatedProcessor: string) => {
    return simulatedProcessor !== undefined;
  };

  const calculateEnergy = (power: number, duration: number) => {
    return (power * (duration / 3600)) / 1000;
  };

  return {
    metadata,
    execute,
  };
};
