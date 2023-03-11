import {
  ApexChartData,
  ApexChartRecord,
  ChartDataConverter,
} from '@/components/apexcharts/ChartDataConverterFactory';
import { TraceDataModel } from '@/models/trace_data';

export class CandlestickDataConverter extends ChartDataConverter {
  private chartDataList: ApexChartData[];
  private yaxis: ApexYAxis;
  private ymin: number;
  private ymax: number;

  constructor(traceData: TraceDataModel, filterDays: number) {
    super();
    const [chartDataList, min, max] = this._getDataList(traceData, filterDays);
    this.chartDataList = chartDataList;
    this.ymin = min;
    this.ymax = max;
    this.yaxis = {
      // min: Math.floor(min * 0.99),
      // max: Math.floor(max * 1.01),
      axisTicks: {
        show: false,
      },
      axisBorder: {
        show: true,
        // color: '#008FFB',
      },
      labels: {
        style: {
          // colors: '#008FFB',
        },
      },
      title: {
        text: 'xxx (thousand crores)',
        style: {
          // color: '#008FFB',
        },
      },
      tooltip: {
        enabled: false,
      },
    };
  }

  getName(): string {
    return 'candlestick';
  }

  getChartLength(): number {
    return this.chartDataList.length;
  }

  getChartData(i: number): ApexChartData {
    // console.log(this.chartDataListList);
    return this.chartDataList[i];
  }

  getYAxis(): ApexYAxis {
    return this.yaxis;
  }

  getYMin(): number {
    return this.ymin;
  }

  getYMax(): number {
    return this.ymax;
  }

  private _getDataList(
    traceData: TraceDataModel,
    filterDays: number
  ): [ApexChartData[], number, number] {
    if (!traceData) {
      return [[], 0, 0];
    }

    let min = 999999;
    let max = 0;

    const data: ApexChartRecord[] = [];
    const start = Math.max(traceData.x.length - filterDays, 0);
    for (let i = start; i < traceData.x.length; i++) {
      const y = [];
      for (const key of ['open', 'high', 'low', 'close']) {
        const value = traceData.y[key][i];
        if (value !== -9999) {
          min = Math.min(min, value);
          max = Math.max(max, value);
          y.push(value);
        } else {
          y.push(null);
        }
      }

      data.push({
        x: new Date(traceData.x[i]),
        y: [
          traceData.y['open'][i],
          traceData.y['high'][i],
          traceData.y['low'][i],
          traceData.y['close'][i],
        ],
      });
    }

    return [
      [
        {
          name: 'OHLC',
          type: 'candlestick',
          data: data,
          color: '#008FFB',
        },
      ],
      min,
      max,
    ];
  }

  // private getData(
  //   traceData: TraceDataModel,
  //   filterDays: number
  // ): [ApexChartData[][], number, number] {
  //   if (!traceData) {
  //     return [[], 0, 0];
  //   }

  //   let min = 999999;
  //   let max = 0;
  //   const data: ApexChartData[][] = [];
  //   data.push([]);
  //   const start = Math.max(traceData.x.length - filterDays, 0);
  //   for (let i = start; i < traceData.x.length; i++) {
  //     const y = [];
  //     for (const key of ['open', 'high', 'low', 'close']) {
  //       const value = traceData.y[key][i];
  //       if (value !== -9999) {
  //         min = Math.min(min, value);
  //         max = Math.max(max, value);
  //         y.push(value);
  //       } else {
  //         y.push(null);
  //       }
  //     }

  //     data[0].push({
  //       x: new Date(traceData.x[i]),
  //       y: [
  //         traceData.y['open'][i],
  //         traceData.y['high'][i],
  //         traceData.y['low'][i],
  //         traceData.y['close'][i],
  //       ],
  //     });
  //   }
  //   return [data, min, max];
  // }
}
