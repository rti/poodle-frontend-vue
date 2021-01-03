<template>
<div>
  <h1 class="title">Schedule an event</h1>
  <div class="field">
    <p class="control is-medium has-icons-right"
        v-bind:class="{ 'is-loading': loading }">
      <input v-model="name" @input="handleInput"
          class="input is-medium" type="text" placeholder="Name your event" />
      <span v-if="saved" class="icon is-right">
        OK
      </span>
    </p>
  </div>
</div>
</template>

/******************************************************************************/

<script>
export default {
  data() {
    return {
      name: '',
      saved: false,
      loading: false,
      json: undefined,
      timeout: undefined,
      abortController: undefined,
    }
  },
  methods: {

    createOrUpdate() {
      let url;
      let method;

      if(!this.json) {
        console.log('starting POST');
        url = 'http://localhost:8000/app/queries/';
        method = 'POST';
      }
      else {
        console.log('starting PATCH');
        url = 'http://localhost:8000/app/queries/' + this.json.id + '/';
        method = 'PATCH';
      }

      this.abortController = new AbortController();

      fetch(url, { 
          method: method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({'name':this.name}),
          signal: this.abortController.signal })

      .then((res) => {
        if (!res.ok) {
          throw Error(res.statusText);
        }
        return res.json();
      })
      .then((data) => {
        this.json = data;
        this.saved = true; 
        console.log(this.json);
      })

      .catch((e) => {
        console.log('error ' + e);
      });

      this.loading = false;
    },

    handleInput() {
      this.saved = false;

      if(this.name.length) {
        this.loading = true;

        console.log('clearing timeout');
        clearTimeout(this.timeout);

        if(this.abortController) {
          console.log('aborting request via abortController');
          this.abortController.abort();
        }

        this.timeout = setTimeout(() => { this.createOrUpdate(); }, 200);
      }
    }
  }
};
</script>

/******************************************************************************/

<style lang="scss" scoped>
@import "@/style.scss";
</style>
