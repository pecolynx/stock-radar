import { ApexOptions } from 'apexcharts';

import { AbstractApexChart } from '@/components/apexcharts/AbstractApexChart';

export class ApexChartSub1 extends AbstractApexChart {
  getApexOptions(min: number, max: number): ApexOptions {
    return {
      chart: {
        height: '400px',
      },
      title: {
        text: 'CandleStick Chart',
        align: 'left',
      },
      xaxis: {
        type: 'datetime',
      },
      yaxis: {
        min: min,
        max: max,
        opposite: true,
        axisTicks: {
          // show: false,
        },
        axisBorder: {
          show: true,
        },
        labels: {
          show: true,
          style: {
            // colors: '#008FFB',
          },
          formatter: function (val: number): string {
            return val.toFixed(0);
          },
          // align: 'right',
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
      },
    };
  }
}
