import { TraceDataModel } from '@/models/trace_data';

export type ApexChartRecord = {
  x: Date;
  y: (number | null)[];
};

export type ApexChartData = {
  name: string;
  type: string;
  data: ApexChartRecord[];
  color: string;
};

export abstract class ChartDataConverter {
  abstract getName(): string;
  abstract getChartLength(): number;
  abstract getChartData(i: number): ApexChartData;
  abstract getYAxis(): ApexYAxis;
  abstract getYMin(): number;
  abstract getYMax(): number;
}

export class ChartDataConverterFactory {
  private chartDataConverterMap: {
    [type: string]: (
      traceData: TraceDataModel,
      filterDays: number
    ) => ChartDataConverter;
  };
  constructor(chartDataConverterMap: {
    [type: string]: (
      traceData: TraceDataModel,
      filterDays: number
    ) => ChartDataConverter;
  }) {
    this.chartDataConverterMap = chartDataConverterMap;
  }

  create(traceData: TraceDataModel, filterDays: number): ChartDataConverter {
    const converterFactoryFunc = this.chartDataConverterMap[traceData.type];
    // if (!converterFactoryFunc) {
    //   return undefined;
    // }
    return converterFactoryFunc(traceData, filterDays);
  }
}
