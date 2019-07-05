<template>
  <v-content>
    <v-container fluid fill-height>
      <v-layout align-center justify-center>
        <v-flex xs12 sm10 md3>
          <v-card class="elevation-12">
            <v-toolbar color="white">
              <v-toolbar-title>Kullanıcı Girişi</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <v-form ref="signinForm" @submit.prevent="onSubmit">
                <v-text-field
                  v-model="user.email"
                  prepend-icon="person"
                  name="login"
                  label="E-Mail"
                  type="text"
                  :rules="emailRules"
                ></v-text-field>
                <v-text-field
                  v-model="user.password"
                  prepend-icon="lock"
                  name="password"
                  label="Şifre"
                  type="password"
                  :rules="passwordRules"
                ></v-text-field>
                <v-btn type="submit" color="primary">GİRİŞ</v-btn>
                <a>Şifremi unuttum</a>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-content>
</template>
<script>
export default {
  data() {
    return {
      emailRules: [
        v =>  !!v || "E-mail adresi giriniz",
        v => /.+@.+/.test(v) || "Geçerli E-mail adresi giriniz"
      ],
      passwordRules: [
        v => !!v || "Şifrenizi giriniz ",
        v => v.length >= 5 || "Şifreniz 5 karakterden az olamaz"
      ],
      user: {
        email: "",
        password: ""
      }
    };
  },
  methods: {
    onSubmit() {
      if (this.$refs.signinForm.validate()) {
        this.$store.dispatch("login", { ...this.user }).then(response => {
          this.$router.push("/");
        });
      }
    }
  }
};
</script>

<style lang="scss">
</style>