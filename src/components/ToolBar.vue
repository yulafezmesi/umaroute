<template>
  <div>
    <v-navigation-drawer
      pa-5
      v-model="drawer"
      absolute
      mobile-break-point="991"
      width="260"
      enable-resize-watcher
      height="100vh"
      temporary
    >
      <v-img pa-5 :aspect-ratio="16/11" :src="require('@/assets/img/sevkiyat.jpg')">
        <v-layout column fill-height>
          <v-spacer></v-spacer>
          <v-flex shrink>
            <v-list-tile avatar>
              <v-list-tile-avatar>
                <img :src="this.$store.getters.userValues.imageUrl">
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-title class="black--text">{{this.$store.getters.userValues.displayName}}</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-flex>
        </v-layout>
      </v-img>
      <v-list class="pa-1">
        <v-list dense class="pt-0">
          <v-list-tile
            v-for="item in items"
            :key="item.title"
            :to="item.path == '#' ? '' : item.path"
          >
            <v-list-tile-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>{{ item.title }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile @click.prevent="logOut">
            <v-list-tile-action>
              <v-icon>exit_to_app</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Çıkış</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar class="mb-3" dark color="primary">
      <v-toolbar-side-icon v-if="this.$store.getters.isAuthenticated" @click="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title class="white--text">Sevkiyat Takip</v-toolbar-title>
    </v-toolbar>
  </div>
</template>
<script>
export default {
  data() {
    return {
      isAuth: false,
      items: [
        { title: "Sevkiyat", icon: "local_shipping", path: "/" },
        { title: "Kayıtlar", icon: "dashboard", path: "/kayitlar" },
        { title: "Ayarlar", icon: "settings", path: "/ayarlar" }
        // { title: "Çıkış", icon: "exit_to_app", path: "/cikis" }
      ],
      drawer: false
    };
  },
  mounted() {},
  methods: {
    logOut() {
      this.$store.dispatch("logout").then(() => {
        this.$router.go("/");
      });
    }
  }
};
</script> 

<style lang="scss">
</style>