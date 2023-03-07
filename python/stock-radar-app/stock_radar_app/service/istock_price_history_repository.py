from abc import ABC, abstractmethod

from stock_radar_app.domain.stock_price_history import StockPriceHistory

# from python_postgresql.domain.workbook import Workbook
#
#
# class WorkbookNotFoundError(Exception):
#     def __init__(self, key: str, value: str):
#         self.key = key
#         self.value = value
#
#
# class WorkbookAddParameter(BaseModel):
#     name: str = Field(..., min_length=1, max_length=20)
#     lang2: str = Field(..., min_length=2, max_length=2)
#     #
#     # def __init__(self, name: str):
#     #     self.name = name


class IStockPriceHistoryRepository(ABC):
    @abstractmethod
    def find_stock_price_history_by_brand_id(self, brand_id: int) -> StockPriceHistory:
        pass


#
#     @abstractmethod
#     def find_workbook_by_name(self, name: str) -> Workbook:
#         pass
#
#     @abstractmethod
#     def add_workbook(self, workbook_add_param: WorkbookAddParameter) -> None:
#         pass
