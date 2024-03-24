// TODO PB -- clean code

import {DataTable} from '../models/data-table';
import {CsvDirectoryReader} from './csv-directory-reader';
import {LinearInterpolator} from './linear-interpolator';

export class PowerCalculator {
  private CPU_UTIL_COL_NAME = 'CPU_perc';
  private THROUGHPUT_COL_NAME = 'Throughput_reqPerSec';
  private POWER_COL_NAME = 'POWER_W';
  private prodNameToDataTable: Map<string, DataTable> = new Map<
    string,
    DataTable
  >();
  private linearInterpolator: LinearInterpolator;
  constructor(
    productNames: string[],
    csvDirectortyReader: CsvDirectoryReader,
    linearInterpolator: LinearInterpolator
  ) {
    this.prodNameToDataTable = this.getProdNameToDataTable(
      productNames,
      csvDirectortyReader
    );
    this.linearInterpolator = linearInterpolator;
  }

  calculate(cpuUtil: number, processorName: string) {
    const powerCurveDataTable = this.prodNameToDataTable.get(processorName);
    if (powerCurveDataTable === undefined) {
      throw new Error(`no power curve available for ${processorName}`);
    }
    const cpuUtilSeries = powerCurveDataTable.getColumnData(
      this.CPU_UTIL_COL_NAME
    );
    const powerSeries = powerCurveDataTable.getColumnData(this.POWER_COL_NAME);
    const power = this.linearInterpolator.interpolate(
      cpuUtil,
      cpuUtilSeries,
      powerSeries
    );
    return power;
  }

  simulate(
    physicalCpuUtil: number,
    physicalProcessorName: string,
    simulatedProcessorName: string
  ) {
    const physicalPowerCurveDataTable = this.prodNameToDataTable.get(
      physicalProcessorName
    );
    if (physicalPowerCurveDataTable === undefined) {
      throw new Error(`no power curve available for ${physicalProcessorName}`);
    }
    const simulatedPowerCurveDataTable = this.prodNameToDataTable.get(
      simulatedProcessorName
    );
    if (simulatedPowerCurveDataTable === undefined) {
      throw new Error(
        `no power curve available for ${simulatedPowerCurveDataTable}`
      );
    }
    // interpolate TP
    const physicalThrouputSeries = physicalPowerCurveDataTable.getColumnData(
      this.THROUGHPUT_COL_NAME
    );
    const physicalCpuUtilSeries = physicalPowerCurveDataTable.getColumnData(
      this.CPU_UTIL_COL_NAME
    );
    const throughput = this.linearInterpolator.interpolate(
      physicalCpuUtil,
      physicalCpuUtilSeries,
      physicalThrouputSeries
    );
    // interpolate simulated CPU util
    const simulatedThroughputSeries =
      simulatedPowerCurveDataTable.getColumnData(this.THROUGHPUT_COL_NAME);
    const simulatedCpuUtilSeries = simulatedPowerCurveDataTable.getColumnData(
      this.CPU_UTIL_COL_NAME
    );
    const simulatedCpuUtil = this.linearInterpolator.interpolate(
      throughput,
      simulatedThroughputSeries,
      simulatedCpuUtilSeries
    );
    // interpolate simulated power
    const simulatedPowerSeries = simulatedPowerCurveDataTable.getColumnData(
      this.POWER_COL_NAME
    );
    const power = this.linearInterpolator.interpolate(
      simulatedCpuUtil,
      simulatedCpuUtilSeries,
      simulatedPowerSeries
    );
    return power;
  }

  private getProdNameToDataTable(
    productNames: string[],
    csvDirectortyReader: CsvDirectoryReader
  ): Map<string, DataTable> {
    const prodNameToDataTable: Map<string, DataTable> = new Map<
      string,
      DataTable
    >();
    const prodNameToCsvContent = csvDirectortyReader.read(productNames);
    for (const key in prodNameToCsvContent) {
      if (Object.prototype.hasOwnProperty.call(prodNameToCsvContent, key)) {
        const content: string[][] = prodNameToCsvContent[key];
        prodNameToDataTable.set(key, new DataTable(content));
      }
    }
    return prodNameToDataTable;
  }
}
