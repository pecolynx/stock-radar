import logging

from dependency_injector import containers, providers
from stock_radar_app.gateway.database import Database
from stock_radar_app.gateway.repository_factory import RepositoryFactory
from stock_radar_app.usecase.user_usecase_chart import UserUsecaseChart

logger = logging.getLogger(__name__)


def repository_factory_func(session) -> RepositoryFactory:
    return RepositoryFactory(session)


class Container(containers.DeclarativeContainer):
    logger.info("Container")
    wiring_config = containers.WiringConfiguration(
        packages=["stock_radar_app.controller"]
    )

    # config = providers.Configuration(yaml_files=[config.config_file_path])
    config = providers.Configuration()

    # print(config.db.url)

    db = providers.Singleton(Database, db_url=config.db.url)
    user_usecase_chart = providers.Factory(
        UserUsecaseChart,
        session_factory=db.provided.session,
        repository_factory_func=repository_factory_func,
    )
