import { ApexOptions } from 'apexcharts';

export abstract class AbstractApexChart {
  abstract getApexOptions(min: number, max: number): ApexOptions;
}
