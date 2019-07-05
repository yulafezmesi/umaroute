<template>
  <v-content>
    <v-container fluid fill-height>
      <v-layout align-center justify-center>
        <v-flex md5>
          <v-form @submit.prevent="onSubmit">
            <v-text-field prepend-icon="mail" v-model="user.email" label="E-mail" required></v-text-field>
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
            <v-text-field v-model="user.group" label="Group"></v-text-field>
            <v-text-field v-model="user.imageUrl" label="Resim Yolu"></v-text-field>
            <v-btn type="submit" color="primary">Kayıt Ol</v-btn>
            <v-btn color="warning">İptal</v-btn>
          </v-form>
        </v-flex>
      </v-layout>
    </v-container>
  </v-content>
</template>
<script>
export default {
  data() {
    return {
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
          "https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=AIzaSyCrQVg-ZAdCxSgaAvRfsXZUlt8wHz1nSrs",
          {
            email: _this.user.email,
            password: _this.user.password,
            displayName: _this.user.displayName,
            returnSecureToken: true
          }
        )
        .then(response => {
          var userId = response.data.localId;
          axios.post(
            `https://routes-75247.firebaseio.com/users/${userId}/.json`,
            {
              email: _this.user.email,
              displayName: _this.user.displayName,
              userGroup: _this.user.group,
              imageUrl: _this.user.imageUrl
            }
          );
          console.log(response);
        })
        .catch(err => {
          console.log(err.response);
        });
    }
  }
};
</script>

<style lang="scss">
</style>