import {PowerCurveLookup} from '../types';

export interface EnergyCalculatorInterface {
  calculateEnergy(
    powerCurveLookup: PowerCurveLookup,
    cpuUtil: number,
    duration: number
  ): number;

  simulateEnergy(
    physicalCpuPowerCurveLookup: PowerCurveLookup,
    simulatedCpuPowerCurveLookup: PowerCurveLookup,
    physicalCpuUtil: number,
    duration: number
  ): number;
}
