import talib
from pandas.core.series import Series
from stock_radar_app.domain.trace_generator.trace_generator import (
    TraceData,
    TraceGenerator,
)


class BollingerBandTraceGenerator(TraceGenerator):
    def __init__(
        self,
        x_data: Series,
        close: Series,
        window: int,
        sigma_list: list[int],
    ) -> None:
        self.x = x_data
        self.close = close
        self.window = window
        self.sigma_list = sigma_list

    def generate(self) -> TraceData:
        moving_average_type = 0  # 移動平均線の種類

        def gen(sigma: int) -> list[Series]:
            bb_up, bb_middle, bb_down = talib.BBANDS(
                self.close,  # 外為相場終値
                self.window,
                sigma,  # upper-band導出に採用する標準偏差
                sigma,  # down-band導出に採用する標準偏差
                moving_average_type,  # 移動平均線の種類
            )
            return [bb_up, bb_middle, bb_down]

        y: dict[str, list[float]] = {}
        for sigma in self.sigma_list:
            up, middle, down = gen(sigma)
            if y.get("BB center") is None:
                y["BB center"] = middle.fillna(-9999).tolist()
            y[f"{sigma}σ"] = up.fillna(-9999).tolist()
            y[f"-{sigma}σ"] = down.fillna(-9999).tolist()

        return TraceData(trace_type="bollinger_band", x=self.x.tolist(), y=y)
