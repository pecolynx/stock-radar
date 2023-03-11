import { FormEvent, ReactElement, useEffect, useState } from 'react';

import { ApexOptions } from 'apexcharts';
import ReactApexChart from 'react-apexcharts';
import { Button, Checkbox, CheckboxProps, Form } from 'semantic-ui-react';

import { chartDataConverterFactory } from '@/app/factory';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { AppBreadcrumb, ErrorMessage } from '@/components';
import { AbstractApexChart } from '@/components/apexcharts/AbstractApexChart';
import { ApexChartMain } from '@/components/apexcharts/ApexChartMain';
import { ApexChartSub1 } from '@/components/apexcharts/ApexChartSub1';
import { ApexChartSub2 } from '@/components/apexcharts/ApexChartSub2';
import { ChartDataConverter } from '@/components/apexcharts/ChartDataConverterFactory';
import { getChartData, selectTraceDataList } from '@/features/chart';
import { emptyFunction } from '@/utils/util';

type Chart = {
  apexOptions: ApexOptions;
  apexAxisChartSeries: ApexAxisChartSeries;
  // converterList: ChartDataConverter[];
};

const createChart = (
  apexChart: AbstractApexChart,
  converterList: ChartDataConverter[]
): Chart => {
  let min = 99999;
  let max = 0;
  const apexYAsisList = [];
  const apexAxisChartSeries: ApexAxisChartSeries = [];
  for (let b = 0; b < converterList.length; b++) {
    const converter: ChartDataConverter = converterList[b];
    for (let j = 0; j < converter.getChartLength(); j++) {
      const chartData = converter.getChartData(j);
      apexAxisChartSeries.push({
        name: chartData.name,
        type: chartData.type,
        data: chartData.data,
        color: chartData.color,
      });
      const yaxis = converter.getYAxis();

      min = Math.min(min, converter.getYMin());
      max = Math.max(max, converter.getYMax());
      yaxis.min = min;
      yaxis.min = max;

      apexYAsisList.push(yaxis);
    }
  }
  min = Math.floor(min * 0.99);
  max = Math.floor(max * 1.01);
  console.log(max - min);
  console.log((max - min) % 10);
  while ((max - min) % 10 !== 0) {
    if ((max - min) % 10 === 0) {
      break;
    }
    max++;
    if ((max - min) % 10 === 0) {
      break;
    }
    min--;
  }
  console.log(min, max);
  for (let b = 0; b < converterList.length; b++) {
    apexYAsisList[b].min = min;
    apexYAsisList[b].max = max;
  }

  // const apexOptions: ApexOptions = {
  //   chart: {
  //     height: '800px',
  //   },
  //   title: {
  //     text: 'CandleStick Chart',
  //     align: 'left',
  //   },
  //   xaxis: {
  //     type: 'datetime',
  //   },
  //   yaxis: apexYAsisList,
  // };

  return {
    apexAxisChartSeries: apexAxisChartSeries,
    apexOptions: apexChart.getApexOptions(min, max),
  };
};
export const ApexChartDashboard = (): ReactElement => {
  const dispatch = useAppDispatch();
  const traceDataList = useAppSelector(selectTraceDataList);
  const [brandId, setBrandId] = useState('1');
  const [errorMessage, setErrorMessage] = useState('');
  const [filterDays, setFilterDays] = useState(30);
  const [smaEnabled, setSmaEnabled] = useState(false);
  const [bollingerBandEnabled, setBollingerBandEnabled] = useState(false);

  const converterList: ChartDataConverter[][] = [[], [], []];
  const apexChartList: AbstractApexChart[] = [
    new ApexChartMain(),
    new ApexChartSub1(),
    new ApexChartSub2(),
  ];
  for (let i = 0; i < traceDataList.list.length; i++) {
    const converter: ChartDataConverter = chartDataConverterFactory.create(
      traceDataList.list[i],
      filterDays
    );
    if (converter.getName() == 'candlestick') {
      converterList[0].push(converter);
    }
    if (smaEnabled) {
      if (converter.getName() == 'sma') {
        converterList[0].push(converter);
      }
    }
    if (bollingerBandEnabled) {
      if (converter.getName() == 'bollinger_band') {
        converterList[0].push(converter);
      }
    }
    if (converter.getName() == 'macd') {
      converterList[1].push(converter);
    }
  }

  const chartList: Chart[] = [];
  for (let i = 0; i < 3; i++) {
    const chart = createChart(apexChartList[i], converterList[i]);
    chartList.push(chart);
  }

  const search = (brandIdStr: string) => {
    const brandId = parseInt(brandIdStr);
    if (!brandId) {
      return;
    }

    const f = async () => {
      await dispatch(
        getChartData({
          param: {
            brandId: brandId,
          },
          postSuccessProcess: emptyFunction,
          postFailureProcess: setErrorMessage,
        })
      );
    };
    f().catch(console.error);
  };

  useEffect(() => {
    search(brandId);
  }, [dispatch, brandId]);

  return (
    <div id="chart">
      <Form>
        <Form.Group>
          <Form.Input
            placeholder="Brand ID"
            name="name"
            value={brandId}
            onChange={(e) => setBrandId(e.target.value)}
          />
          <Form.Button content="Search" onClick={() => search(brandId)} />
        </Form.Group>
      </Form>
      <Button.Group>
        <Button onClick={() => setFilterDays(30)}>30 days</Button>
        <Button onClick={() => setFilterDays(90)}>90 days</Button>
        <Button onClick={() => setFilterDays(180)}>180 days</Button>
      </Button.Group>
      <Checkbox
        label="SMA"
        onChange={(e: FormEvent<HTMLInputElement>, data: CheckboxProps) => {
          if (data.checked !== undefined) {
            setSmaEnabled(data.checked);
          }
        }}
        checked={smaEnabled}
      />
      <Checkbox
        label="Bollinger Band"
        onChange={(e: FormEvent<HTMLInputElement>, data: CheckboxProps) => {
          if (data.checked !== undefined) {
            setBollingerBandEnabled(data.checked);
          }
        }}
        checked={bollingerBandEnabled}
      />
      {chartList.map((chart: Chart, i: number) => {
        return (
          <ReactApexChart
            height={chart.apexOptions.chart?.height}
            key={i}
            options={chart.apexOptions}
            series={chart.apexAxisChartSeries}
          />
        );
      })}
      <ErrorMessage message={errorMessage} />
    </div>
  );
};
