from typing import List
from backend.lib.web_app import Route, mime_types, put, static_file_handler, get, delete
from backend.request_handler import (delete_employee, get_template_rendered,
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

app_data_handlers: List[Route] = [
    get("/employee", get_employee_list),
    put("/employee", update_employee),
    delete("/employee", delete_employee)
]

app_dyn_html_handlers: List[Route] = [
    get("/render/template", get_template_rendered, mime=mime_types['html']),
    get("/render/employee", get_employee_list_rendered, mime=mime_types['html']),
    get("/render/employee/details", get_employee_details_rendered, mime=mime_types['html'])
]

routes: List[Route] = [*static_handlers, *app_data_handlers, *app_dyn_html_handlers]
