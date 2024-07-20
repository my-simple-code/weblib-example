import { http } from '../lib/http.js';
import { store } from './store.js';

export class ActionCreator {
    async get_emploee_list(weekday) {
        store.employee_list = [];
        const data = await http.get_json('/employee', {list_name:weekday});
        if ('error' in data) {
            store.error = data.error;
        }
        else {
            store.employee_list = data.employee_list;
        }
    }

    async get_emploee_list_rendered(weekday, selectedId) {
        return await http.get_text('/render/employee', {list_name:weekday, selected_id: selectedId});
    }

    async get_emploee_details_rendered(weekday, selectedId) {
        return await http.get_text('/render/employee/details', {list_name:weekday, selected_id: selectedId});
    }
}

export const action = new ActionCreator();
