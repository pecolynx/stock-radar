import { ApexOptions } from 'apexcharts';

import { AbstractApexChart } from '@/components/apexcharts/AbstractApexChart';

export class ApexChartSub2 extends AbstractApexChart {
  getApexOptions(min: number, max: number): ApexOptions {
    return {
      chart: {
        height: '800px',
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
