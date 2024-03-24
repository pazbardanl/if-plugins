import * as fs from 'fs';
import * as path from 'path';

export class CsvDirectoryReader {
  private directoryPath: string;

  constructor(directoryPath: string) {
    this.validateDirectoryPath(directoryPath);
    this.directoryPath = directoryPath;
  }

  read(fileNames: string[]): {[key: string]: string[][]} {
    const filesMapping: {[key: string]: string[][]} = {};
    for (const fileName of fileNames) {
      const filePath = path.join(this.directoryPath, fileName + '.csv');
      const fileContent = fs.readFileSync(filePath, 'utf8');
      filesMapping[fileName] = this.parseCSV(fileContent);
    }
    return filesMapping;
  }

  private validateDirectoryPath(directoryPath: string) {
    if (
      !fs.existsSync(directoryPath) ||
      !fs.lstatSync(directoryPath).isDirectory()
    ) {
      throw new Error('Invalid directory path: ' + directoryPath);
    }
  }

  private parseCSV(csvString: string): string[][] {
    const rows: string[] = csvString.split('\n');
    const result: string[][] = [];
    for (const row of rows) {
      const columns: string[] = row.split(',');
      result.push(columns);
    }
    return result;
  }
}
