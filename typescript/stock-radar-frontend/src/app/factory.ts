import { BollingerBandDataConverter } from '@/components/apexcharts/BollingerBandDataConverter';
import { CandlestickDataConverter } from '@/components/apexcharts/CandlestickDataConverter';
import { ChartDataConverterFactory } from '@/components/apexcharts/ChartDataConverterFactory';
import { MacdDataConverter } from '@/components/apexcharts/MacdDataConverter';
import { SmaDataConverter } from '@/components/apexcharts/SmaDataConverter';
import { TraceDataModel } from '@/models/trace_data';

export const chartDataConverterFactory = new ChartDataConverterFactory({
  candlestick: (traceData: TraceDataModel, filterDays: number) =>
    new CandlestickDataConverter(traceData, filterDays),
  sma: (traceData: TraceDataModel, filterDays: number) =>
    new SmaDataConverter(traceData, filterDays),
  bollinger_band: (traceData: TraceDataModel, filterDays: number) =>
    new BollingerBandDataConverter(traceData, filterDays),
  macd: (traceData: TraceDataModel, filterDays: number) =>
    new MacdDataConverter(traceData, filterDays),
});
