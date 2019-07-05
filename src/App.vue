<template>
  <v-app>
    <app-toolbar></app-toolbar>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </v-app>
</template>
<script>
import Maps from "./components/Maps";
import ToolBar from "./components/ToolBar";

export default {
  components: {
    appToolbar: ToolBar
  },
  data() {
    return {
      user: {}
    };
  },
  mounted() {
    this.$store.dispatch("initAuth");
  }
};
</script>

<style lang="scss">
</style>
