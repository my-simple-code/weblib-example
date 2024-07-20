class Http {
    async get(url, data = undefined) { return await fetch(this.append_url_query(url, data), { method: "GET" });}
    async get_text(url, data = undefined) { return await (await this.get(url, data)).text();}
    async get_json(url, data = undefined) { return await (await this.get(url, data)).json();}

    async delete(url, data = undefined) { return await fetch(this.append_url_query(url, data), { method: "DELETE" });}
    async delete_text(url, data = undefined) { return await (await this.delete(url, data)).text();}
    async delete_json(url, data = undefined) { return await (await this.delete(url, data)).json();}

    async put(url, data = {}) { return await fetch(url, { method: "PUT", body: JSON.stringify(data) });}
    async put_text(url, data = undefined) { return await (await this.put(url, data)).text();}
    async put_json(url, data = undefined) { return await (await this.put(url, data)).json();}

    async post(url, data = {}) { return await fetch(url, { method: "POST", body: JSON.stringify(data) });}
    async post_text(url, data = undefined) { return await (await this.post(url, data)).text();}
    async post_json(url, data = undefined) { return await (await this.post(url, data)).json();}

    append_url_query(url, data = undefined) {
        // no body data for get&delete
        if (data !== undefined) {
            var query = Object.keys(data).map(key => `${key}=${data[key]}`).join('&');
            url = url.indexOf('?') === -1 ? `${url}?${query}` : `${url}&${query}`;
        }
        return url;
    }
}
export const http = new Http();
