const baseUrl = 'http://localhost:8000/app/';
const queryUrl = baseUrl + 'queries/';

export default {
  abortController: null,

  async apiReqest(url, method = 'GET', data = null) {
    if(this.abortController) {
      this.abortController.abort();
    }

    this.abortController = new AbortController();

    let options = {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      signal: this.abortController.signal,
    }

    if(data && ['POST', 'PUT', 'PATCH'].includes(method)) {
      options['body'] = JSON.stringify(data);
    }

    const res = await fetch(url, options);

    if(!res.ok) {
      throw Error(res.statusText);
    }

    return await res.json();
  },

  async getQuery(query_id) {
    let url = queryUrl + query_id + '/';
    return await this.apiReqest(url);
  },

  async setQueryName(value, query = null) {
    if(!value.length) {
      return;
    }

    let url;
    let method;

    if(query) {
      method = 'PATCH';
      url = queryUrl + query.id + '/';
    }
    else {
      method = 'POST';
      url = queryUrl;
    }

    return await this.apiReqest(url, method, {name:value});
  }
}
