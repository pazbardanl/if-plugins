import * as fs from 'fs';
import * as path from 'path';
import {DirectoryReaderInterface} from '../interfaces/DirectoryReaderInterface';

export class CsvDirectoryReader implements DirectoryReaderInterface {
  private directoryPath: string;
  private extension: string | undefined;

  constructor(
    directoryPath: string,
    extension: string | undefined = undefined
  ) {
    this.validateDirectoryPath(directoryPath);
    this.directoryPath = directoryPath;
    this.extension = extension;
  }

  read(): Map<string, string> {
    const csvFilesMap: Map<string, string> = new Map();
    const files = fs.readdirSync(this.directoryPath);
    for (const file of files) {
      if (this.extension === undefined || file.endsWith(this.extension)) {
        const fileName = path.parse(file).name;
        const filePath = path.join(this.directoryPath, file);
        const fileContent = fs.readFileSync(filePath, 'utf8');
        csvFilesMap.set(fileName, fileContent);
      }
    }
    return csvFilesMap;
  }

  private validateDirectoryPath(directoryPath: string) {
    if (
      !fs.existsSync(directoryPath) ||
      !fs.lstatSync(directoryPath).isDirectory()
    ) {
      throw new Error('Invalid directory path: ' + directoryPath);
    }
  }
}
