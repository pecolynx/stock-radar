from pandas.core.series import Series
from stock_radar_app.domain.trace_generator.trace_generator import (
    TraceData,
    TraceGenerator,
)


class SmaTraceGenerator(TraceGenerator):
    def __init__(
        self,
        x_data: Series,
        close: Series,
        window_list: list[int],
    ) -> None:
        self.x = x_data
        self.close = close
        self.window_list = window_list

    def generate(self) -> TraceData:
        def gen(window: int) -> Series:
            sma = self.close.rolling(window=window).mean()
            return sma

        y: dict[str, list[float]] = {}
        for w in self.window_list:
            y[str(w)] = gen(w).fillna(-9999).tolist()

        return TraceData(trace_type="sma", x=self.x.tolist(), y=y)
