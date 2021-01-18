<template>
  <!-- TODO why do we need the label when we have v-bind="$attrs"? -->
  <v-text-field
    solo
    v-model="value"
    v-bind="$attrs"
    :label="label"
    :append-icon="state == State.done ? 'mdi-check' : ''"
    :loading="state == State.processing"
    :error="state == State.error"
    :error-messages="state == State.error ? errorMsg : ''"
    :success="state == State.done"
    :success-messages="state == State.done ? successMsg : ''"
    />
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
.field .help-container {
  padding-top: 0.2em;
  min-height: 1.7em;
}
</style>
