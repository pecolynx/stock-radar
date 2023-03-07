from abc import ABC, abstractmethod

from stock_radar_app.service.istock_price_history_repository import (
    IStockPriceHistoryRepository,
)


class IRepositoryFactory(ABC):
    @abstractmethod
    def new_stock_price_history_repository(self) -> IStockPriceHistoryRepository:
        pass
