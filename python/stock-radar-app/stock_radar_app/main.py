import importlib.resources
import os

import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from stock_radar_app.controller import healthcheck_controller

debug_mode = os.getenv("DEBUG_MODE")

if debug_mode:
    config_text = ""
else:
    config_text = importlib.resources.read_text("stock_radar_app.config", "config.yml")
print(config_text)

# config_file_path = os.getenv(
#     "CONFIG_FILE_PATH", "python/stock-radar-app/stock_radar_app/config/config.yml"
# )
# statics_dir_path = os.getenv("STATICS_DIR_PATH")

app = FastAPI()
origins = [
    "http://localhost:5173",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(healthcheck_controller.router)

if debug_mode:
    app.mount(
        "", StaticFiles(directory="stock_radar_app/statics", html=True), name="static"
    )
else:
    app.mount("", StaticFiles(packages=["stock_radar_app"], html=True), name="static")


def main():
    uvicorn.run("stock_radar_app.main:app", host="0.0.0.0", port=8000, reload=True)


if __name__ == "__main__":
    main()
