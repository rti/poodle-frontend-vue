<template>
  <div>
    <h1 class="title">Create a query</h1>
    <InputTextVerbose
        placeholder="Give it a name"
        required="true"
        success-msg="Cool, this looks good."
        required-msg="You really need to provide a name here."
        :process-func="processNameChange" />

  </div>
</template>

/******************************************************************************/

<script>
import InputTextVerbose from '@/components/InputTextVerbose.vue';
import backend from '@/core/backend.js';

export default {
  name: 'QueryCreate',

  components: {
    InputTextVerbose,
  },

  data() {
    return {
      query: null,
    }
  },

  methods: {
    async processNameChange(value) {
      this.query = await backend.setQueryName(value, this.query);
    },
  },
}
</script>

/******************************************************************************/

<style lang="sass" scoped>
</style>
