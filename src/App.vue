<template>

<v-app>
  <v-navigation-drawer app>
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title class="title">
          <img src="./assets/logo.svg" width="80px" />
          <img src="./assets/textlogo.svg" width="120px" />
        </v-list-item-title>
        <!-- <v&#45;list&#45;item&#45;subtitle> -->
        <!--   subtext -->
        <!-- </v&#45;list&#45;item&#45;subtitle> -->
      </v-list-item-content>
    </v-list-item>

    <v-divider></v-divider>

    <v-list dense nav >
      <router-link to="/" class="router-link">
        <v-list-item link >
          <v-list-item-icon>
            <v-icon>mdi-plus</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>
              Schedule Event
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </router-link>

      <router-link to="/about" class="router-link">
        <v-list-item link >
          <v-list-item-icon>
            <v-icon>mdi-information</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>
              About
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </router-link>
    </v-list>

  </v-navigation-drawer>

  <!-- <v&#45;app&#45;bar app> -->
  <!--   <!&#45;&#45; &#45;&#45;> -->
  <!-- </v&#45;app&#45;bar> -->

  <v-main>
    <v-container fluid>
      <router-view></router-view>
    </v-container>
  </v-main>

  <!-- <v&#45;footer app> -->
  <!--   <!&#45;&#45; &#45;&#45;> -->
  <!-- </v&#45;footer> -->
</v-app>

</template>

/******************************************************************************/

<script>
export default {};

</script>

/******************************************************************************/

<style lang="scss" scoped>
@import "style.scss";
.router-link {
  text-decoration: none;
}

/* .router-link:not(.router-link-exact-active) { } */
/* .router-link-exact-active { }  */
/* a.logo { */
/*   text-decoration: none; */
/* } */
</style>
