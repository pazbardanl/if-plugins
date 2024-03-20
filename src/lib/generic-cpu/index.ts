import {PluginInterface} from '../../interfaces';
import {ConfigParams, PluginParams} from '../../types/common';
import {ERRORS} from '../../util/errors';
import {buildErrorMessage} from '../../util/helpers';
import {DirectoryReader} from './helpers/directory-reader';
import {CsvPowerCurveLookupParser} from './helpers/csv-power-curve-lookup-parser';
import {PowerCurveLookupProvider} from './helpers/PowerCurveLookupProvider';
import {DirectoryReaderInterface} from './interfaces/directory-reader-interface';
import {PowerCurveLookupParserInterface} from './interfaces/PowerCurveLookupParserInterface';
const {InputValidationError} = ERRORS;

export const GenericCPU = (globalConfig: ConfigParams): PluginInterface => {
  const DOOR_DIR_PATH_AT_NAME = 'root-dir-path';
  const errorBuilder = buildErrorMessage('GenericCPU');
  let powerCurveLookupProvider: PowerCurveLookupProvider;

  const metadata = {
    kind: 'execute',
  };

  /**
   * TODO PB - doc
   */
  const execute = async (inputs: PluginParams[]) => {
    powerCurveLookupProvider = createPowerCurveLookupProvider(globalConfig);
    powerCurveLookupProvider.getPowerCurveLookup('testLookup1');
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
    const directoryReader: DirectoryReaderInterface = new DirectoryReader(
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
