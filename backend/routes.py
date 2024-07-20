from typing import List
from backend.lib.web_app import Route, mime_types, put, static_file_handler, get, delete
from backend.request_handler import (delete_employee,
                                     update_employee,
                                     get_employee_details_rendered,
                                     get_employee_list,
                                     get_employee_list_rendered)


static_handlers: List[Route] = [
    get("/", static_file_handler),
    get("*.html", static_file_handler),
    get("*.css", static_file_handler),
    get("*.js", static_file_handler)
]

app_handlers: List[Route] = [
    get("/employee", get_employee_list),
    get("/render/employee", get_employee_list_rendered, mime=mime_types['html']),
    get("/render/employee/details", get_employee_details_rendered, mime=mime_types['html']),
    delete("/employee", delete_employee),
    put("/employee", update_employee)
]

routes: List[Route] = [*static_handlers, *app_handlers]
