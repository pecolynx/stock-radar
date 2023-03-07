import pandas

# from sqlalchemy import Column, Integer, Text
from sqlalchemy.orm import Session
from stock_radar_app.domain.stock_price_history import StockPriceHistory
from stock_radar_app.service.istock_price_history_repository import (
    IStockPriceHistoryRepository,
)

#
# from finance_app.domain.workbook import Workbook
# from finance_app.gateway.database import Base
# from finance_app.service.iworkbook_repository import (
#     IWorkbookRepository,
#     WorkbookAddParameter,
#     WorkbookNotFoundError,
# )
#
#
# class WorkbookDBEntity(Base):
#     __tablename__ = "workbook"
#
#     id = Column(Integer, primary_key=True)
#     name = Column(Text, nullable=False)
#     lang2 = Column(Text, nullable=False)
#
#     def to_model(self) -> Workbook:
#         return Workbook(workbook_id=self.id, name=self.name, lang2=self.lang2)


class StockPriceHistoryRepository(IStockPriceHistoryRepository):
    def __init__(self, session: Session):
        self._session = session
        df7230 = pandas.read_csv("data/7230.T.csv")
        self._stock_price_history7230 = StockPriceHistory(
            pandas.to_datetime(df7230.timestamp, unit="ms"),
            df7230["open"],
            df7230["high"],
            df7230["low"],
            df7230["close"],
            df7230["volume"],
        )

        df5801 = pandas.read_csv("data/5801.T.csv")
        self._stock_price_history5801 = StockPriceHistory(
            pandas.to_datetime(df5801.timestamp, unit="ms"),
            df5801["open"],
            df5801["high"],
            df5801["low"],
            df5801["close"],
            df5801["volume"],
        )

    def find_stock_price_history_by_brand_id(self, brand_id: int) -> StockPriceHistory:
        return self._stock_price_history5801


#     def find_workbook_by_id(self, workbook_id: int) -> Workbook:
#         workbook_entity: WorkbookDBEntity = (
#             self.__session.query(WorkbookDBEntity)
#             .filter(WorkbookDBEntity.id == workbook_id)
#             .first()
#         )
#         if workbook_entity is None:
#             raise WorkbookNotFoundError("id", str(workbook_id))
#         return workbook_entity.to_model()
#
#     def find_workbook_by_name(self, name: str) -> Workbook:
#         workbook_entity: WorkbookDBEntity = (
#             self.__session.query(WorkbookDBEntity)
#             .filter(WorkbookDBEntity.name == name)
#             .first()
#         )
#         if workbook_entity is None:
#             raise WorkbookNotFoundError("name", name)
#         return workbook_entity.to_model()
#
#     def add_workbook(self, workbook_add_param: WorkbookAddParameter) -> None:
#         workbook_entity = WorkbookDBEntity(
#             name=workbook_add_param.name, lang2=workbook_add_param.lang2
#         )
#         self.__session.add(workbook_entity)
