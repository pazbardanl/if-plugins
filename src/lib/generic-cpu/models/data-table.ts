// TODO PB -- standard IF errors
// TODO PB -- validate table alignment (same row number for each column)

export class DataTable {
  private dataMap: Map<string, number[]> = new Map<string, number[]>();

  constructor(data: string[][]) {
    this.dataMap = this.getValidatedDataMap(data);
  }

  getColumnData(columnName: string): number[] {
    const colData = this.dataMap.get(columnName);
    if (colData === undefined) {
      throw new Error(`Column ${columnName} not found in data table`);
    }
    return colData;
  }

  getSize(): number {
    return this.dataMap.size;
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
      throw new Error('Invalid header');
    }
    return headerString;
  }

  private getValidatedNumber(str: string): number {
    const parsedValue = parseFloat(str);
    if (isNaN(parsedValue)) {
      throw new Error(`Failed to parse '${str}' as a number`);
    }
    return parsedValue;
  }
}
