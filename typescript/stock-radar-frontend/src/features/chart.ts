import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

import { RootState, BaseThunkApiConfig } from '@/app/store';
import { TraceDataListModel, TraceDataModel } from '@/models/trace_data';

import { backendUrl, extractErrorMessage } from './base';

const baseUrl = `${backendUrl}/chart/data`;

export type ChartDataGetParameter = {
  brandId: number;
};
export type ChartDataGetArg = {
  param: ChartDataGetParameter;
  postSuccessProcess: () => void;
  postFailureProcess: (error: string) => void;
};

type ChartDataGetResult = {
  param: ChartDataGetParameter;
  response: TraceDataListModel;
};

export const getChartData = createAsyncThunk<
  ChartDataGetResult,
  ChartDataGetArg,
  BaseThunkApiConfig
>('audio/get', async (arg: ChartDataGetArg, thunkAPI) => {
  const url = `${baseUrl}/${arg.param.brandId}`;
  return await axios
    .get(url, { data: {} })
    .then((resp) => {
      const response = resp.data as TraceDataListModel;
      arg.postSuccessProcess();
      return { param: arg.param, response: response } as ChartDataGetResult;
    })
    .catch((err: Error) => {
      const errorMessage = extractErrorMessage(err);
      arg.postFailureProcess(errorMessage);
      return thunkAPI.rejectWithValue(errorMessage);
    });
});

export interface AudioViewState {
  loading: boolean;
  failed: boolean;
  traceDataListModel: TraceDataListModel;
}
// const defaultTraceDataModel: TraceDataModel = {
//   x: [],
//   y: {},
// };
const defaultTraceDataListModel: TraceDataListModel = {
  list: [],
};
const initialState: AudioViewState = {
  loading: false,
  failed: false,
  traceDataListModel: defaultTraceDataListModel,
};

export const chartSlice = createSlice({
  name: 'chart',
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getChartData.pending, (state) => {
        state.loading = true;
      })
      .addCase(getChartData.fulfilled, (state, action) => {
        state.loading = false;
        state.failed = false;
        state.traceDataListModel = action.payload.response;
      })
      .addCase(getChartData.rejected, (state) => {
        // onsole.log('rejected', action);
        state.loading = false;
        state.failed = true;
      });
  },
});

export const selectChartLoading = (state: RootState) => state.chart.loading;

export const selectCharttFailed = (state: RootState) => state.chart.failed;

export const selectTraceDataList = (state: RootState) =>
  state.chart.traceDataListModel;

export default chartSlice.reducer;
