const baseUrl = 'http://localhost:8000/app/';
const queryUrl = baseUrl + 'queries/';

const store = {
  debug: true,

  state: {
    query: {
      name: {
        value: '',
        loading: '',
        saved: '',
        timeout: undefined,
        abortController: undefined,
      },
    },
  },

  apiState: {
    query: undefined,
  },

  setQueryName(v){
    if(this.debug){
      console.log('setQueryName ', v);
    }

    let stateName = this.state.query.name;

    stateName.value = v;
    stateName.saved = false;

    if(!v.length) {
      return;
    }

    stateName.loading = true;

    clearTimeout(stateName.timeout);
    
    if(stateName.abortController) {
      stateName.abortController.abort();
    }

    stateName.timeout = setTimeout(() => {
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

      fetch(url, { 
          method: httpMethod,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 'name': stateName.value }),
          signal: stateName.abortController.signal })

      .then((res) => {
        if (!res.ok) {
          throw Error(res.statusText);
        }
        return res.json();
      })

      .then((data) => {
        this.apiState.query = data;
        stateName.saved = true; 
        console.log(data);
      })

      .catch((e) => {
        console.log('error ' + e);
      });

      stateName.loading = false;

    }, 200);
  }
}

export default store;

