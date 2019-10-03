<template>
  <v-content>
    <v-container fluid fill-height>
      <v-layout align-center justify-center>
        <v-flex md5>
          <v-form @submit.prevent="onSubmit">
            <v-text-field email prepend-icon="mail" v-model="user.email" label="E-mail" required></v-text-field>
            <v-text-field
              prepend-icon="person"
              v-model="user.displayName"
              label="Ad Soyad"
              required
            ></v-text-field>
            <v-text-field
              prepend-icon="lock"
              v-model="user.password"
              type="password"
              label="Şifre"
              required
            ></v-text-field>
            <v-autocomplete
              prepend-icon="security"
              :items="items"
              v-model="user.userGroup"
              label="Group"
            ></v-autocomplete>
            <v-text-field prepend-icon="image_search" v-model="user.imageUrl" label="Resim Yolu"></v-text-field>
            <v-btn type="submit" color="primary">Kayıt Ol</v-btn>
            <v-btn color="warning">İptal</v-btn>
          </v-form>
        </v-flex>
      </v-layout>
      <v-snackbar v-model="snackbar" :color="snackbars.color">
        {{ snackbars.text }}
        <v-icon @click="snackbar = false" flat color="white">close</v-icon>
      </v-snackbar>
    </v-container>
  </v-content>
</template>
<script>
export default {
  data() {
    return {
      items: ["Admin", "Guest", "Employee"],
      snackbar: false,
      snackbars: {
        text: "",
        color: ""
      },
      user: {
        name: "",
        email: "",
        password: "",
        displayName: "",
        auditGroup: "",
        imageUrl: ""
      }
    };
  },

  methods: {
    onSubmit() {
      var _this = this;
      axios
        .post(
          `https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=${process.env.VUE_APP_FIREBASE_API_KEY}`,
          {
            email: _this.user.email,
            password: _this.user.password,
            displayName: _this.user.displayName,
            returnSecureToken: true
          }
        )
        .then(response => {
          axios.post(
            `${process.env.VUE_APP_FIREBASE_DATABASE_URL}/users/${response.data.localId}/.json`,
            {
              email: _this.user.email,
              displayName: _this.user.displayName,
              userGroup: _this.user.userGroup,
              imageUrl: _this.user.imageUrl
            }
          );
        })
        .then(res => {
          this.snackbars.text =
            "Kayıt Başarılı ! Giriş ekranına yönlendiriliyorsunuz";
          this.snackbars.color = "success";
          this.snackbar = true;
        })
        .catch(err => {
          this.snackbars.text = err;
          this.snackbars.color = "error";
          this.snackbar = true;
        });
    }
  }
};
</script>

<style lang="scss">
</style>