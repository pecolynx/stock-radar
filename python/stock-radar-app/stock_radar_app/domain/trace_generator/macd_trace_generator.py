from pandas.core.series import Series
from stock_radar_app.domain.trace_generator.trace_generator import TraceData


def gen_macd(
    close: Series, fast_ema_period: int, slow_ema_period: int, signal_sma_period: int
) -> tuple[Series, Series]:
    macd = (
        close.ewm(span=fast_ema_period).mean() - close.ewm(span=slow_ema_period).mean()
    )
    signal = macd.rolling(signal_sma_period).mean()
    return macd, signal


class MacdTraceGenerator:
    def __init__(
        self,
        x_data: Series,
        close: Series,
        fast_ema_period=12,  # 短期EMAの期間
        slow_ema_period=26,  # 長期EMAの期間
        signal_sma_period=9,  # SMAを取る期間
    ) -> None:
        self.x = x_data
        self.close = close
        self.fast_ema_period = fast_ema_period
        self.slow_ema_period = slow_ema_period
        self.signal_sma_period = signal_sma_period

    def generate(self) -> TraceData:
        macd, signal = gen_macd(
            self.close,
            self.fast_ema_period,
            self.slow_ema_period,
            self.signal_sma_period,
        )
        return TraceData(
            trace_type="macd",
            x=self.x.tolist(),
            y={
                "macd": macd.fillna(-9999).tolist(),
                "signal": signal.fillna(-9999).tolist(),
            },
        )
