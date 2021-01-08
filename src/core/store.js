const baseUrl = 'http://localhost:8000/app/';
const queryUrl = baseUrl + 'queries/';

const store = {
  debug: true,

  state: {
    query: {
      name: {
        abortController: undefined,
      },
    },
  },

  apiState: {
    query: undefined,
  },

  async setQueryName(value){
    if(this.debug){
      console.log('setQueryName ', value);
    }

    let stateName = this.state.query.name;

    if(!value.length) {
      return;
    }

    if(stateName.abortController) {
      stateName.abortController.abort();
    }

    let httpMethod;
    let url;

    if(this.apiState.query) {
      httpMethod = 'PATCH';
      url = queryUrl + this.apiState.query.id + '/';
    }
    else {
      httpMethod = 'POST';
      url = queryUrl;
    }

    if(this.debug) {
      console.log('starting ' + httpMethod + ' request to ' + url);
    }

    stateName.abortController = new AbortController();

    const res = await fetch(url, {
        method: httpMethod,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 'name': value }),
        signal: stateName.abortController.signal });

    if(!res.ok) {
      throw Error(res.statusText);
    }

    const json = await res.json();

    console.log(json);

    this.apiState.query = json;
  }
}

export default store;

