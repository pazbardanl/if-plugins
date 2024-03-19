import {PluginInterface} from '../../interfaces';
import {ConfigParams, PluginParams} from '../../types/common';

export const GenericCPU = (_globalConfig: ConfigParams): PluginInterface => {
  const metadata = {
    kind: 'execute',
  };

  /**
   * Generate sets of mocked observations based on config.
   */
  const execute = async (inputs: PluginParams[]) => {
    return inputs;
  };

  return {
    metadata,
    execute,
  };
};
