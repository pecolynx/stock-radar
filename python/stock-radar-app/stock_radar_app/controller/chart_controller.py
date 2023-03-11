import logging
import traceback

from dependency_injector.wiring import Provide, inject
from fastapi import APIRouter, Depends, HTTPException
from opentelemetry import trace
from pydantic import BaseModel
from stock_radar_app.config.container import Container
from stock_radar_app.domain.stock_price_history import StockPriceHistory
from stock_radar_app.domain.trace_generator.trace_generator import TraceData

# from finance_app.domain.workbook import Workbook
from stock_radar_app.usecase.user_usecase_chart import (
    BollingerBandOptions,
    MacdOptions,
    SmaOptions,
    UserUsecaseChart,
)

router = APIRouter()
logger = logging.getLogger(__name__)
tracer = trace.get_tracer(__name__)


class TraceDataHTTPEntity(BaseModel):
    trace_type: str
    x: list[str]
    y: dict[str, list[float]]


class TraceDataListHTTPEntity(BaseModel):
    list: list[TraceDataHTTPEntity]


@router.get(
    "/chart/data/{brand_id}",
    response_model=TraceDataListHTTPEntity,
    tags=["chart"],
)
@inject
def get_chart_data(
    brand_id: int,
    user_usecase_chart: UserUsecaseChart = Depends(
        Provide[Container.user_usecase_chart]
    ),
) -> TraceDataListHTTPEntity:
    # span.set_attribute("workbook_id", workbook_id)
    logger.info(f"get_workbook. brand_id: {brand_id}")

    try:
        trace_data_list = user_usecase_chart.get_chart_data(
            brand_id,
            sma=SmaOptions(window_list=[5, 25]),
            macd=MacdOptions(
                fast_ema_period=12,
                slow_ema_period=26,
                signal_sma_period=9,
            ),
            bollinger_band=BollingerBandOptions(
                window=25,
                sigma_list=[1, 2, 3],
            ),
        )

        trace_data_http_entity_list = [
            trace_data_to_trace_data_http_entity(n) for n in trace_data_list
        ]
        list_entity = TraceDataListHTTPEntity(
            list=trace_data_http_entity_list,
        )
        print("response========================aa")
        # print(list_entity)
        return list_entity
    # except WorkbookNotFoundError:
    #     raise HTTPException(status_code=404, detail="item_not_found")
    except Exception as e:
        logger.error(str(e))
        logger.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail="internal server error")


def trace_data_to_trace_data_http_entity(data: TraceData) -> TraceDataHTTPEntity:
    x: list[str] = list(map(lambda n: n.strftime("%Y-%m-%d"), data.x))
    return TraceDataHTTPEntity(trace_type=data.trace_type, x=x, y=data.y)


def stock_price_history_to_trace_data_http_entity(
    data: StockPriceHistory,
) -> TraceDataHTTPEntity:
    x: list[str] = list(map(lambda n: n.strftime("%Y-%m-%d"), data.x_date.tolist()))
    y: dict[str, list[float]] = {
        "open": data.y_open.tolist(),
        "high": data.y_high.tolist(),
        "low": data.y_low.tolist(),
        "close": data.y_close.tolist(),
    }
    return TraceDataHTTPEntity(type="candlestick", x=x, y=y)
