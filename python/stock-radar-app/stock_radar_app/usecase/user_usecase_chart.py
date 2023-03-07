from collections.abc import Callable
from contextlib import AbstractContextManager

from sqlalchemy.orm import Session
from stock_radar_app.domain.stock_price_history import StockPriceHistory
from stock_radar_app.domain.trace_generator.bollinger_band_trace_generator import (
    BollingerBandTraceGenerator,
)
from stock_radar_app.domain.trace_generator.candlestick_trace_generator import (
    CandlestickTraceGenerator,
)
from stock_radar_app.domain.trace_generator.macd_trace_generator import (
    MacdTraceGenerator,
)
from stock_radar_app.domain.trace_generator.sma_trace_generator import SmaTraceGenerator
from stock_radar_app.domain.trace_generator.trace_generator import TraceData
from stock_radar_app.gateway.repository_factory import RepositoryFactory
from stock_radar_app.service.istock_price_history_repository import (
    IStockPriceHistoryRepository,
)


class SmaOptions:
    def __init__(self, window_list: list[int]) -> None:
        self.window_list = window_list


class MacdOptions:
    def __init__(
        self, fast_ema_period: int, slow_ema_period: int, signal_sma_period: int
    ) -> None:
        self.fast_ema_period = fast_ema_period
        self.slow_ema_period = slow_ema_period
        self.signal_sma_period = signal_sma_period


class BollingerBandOptions:
    def __init__(self, window: int, sigma_list: list[int]) -> None:
        self.window = window
        self.sigma_list = sigma_list


class UserUsecaseChart:
    def __init__(
        self,
        session_factory: Callable[..., AbstractContextManager[Session]],
        repository_factory_func: Callable[[Session], RepositoryFactory],
    ) -> None:
        self._session_factory = session_factory
        self._repository_factory_func = repository_factory_func

    def get_chart_data(
        self,
        brand_id: int,
        sma: SmaOptions = None,
        macd: MacdOptions = None,
        bollinger_band: BollingerBandOptions = None,
    ) -> list[TraceData]:
        stock_price_history = self._get_stock_price_history(brand_id=brand_id)

        trace_data_list: list[TraceData] = [
            CandlestickTraceGenerator(
                stock_price_history.x_date,
                stock_price_history.y_open,
                stock_price_history.y_high,
                stock_price_history.y_low,
                stock_price_history.y_close,
            ).generate()
        ]

        if sma:
            trace_data = SmaTraceGenerator(
                stock_price_history.x_date, stock_price_history.y_close, sma.window_list
            ).generate()
            trace_data_list.append(trace_data)
        if macd:
            trace_data = MacdTraceGenerator(
                stock_price_history.x_date,
                stock_price_history.y_close,
                macd.fast_ema_period,
                macd.slow_ema_period,
                macd.signal_sma_period,
            ).generate()
            trace_data_list.append(trace_data)
        if bollinger_band:
            trace_data = BollingerBandTraceGenerator(
                stock_price_history.x_date,
                stock_price_history.y_close,
                bollinger_band.window,
                bollinger_band.sigma_list,
            ).generate()
            trace_data_list.append(trace_data)

        return trace_data_list

    def _get_stock_price_history(self, brand_id: int) -> StockPriceHistory:
        with self._session_factory() as session:
            assert isinstance(session, Session)
            rf = self._repository_factory_func(session)
            stock_price_history_repo: IStockPriceHistoryRepository = (
                rf.new_stock_price_history_repository()
            )

            stock_price_history: StockPriceHistory = (
                stock_price_history_repo.find_stock_price_history_by_brand_id(
                    brand_id=brand_id
                )
            )
            session.commit()
            return stock_price_history
