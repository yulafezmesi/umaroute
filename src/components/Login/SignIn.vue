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
                  label="E-posta"
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

                <v-dialog v-model="dialog" width="500">
                  <template v-slot:activator="{ on }">
                    <a v-on="on">Şifremi unuttum</a>
                  </template>
                  <v-card>
                    <v-card-title class="headline" primary-title>Şifre Sıfırlama</v-card-title>
                    <v-divider></v-divider>

                    <v-flex md8 ml-3>
                      <v-text-field
                        v-model="updatedEmail"
                        prepend-icon="person"
                        name="login"
                        label="E-posta"
                        type="text"
                        :rules="emailRules"
                      ></v-text-field>
                    </v-flex>
                    <v-card-text>Şifre sıfırlamak için kayıtlı e-posta adresinizi yukardaki alana yazınız. Sıfırlama linki e-posta adresinize gönderilecektir. Açılan ekrandaki adımları takip ederek şifrenizi sıfırlayabilirsiniz.</v-card-text>
                    <v-divider></v-divider>
                    <v-card-actions>
                      <div class="flex-grow-1"></div>
                      <v-btn small color="primary" text @click="updatePassword">Sıfırla</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
          <v-snackbar v-model="snackbar" :color="snackbars.color" :timeout="snackbars.timeout">
            {{snackbars.text}}
            <v-icon small @click="snackbar = false" flat color="white">close</v-icon>
          </v-snackbar>
        </v-flex>
      </v-layout>
    </v-container>
  </v-content>
</template>
<script>
import { fb } from "../../database";

export default {
  data() {
    return {
      updatedEmail: "",
      dialog: false,
      snackbar: false,
      snackbars: {
        timeout: 2000,
        color: "",
        text: ""
      },
      emailRules: [
        v => !!v || "e-posta adresi giriniz",
        v => /.+@.+/.test(v) || "Geçerli e-posta adresi giriniz"
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
      debugger;
      this.$store
        .dispatch("login", { ...this.user })
        .then(response => {
          this.snackbar = true;
          this.snackbars.color = "green";
          this.snackbars.text = `Giriş başarılı, yönlendiriliyorsunuz...`;
          setTimeout(() => {
            this.$router.push("/");
          }, this.snackbars.timeout);
        })
        .catch(err => {
          this.snackbar = true;
          this.snackbars.color = "red";
          this.snackbars.text = `Kullanıcı adı veya şifre yanlış.${err.message}`;
        });
    },
    updatePassword() {
      var auth = fb.auth();
      auth
        .sendPasswordResetEmail(this.updatedEmail)
        .then(() => {
          this.snackbar = true;
          this.snackbars.color = "green";
          this.snackbars.timeout = 2000;
          this.snackbars.text = "Şifre sıfırlama e-posta gönderimi başarılı!";
          setTimeout(() => {
            this.dialog = false;
          }, 2000);
        })
        .catch(err => {
          this.snackbar = true;
          this.snackbars.color = "red";
          this.snackbars.timeout = 2100;
          this.snackbars.text = "E-posta adresi geçersiz";
        });
    }
  }
};
</script>

<style lang="scss">
</style>