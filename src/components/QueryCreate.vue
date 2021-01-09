<template>
  <div>
    <h1 class="title">Create a query</h1>
    <InputTextVerbose
        required="true"
        label="Give it a name"
        placeholder="e.g. Remote Family Dinner"
        success-msg="Cool, this looks good."
        required-msg="You really need to provide a name here."
        :initialValue="restoredName"
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
      restoredName: null,
    }
  },

  async created() {
    let query_id = this.$cookies.get('QueryCreate_unfinished_query_id');

    if(query_id) {
      this.query = await backend.getQuery(query_id);
      this.restoredName = this.query.name;
    }
  },

  methods: {
    async processNameChange(value) {
      this.query = await backend.setQueryName(value, this.query);
      this.$cookies.set('QueryCreate_unfinished_query_id', this.query.id);
    },
  },
}
</script>

/******************************************************************************/

<style lang="sass" scoped>
</style>
