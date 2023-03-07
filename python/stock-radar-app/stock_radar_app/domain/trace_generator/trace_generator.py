from abc import ABC, abstractmethod
from datetime import date


class TraceData:
    def __init__(self, trace_type: str, x: list[date], y: dict[str, list[float]]):
        self.trace_type = trace_type
        self.x = x
        self.y = y
        assert isinstance(y, dict)
        for k, v in y.items():
            assert isinstance(k, str)
            assert isinstance(v, list)


class TraceGenerator(ABC):
    @abstractmethod
    def generate(self) -> TraceData:
        pass
