# poetry_requirements(
#     name="poetry",
#     source="empty.pyproject.toml",
# )

pex_binary(
    name="stock-radar-app",
    entry_point="stock_radar_app/main.py",
    dependencies=[
        "python/stock-radar-app/stock_radar_app",
    ],
    restartable=True,
)

python_sources(
    name="stock_radar_app",
)

docker_image(
    name="docker",
    image_tags=["{build_args.GIT_COMMIT}"],
    repository="stock-radar-app",
)
