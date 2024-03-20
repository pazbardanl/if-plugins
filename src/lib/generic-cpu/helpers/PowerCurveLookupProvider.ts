import {ERRORS} from '../../../util/errors';
import {buildErrorMessage} from '../../../util/helpers';
import {DirectoryReaderInterface} from '../interfaces/DirectoryReaderInterface';
import {PowerCurveLookupParserInterface} from '../interfaces/PowerCurveLookupParserInterface';
import {PowerCurveLookup} from '../types';
const {InputValidationError} = ERRORS;

export class PowerCurveLookupProvider {
  private directoryReader: DirectoryReaderInterface;
  private powerLookupTableParser: PowerCurveLookupParserInterface;
  private errorBuilder = buildErrorMessage('PowerCurveLookupProvider');
  private nameToPowerCurveLookup: Map<string, PowerCurveLookup> = new Map<
    string,
    PowerCurveLookup
  >();

  constructor(
    directoryReader: DirectoryReaderInterface,
    powerCurveLookupParser: PowerCurveLookupParserInterface
  ) {
    this.directoryReader = directoryReader;
    this.powerLookupTableParser = powerCurveLookupParser;
    this.init();
  }

  getPowerCurveLookup(productName: string): PowerCurveLookup | undefined {
    if (!this.nameToPowerCurveLookup.has(productName)) {
      throw new InputValidationError(
        this.errorBuilder({
          message: `no power curve lookup found for ${productName}`,
        })
      );
    }
    return this.nameToPowerCurveLookup.get(productName);
  }

  private init() {
    const powerCurveLookupNameToRawString: Map<string, string> =
      this.directoryReader.read();
    for (const [
      powerCurveLookupName,
      powerCurveLookupRawString,
    ] of powerCurveLookupNameToRawString.entries()) {
      const powerCurveLookup: PowerCurveLookup =
        this.powerLookupTableParser.fromString(powerCurveLookupRawString);
      this.nameToPowerCurveLookup.set(powerCurveLookupName, powerCurveLookup);
    }
  }
}
