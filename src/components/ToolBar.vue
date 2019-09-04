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
        <v-layout v-if="drawer" column fill-height>
          <v-spacer></v-spacer>
          <v-flex shrink>
            <v-list-tile avatar>
              <v-list-tile-avatar>
                <img :src="this.$store.getters.userValues.imageUrl" />
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
          <v-dialog v-model="dialog" width="500">
            <template v-slot:activator="{ on }">
              <v-list-tile v-on="on">
                <v-list-tile-action>
                  <v-icon>lock_open</v-icon>
                </v-list-tile-action>
                <v-list-tile-content>
                  <v-list-tile-title>Şifremi sıfırla</v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
            </template>
            <v-card>
              <v-card-title class="headline" primary-title>Şifre Sıfırlama</v-card-title>
              <v-divider></v-divider>
              <v-card-text>Şifre sıfırlamak için kayıtlı e-posta adresinize sıfırlama linki gönderilecektir. Açılan ekrandaki adımları takip ederek şifrenizi sıfırlayabilirsiniz.</v-card-text>
              <v-divider></v-divider>
              <v-card-actions>
                <div class="flex-grow-1"></div>
                <v-btn small color="primary" text @click="updatePassword">Sıfırla</v-btn>
              </v-card-actions>
            </v-card>
            <v-snackbar :timeout="2000" v-model="snackbar" color="green">
              Şifre sıfırlama e-posta gönderimi başarılı!
              <v-icon @click="snackbar = false" flat color="white">close</v-icon>
            </v-snackbar>
          </v-dialog>
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
import { fb } from "../database";
import { setPriority } from "os";

export default {
  data() {
    return {
      snackbar: false,
      imageUrl: "",
      displayName: "",
      dialog: false,
      items: [
        { id: 1, title: "Sevkiyat", icon: "local_shipping", path: "/" },
        { id: 2, title: "Kayıtlar", icon: "dashboard", path: "/kayitlar" },
        { id: 3, title: "Ayarlar", icon: "settings", path: "/ayarlar" }
        // { title: "Çıkış", icon: "exit_to_app", path: "/cikis" }
      ],
      drawer: false
    };
  },
  computed: {
    isAuth() {
      return this.$store.getters.isAuthenticated;
    }
  },
  beforeCreate() {},
  created() {
    this.imageUrl = this.$store.getters.userValues.imageUrl;
    this.displayName = this.$store.getters.userValues.displayName;
  },
  methods: {
    updatePassword() {
      var _this = this;
      var auth = fb.auth();
      auth
        .sendPasswordResetEmail(this.$store.getters.userValues.email)
        .then(() => {
          _this.snackbar = true;
          setTimeout(() => {
            _this.dialog = false;
          }, 2000);
        })
        .catch(err => {
          console.log(err);
        });
    },
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