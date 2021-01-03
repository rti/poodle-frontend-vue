<template>
<section class="hero is-fullheight is-light">

  <!-- Hero head: will stick at the top -->
  <div class="hero-head">
    <div class="container">
      <div class="level is-mobile px-2 py-2">
        <div class="level-left">
          <a href="/">
            <h1 class="level-item title">vue2-webpack4-bulma-frontend</h1>
          </a>
        </div>
        <div class="level-right">
          <router-link class="router-link level-item" to="/">
            Home
          </router-link>
          <router-link class="router-link level-item" to="/about">
            About
          </router-link>
        </div>
      </div>
    </div>
  </div>

  <!-- Hero content: will be in the middle -->
  <div class="hero-body is-fullheight-with-navbar">
    <div class="container">
      <router-view></router-view>
    </div>
  </div>

</section>
</template>

/******************************************************************************/

<script>
export default {};

</script>

/******************************************************************************/

<style lang="scss">
@import "@/style.scss";

.router-link {
  @extend .button;
}

.router-link:not(.router-link-exact-active) {

}

.router-link-exact-active {
  @extend .is-primary;
}
</style>
