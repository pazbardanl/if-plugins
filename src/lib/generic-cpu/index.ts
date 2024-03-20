import {PluginInterface} from '../../interfaces';
import {ConfigParams, PluginParams} from '../../types/common';
import {ERRORS} from '../../util/errors';
import {buildErrorMessage} from '../../util/helpers';
import {CsvDirectoryReader} from './helpers/csv-directory-reader';
import {CsvPowerCurveLookupParser} from './helpers/CsvPowerCurveLookupParser';
import {PowerCurveLookupProvider} from './helpers/PowerCurveLookupProvider';
import {DirectoryReaderInterface} from './interfaces/directory-reader-interface';
import {PowerCurveLookupParserInterface} from './interfaces/PowerCurveLookupParserInterface';
const {InputValidationError} = ERRORS;

export const GenericCPU = (globalConfig: ConfigParams): PluginInterface => {
  const DOOR_DIR_PATH_AT_NAME = 'root-dir-path';
  const errorBuilder = buildErrorMessage('MockObservations');
  let powerCurveLookupProvider: PowerCurveLookupProvider;

  const metadata = {
    kind: 'execute',
  };

  /**
   * Generate sets of mocked observations based on config.
   */
  const execute = async (inputs: PluginParams[]) => {
    powerCurveLookupProvider = createPowerCurveLookupProvider(globalConfig);
    powerCurveLookupProvider.getPowerCurveLookup('FakeProd');
    return inputs;
  };

  const createPowerCurveLookupProvider = (params: {
    [key: string]: any;
  }): PowerCurveLookupProvider => {
    if (!(DOOR_DIR_PATH_AT_NAME in params)) {
      throw new InputValidationError(
        errorBuilder({
          message: `${DOOR_DIR_PATH_AT_NAME} missing from global config`,
        })
      );
    }
    const powerCurvesRootDirPath = params[DOOR_DIR_PATH_AT_NAME];
    const directoryReader: DirectoryReaderInterface = new CsvDirectoryReader(
      powerCurvesRootDirPath,
      '.csv'
    );
    const powerCurvesParser: PowerCurveLookupParserInterface =
      new CsvPowerCurveLookupParser();
    return new PowerCurveLookupProvider(directoryReader, powerCurvesParser);
  };

  return {
    metadata,
    execute,
  };
};
