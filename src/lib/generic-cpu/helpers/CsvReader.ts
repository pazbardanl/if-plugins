import * as fs from 'fs';

export const CsvReader = (filePath: string) => {
  const read = (): Promise<string> => {
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  };
  return {
    read,
  };
};
