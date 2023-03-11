import { ApexOptions } from 'apexcharts';

import { AbstractApexChart } from '@/components/apexcharts/AbstractApexChart';

export class ApexChartMain extends AbstractApexChart {
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
        opposite: true,
        axisTicks: {
          show: false,
        },
        axisBorder: {
          show: true,
          //   color: '#008FFB',
        },
        labels: {
          show: true,
          style: {
            // colors: '#008FFB',
          },
          formatter: function (val) {
            return val.toFixed(0);
          },
          align: 'right',
        },
        title: {
          text: 'Stock Price',
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
