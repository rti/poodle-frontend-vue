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

export default {
  name: 'QueryCreate',
  components: {
    InputTextVerbose,
  },

  data() {
    return {
      queryName: this.$store.state.query.name,
    }
  },
  methods: {
    async processNameChange(value) {
        await this.$store.setQueryName(value);
    },
  },
}
</script>

/******************************************************************************/

<style lang="sass" scoped>
</style>
