<template>
  <div class="field">

    <label v-if="label" class="label">{{ label }}</label>

    <p class="control is-medium has-icons-right"
        v-bind:class="{ 'is-loading': processing }">

      <input type="text"
          class="input is-medium"
          v-bind:class="{ 'is-danger': error }"
          :placeholder="placeholder"
          @input="handleInput" />

      <span v-if="done" class="icon is-right">
      <!-- TODO we could use a slot here -->
        OK
      </span>

    </p>

    <div class="help-container">
      <span v-if="done && successMsg" class="help is-success">{{ successMsg }}</span>
      <span v-if="error && errorMsg" class="help is-danger">{{ errorMsg }}</span>
    </div>

  </div>

</template>

/******************************************************************************/

<script>
export default {
  name: 'InputTextVerbose',
  props: {
    label: String,
    placeholder: String,
    successMsg: String,
    required: {
      type: String, // so we do not need to use v-bind to force bool
      default: null,
    },
    requiredMsg: {
      type: String,
      default: 'Value required',
    },
    processFunc: Function,
    debounce: {
      type: Number,
      default: 250,
    },
  },

  data() {
    return {
      processing: false,
      done: false,
      error: false,
      errorMsg: '',
      timeout: undefined,
    }
  },

  methods: {
    handleInput(e) {
      let value = e.target.value;

      this.done = false;
      this.error = false;
      this.errorMsg = '';
      this.processing = false;

      if(!this.processFunc) {
        return;
      }

      if(this.timeout) {
        clearTimeout(this.timeout);
      }

      if(this.required && !value) {
        this.error = true;
        this.errorMsg = this.requiredMsg;
        return;
      }

      this.processing = true;

      this.timeout = setTimeout(async () => {
          try {
            await this.processFunc(value);
            this.done = true;
          }
          catch(e) {
            this.error = true;
            this.errorMsg = e;
            console.log(e);
          }

          this.processing = false;

      }, this.debounce);
    }
  }
};
</script>

/******************************************************************************/

<style lang="scss" scoped>
@import "@/style.scss";
</style>
