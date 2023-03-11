import {
  ApexChartRecord,
  ApexChartData,
  ChartDataConverter,
} from '@/components/apexcharts/ChartDataConverterFactory';
import { TraceDataModel } from '@/models/trace_data';

export class BollingerBandDataConverter extends ChartDataConverter {
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
        show: false,
        color: '#008FFB',
      },
      labels: {
        show: false,
        style: {
          colors: '#008FFB',
        },
      },
      // title: {
      //   text: 'Income (thousand crores)',
      //   style: {
      //     color: '#008FFB',
      //   },
      // },
      tooltip: {
        enabled: false,
      },
    };
  }
  getName(): string {
    return 'bollinger_band';
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
    const start = Math.max(traceData.x.length - filterDays, 0);
    const dataList: ApexChartData[] = [];
    for (const name in traceData.y) {
      const yList1 = traceData.y[name];
      const data: ApexChartRecord[] = [];
      for (let i = start; i < traceData.x.length; i++) {
        const yList2: (number | null)[] = [];
        const value = yList1[i];
        if (value !== -9999) {
          min = Math.min(min, value);
          max = Math.max(max, value);
          yList2.push(value);
        } else {
          yList2.push(null);
        }

        data.push({
          x: new Date(traceData.x[i]),
          y: yList2,
        });
      }

      dataList.push({
        name: 'BB_' + name,
        type: 'line',
        data: data,
        color: '#008FFB',
      });
    }

    return [dataList, min, max];
  }
}
