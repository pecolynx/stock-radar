from pandas.core.series import Series


class StockPriceHistory:
    def __init__(
        self,
        x_date: Series,
        y_open: Series,
        y_high: Series,
        y_low: Series,
        y_close: Series,
        y_volume: Series,
    ):
        self.x_date = x_date
        self.y_open = y_open
        self.y_high = y_high
        self.y_low = y_low
        self.y_close = y_close
        self.y_volume = y_volume
