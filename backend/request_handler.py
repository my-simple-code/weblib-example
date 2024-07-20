from backend.lib.web_app import RequestHandler
from backend.random_generator import employee

employee_list_map = dict()

def get_employee_list(handler: RequestHandler):
    data = handler.query_data()
    list_name = data['list_name'][0]
    if not list_name in employee_list_map:
        employee_list_map[list_name] = sorted([next(employee) for _ in range(15)], key=lambda x: x['name']+x['first_name'])
    
    data = dict(employee_list=employee_list_map[list_name])
    handler.write(data)

def get_employee_list_rendered(handler: RequestHandler):
    data = handler.query_data()
    list_name = data['list_name'][0]
    selected_id = int(data['selected_id'][0])
    if not list_name in employee_list_map:
        employee_list_map[list_name] = sorted([next(employee) for _ in range(15)], key=lambda x: x['name']+x['first_name'])
    
    employee_list=employee_list_map[list_name]
    row_template = '<tr class="clickable {0}" id="{1}"><td>{2}</td><td>{3}</td><td>{4}</td></tr>'
    rows = [row_template.format('selected' if row['id'] == selected_id else '', row['id'], row['name'], row['first_name'], row['birthday']) for row in employee_list]
    data = '\n'.join(rows)
    handler.write(data)

def get_employee_details_rendered(handler: RequestHandler):
    data = handler.query_data()
    list_name = data['list_name'][0]
    selected_id = int(data['selected_id'][0])
        
    employee_list=employee_list_map[list_name]
    employee = next((x for x in employee_list if x['id'] == selected_id), None)
    data = '---'
    if employee:
        data = '{0}, {1} ({2}) selected'.format(employee['name'], employee['first_name'], employee['birthday'])
    handler.write(data)

def delete_employee(handler: RequestHandler):
    data = handler.query_data()
    list_name = data['list_name'][0]
    id = data['id']

    employee_list_map[list_name] = [x for x in employee_list_map.get(list_name, []) if x['id'] != id]

    data = dict(employee_list=employee_list_map.get(list_name, []))
    handler.write(data)

def update_employee(handler: RequestHandler):
    data = handler.json_data()
    pass
