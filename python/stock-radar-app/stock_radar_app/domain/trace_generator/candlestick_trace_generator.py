from pandas.core.series import Series
from stock_radar_app.domain.trace_generator.trace_generator import TraceData


class CandlestickTraceGenerator:
    def __init__(
        self,
        x_data: Series,
        y_open: Series,
        y_high: Series,
        y_low: Series,
        y_close: Series,
    ) -> None:
        self.trace_data = TraceData(
            trace_type="candlestick",
            x=x_data.tolist(),
            y={
                "open": y_open.tolist(),
                "high": y_high.tolist(),
                "low": y_low.tolist(),
                "close": y_close.tolist(),
            },
        )

    def generate(self) -> TraceData:
        return self.trace_data
