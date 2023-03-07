from sqlalchemy.orm import Session
from stock_radar_app.gateway.stock_price_history_repository import (
    StockPriceHistoryRepository,
)
from stock_radar_app.service.irepository_factory import (
    IRepositoryFactory,
    IStockPriceHistoryRepository,
)


class RepositoryFactory(IRepositoryFactory):
    def __init__(self, session: Session):
        self._session = session

    def new_stock_price_history_repository(self) -> IStockPriceHistoryRepository:
        return StockPriceHistoryRepository(self._session)
