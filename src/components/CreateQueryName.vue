<template>
<div>
  <h1 class="title">Schedule an event</h1>
  <div class="field">
    <p class="control is-medium has-icons-right"
        v-bind:class="{ 'is-loading': queryName.loading }">
      <input @input="handleInput"
          class="input is-medium" type="text" placeholder="Name your event" />
      <span v-if="queryName.saved" class="icon is-right">
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
      queryName: this.$store.state.query.name,
    }
  },
  methods: {
    handleInput(e) {
      this.$store.setQueryName(e.target.value);
    }
  }
};
</script>

/******************************************************************************/

<style lang="scss" scoped>
@import "@/style.scss";
</style>
