import os
from backend.lib.web_app import WebApplication
from backend.routes import routes


def run_application():
    root_folder = os.path.join(os.path.dirname(__file__), 'frontend')
    app = WebApplication('localhost', 8080, root_folder, routes)
    app.run()

if __name__ == '__main__':
    run_application()
