<template>
  <div>
    <div class="title">Schedule a new event</div>

    <InputTextVerbose
        required="true"
        label="What are you planning?"
        placeholder="e.g. remote family dinner"
        success-msg="Cool, this looks good."
        required-msg="You really need to provide a name here."
        :disabled="state == State.restoring"
        :initialValue="restoredName"
        :process-func="processNameChange"
        />

  </div>
</template>

/******************************************************************************/

<script>
import InputTextVerbose from '@/components/InputTextVerbose.vue';
import backend from '@/core/backend.js';

const StateEnum = {
  idle: 1,
  restoring: 2,
};

export default {
  name: 'QueryCreate',

  components: {
    InputTextVerbose,
  },

  data() {
    return {
      query: null,
      restoredName: null,
      State: StateEnum,
      state: StateEnum.idle,
    }
  },

  async created() {
    let query_id = this.$cookies.get('QueryCreate_unfinished_query_id');

    if(query_id) {
      this.state = StateEnum.restoring;
      this.query = await backend.getQuery(query_id);
      this.restoredName = this.query.name;
      this.state = StateEnum.idle;
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
