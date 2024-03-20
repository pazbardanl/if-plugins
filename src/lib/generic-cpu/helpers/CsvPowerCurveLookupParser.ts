import {parse} from 'csv-parse';
import {PowerCurveLookupParserInterface} from '../interfaces/PowerCurveLookupParserInterface';
import {PowerCurveLookup} from '../types';

export class CsvPowerCurveLookupParser
  implements PowerCurveLookupParserInterface
{
  fromString(stringData: string): PowerCurveLookup {
    const records: string[][] = [];
    const keyNameToSeries = new Map<string, number[]>();
    let valueSeries: number[] = [];

    // Parse the CSV data
    const parser = parse(stringData, {
      cast: true,
      from_line: 2, // Assuming the first line contains headers and we skip it
    });

    parser
      .on('readable', () => {
        let record;
        while ((record = parser.read())) {
          // Using parser.read() instead of this.read()
          records.push(record);
        }
      })
      .on('end', () => {
        // Extract keys and values from CSV records
        const keys = Object.keys(records[0]).slice(0, -1); // Exclude the last column (value column)

        keys.forEach((key, index) => {
          const series = records.map(record => parseFloat(record[index]));
          keyNameToSeries.set(key, series);
        });

        valueSeries = records.map(record => parseFloat(record[keys.length])); // Last column (value column)

        // Create and return the PowerCurveLookup object
        const powerCurveLookup: PowerCurveLookup = {
          name: 'PowerCurveLookup', // You can set any name you want
          keyNameToSeries: keyNameToSeries,
          valueName: keys[keys.length - 1], // Name of the last column (value column)
          valueSeries: valueSeries,
        };

        console.log(powerCurveLookup); // Output the parsed PowerCurveLookup object
        return powerCurveLookup;
      });

    // You need to return something here, perhaps a placeholder or undefined.
    return {} as PowerCurveLookup;
  }
}
