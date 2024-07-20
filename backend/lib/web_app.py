from __future__ import annotations
import json
import os
from typing import List
from urllib.parse import urlparse, parse_qs
from http import HTTPStatus
from http.server import HTTPServer, BaseHTTPRequestHandler


mime_types = dict(
    html='text/html',
    css='text/css',
    js='application/x-javascript',
    json='application/json')


class Route():
    def __init__(self, method, path, handler, mime=None):
        self.method = method
        self.path = path
        self.handler = handler
        if path == '/' and mime is None:
            self.mime = mime_types.get('html')
        else:
            self.mime = mime or mime_types.get(path.split('.')[-1], 'application/json')

def get(path, haendler, mime=None):
    return Route("GET", path, haendler, mime)

def put(path, haendler, mime='application/json'):
    return Route("PUT", path, haendler, mime)

def post(path, haendler, mime='application/json'):
    return Route("POST", path, haendler, mime)

def delete(path, haendler, mime='application/json'):
    return Route("DELETE", path, haendler, mime)

def static_file_handler(handler: RequestHandler):
    parts = ['index.html'] if handler.path == '/' else handler.path.lstrip('/').split('/')
    if '..' in parts: # prevent leaving the root directory 
        return
    file_path = os.path.join(handler.root_folder, *parts)
    file_content = None
    if os.path.exists(file_path):
        with open(file_path, 'rb') as f:
            file_content = f.read()
    handler.write(file_content)

class RequestHandler(BaseHTTPRequestHandler):
    root_folder = None
    routes: List[Route]=[]
    mime: str = ''
    
    _query_data = None
    _form_data = None
    _json_data = None
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def log_message(self, format, *args):
        return

    def log_request(self, code='-', size='-'):
        return

    def do_GET(self):
        route = self.get_route('GET')
        if route is not None:
            self.mime = route.mime
            route.handler(self)
        else:
            self.send_error(HTTPStatus.NOT_FOUND, "File not found")

    def do_DELETE(self):
        route = self.get_route('DELETE')
        if route is not None:
            self.mime = route.mime
            route.handler(self)
        else:
            self.send_error(HTTPStatus.NOT_FOUND, "File not found")
    
    def do_POST(self):
        route = self.get_route('POST')
        if route is not None:
            self.mime = route.mime
            route.handler(self)
        else:
            self.send_error(HTTPStatus.NOT_FOUND, "File not found")
    
    def do_PUT(self):
        route = self.get_route('PUT')
        if route is not None:
            self.mime = route.mime
            route.handler(self)
        else:
            self.send_error(HTTPStatus.NOT_FOUND, "File not found")
    
    def write(self, data):
        self.send_head()
        if type(data) is dict or type(data) is list:
            self.wfile.write(str.encode(json.dumps(data)))
        elif type(data) is str:
            self.wfile.write(data.encode())
        else:
            self.wfile.write(data or b'')

    def get_route(self, method: str) -> Route:
        pattern_list = [self.path, "*.{0}".format(self.path.split('.')[-1]), "{0}".format(self.path.split('?')[0])]
        for pattern in pattern_list:
            route = next((r for r in RequestHandler.routes if r.method == method and r.path == pattern), None)
            if route is not None:
                return route
        return None
    
    def send_head(self):
        self.send_response(HTTPStatus.OK)
        self.send_header("Content-type", self.mime)
        self.end_headers()

    def query_data(self):
        if self._query_data is None:
            self._query_data = parse_qs(urlparse(self.path).query)
            #for key in self._query_data.keys():
            #    if isinstance(self._query_data[key], list) and len(self._query_data[key]) == 1:
            #        self._query_data[key] = self._query_data[key][0]
        return self._query_data
    
    def form_data(self):
        if self._form_data is None:
            length = int(self.headers.get('content-length'))
            field_data = self.rfile.read(length)
            self._form_data = parse_qs(str(field_data,"UTF-8"))
        return self._form_data
    
    def json_data(self):
        if self._json_data is None:
            length = int(self.headers.get('content-length'))
            field_data = self.rfile.read(length)
            self._json_data = json.loads(str(field_data, "utf-8"))
        return self._json_data

    
class WebApplication():
    def __init__(self, host: str, port: int, root_folder: str, routes: List[Route]):
        self.host = host
        self.port = port
        self.server_address = (host, port)
        RequestHandler.root_folder = root_folder
        RequestHandler.routes = routes

    def run(self): 
        server = HTTPServer(self.server_address, RequestHandler)
        print('Starting server http://{0}:{1}'.format(self.host, self.port))
        server.serve_forever()
