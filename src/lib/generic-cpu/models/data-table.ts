import {ERRORS} from '../../../util/errors';
const {InputValidationError} = ERRORS;

export class DataTable {
  private dataMap: Map<string, number[]> = new Map<string, number[]>();

  constructor(data: string[][]) {
    this.validateInputDataStructure(data);
    this.dataMap = this.getValidatedDataMap(data);
  }

  getColumnData(columnName: string): number[] {
    const colData = this.dataMap.get(columnName);
    if (colData === undefined) {
      throw new InputValidationError(
        `Column ${columnName} not found in data table`
      );
    }
    return colData;
  }

  getSize(): number {
    return this.dataMap.size;
  }

  private validateInputDataStructure(data: string[][]) {
    if (data === undefined || data.length === 0) {
      throw new InputValidationError('input data is undefined or empty');
    }
    const expectedRowLength = data[0].length;
    data.forEach(row => {
      if (row.length !== expectedRowLength) {
        throw new InputValidationError(
          'input data misalignment: different row length'
        );
      }
    });
  }

  private getValidatedDataMap(data: string[][]): Map<string, number[]> {
    const dataMap: Map<string, number[]> = new Map<string, number[]>();
    for (let colIndex = 0; colIndex < data[0].length; colIndex++) {
      const header = this.getValidatedHeader(data[0][colIndex]);
      const colData: number[] = [];
      for (let rowIndex = 1; rowIndex < data.length; rowIndex++) {
        colData[rowIndex - 1] = this.getValidatedNumber(
          data[rowIndex][colIndex]
        );
      }
      dataMap.set(header, colData);
    }
    return dataMap;
  }

  private getValidatedHeader(headerString: string): string {
    if (typeof headerString !== 'string' || headerString.trim() === '') {
      throw new InputValidationError('Invalid header');
    }
    return headerString;
  }

  private getValidatedNumber(str: string): number {
    const parsedValue = parseFloat(str);
    if (isNaN(parsedValue)) {
      throw new InputValidationError(`Failed to parse '${str}' as a number`);
    }
    return parsedValue;
  }
}
