<template>
  <div class="field">

    <label v-if="label" class="label">{{ label }}</label>

    <p class="control is-medium has-icons-right"
        v-bind:class="{ 'is-loading': state == State.processing }">

      <input type="text"
          class="input is-medium"
          v-model="value"
          v-bind:class="{ 'is-danger': state == State.error }"
          :placeholder="placeholder"
          />

      <span v-if="state == State.done" class="icon is-right">
      <!-- TODO we could use a slot here -->
        OK
      </span>

    </p>

    <div class="help-container">
      <span v-if="state == State.done && successMsg"
          class="help is-success">{{ successMsg }}</span>
      <span v-if="state == State.error && errorMsg"
          class="help is-danger">{{ errorMsg }}</span>
    </div>

  </div>

</template>

/******************************************************************************/

<script>

const StateEnum = {
  idle: 1,
  processing: 2,
  done: 3,
  error: 4,
};

export default {
  name: 'InputTextVerbose',

  props: {
    label: String,
    initialValue: String,
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
      value: '',
      State: StateEnum,
      state: StateEnum.idle,
      errorMsg: '',
      timeout: undefined,
    }
  },

  watch: {
    initialValue: function () {
      this.value = this.initialValue;
    },

    value: function () {
      this.state = StateEnum.idle;
      this.errorMsg = '';

      if(!this.processFunc) {
        return;
      }

      if(this.timeout) {
        clearTimeout(this.timeout);
      }

      if(this.required && !this.value) {
        this.state = StateEnum.error;
        this.errorMsg = this.requiredMsg;
        return;
      }

      this.state = StateEnum.processing;

      this.timeout = setTimeout(async () => {
          try {
            await this.processFunc(this.value);
            this.state = StateEnum.done;
          }
          catch(e) {
            this.state = StateEnum.error;
            this.errorMsg = e;
          }
      }, this.debounce);
    }
  },
};
</script>

/******************************************************************************/

<style lang="scss" scoped>
@import "@/style.scss";

.help-container {
  padding-top: 0.2em;
  min-height: 1.7em;
}
</style>
