import {PowerCurveLookupParserInterface} from '../interfaces/PowerCurveLookupParserInterface';
import {PowerCurveLookup} from '../types';

// TODO PB -- clean code and remove exessive comments
export class CsvPowerCurveLookupParser
  implements PowerCurveLookupParserInterface
{
  fromString(csvString: string, name: string): PowerCurveLookup {
    const rows = csvString
      .trim()
      .split('\n')
      .map(row => row.trim());
    const headers = rows
      .shift()!
      .split(',')
      .map(header => header.trim());
    const keyNameToSeries = new Map<string, number[]>();

    // Exclude the last column (value column) when populating keyNameToSeries
    headers.slice(0, -1).forEach(header => {
      keyNameToSeries.set(header, []);
    });

    const valueName = headers[headers.length - 1];
    const valueSeries: number[] = [];

    rows.forEach(row => {
      const values = row.split(',').map(value => parseFloat(value.trim()));

      if (values.length === headers.length) {
        headers.slice(0, -1).forEach((header, index) => {
          const series = keyNameToSeries.get(header)!;
          series.push(values[index]);
        });

        valueSeries.push(values[values.length - 1]); // Push the value from the last column
      }
    });

    return {
      name: name,
      keyNameToSeries: keyNameToSeries,
      valueName: valueName,
      valueSeries: valueSeries,
    };
  }
}
