<template>
  <div>
    <v-layout align-center justify-center row>
      <v-flex md7>
        <v-toolbar color="white">
          <v-menu v-model="menu" :close-on-content-click="false" :nudge-width="200" offset-x>
            <template v-slot:activator="{ on }">
              <v-icon v-if="checkGroup" color="indigo" dark v-on="on">settings</v-icon>
            </template>
            <v-card>
              <v-list>
                <v-list-tile>
                  <v-list-tile-content>
                    <v-list-tile-title>Katsayı ve Araç Parametreleri</v-list-tile-title>
                    <v-list-tile-sub-title>Değişikleri yaptıktan sonra kaydetmeyi unutmayın</v-list-tile-sub-title>
                  </v-list-tile-content>

                  <!-- <v-list-tile-action>
                    <v-btn :class="fav ? 'red--text' : ''" icon @click="fav = !fav">
                      <v-icon>favorite</v-icon>
                    </v-btn>
                  </v-list-tile-action>-->
                </v-list-tile>
              </v-list>

              <v-divider></v-divider>
              <v-list>
                <v-list-tile>
                  <v-list-tile-title>Kat Sayı</v-list-tile-title>
                  <v-list-tile-action>
                    <v-text-field v-model="parameters.floorNumber"></v-text-field>
                  </v-list-tile-action>
                </v-list-tile>
                <v-list-tile>
                  <v-list-tile-title>Kamyon Ücreti</v-list-tile-title>
                  <v-list-tile-action>
                    <v-text-field v-model="parameters.lorryValue"></v-text-field>
                  </v-list-tile-action>
                </v-list-tile>
                <v-list-tile>
                  <v-list-tile-title>Tır Ücreti</v-list-tile-title>
                  <v-list-tile-action>
                    <v-text-field v-model="parameters.truckValue"></v-text-field>
                  </v-list-tile-action>
                </v-list-tile>
              </v-list>

              <v-card-actions>
                <v-spacer></v-spacer>

                <v-btn flat @click="menu = false">İptal</v-btn>
                <v-btn color="primary" flat @click="updateParameters">Kaydet</v-btn>
              </v-card-actions>
            </v-card>
          </v-menu>
          <v-toolbar-title>Mesafe Parametreleri</v-toolbar-title>
          <v-divider mr-5 class="mx-2" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-flex md5>
            <v-text-field
              v-model="search"
              append-icon="search"
              label="Ara"
              single-line
              hide-details
            ></v-text-field>
          </v-flex>
          <app-edit-settings></app-edit-settings>
        </v-toolbar>
      </v-flex>
    </v-layout>
    <v-layout align-center justify-center fill-height>
      <v-flex grow md7>
        <v-data-table
          :no-results-text="`${search} ile ilgili herhangi bir sonuç bulunamadı`"
          :search="search"
          rows-per-page-text="Görüntülenecek veri sayısı"
          :rows-per-page-items="[
              {
                text: '20',
                value: 20
              },
              {
                text: '40',
                value: 40
              },
              {
                text: '50',
                value: 50
              },
              {
                text: 'Hepsi',
                value: -1
              }
            ]"
          :disable-initial-sort="true"
          :headers="headers"
          :items="distanceValues"
          class="elevation-1"
        >
          <template v-slot:items="props">
            <td>{{ props.item.plaka }}</td>
            <td>{{ props.item.il }}</td>
            <td>{{ props.item.km }}</td>
            <td>{{ props.item.fiyat }}</td>
            <td v-if="checkGuest" class="justify-center layout px-0">
              <v-icon small class="mr-2" @click="updateDistance(props.item)">edit</v-icon>
              <v-icon small @click="deleteItem(props.item.id)">delete</v-icon>
            </td>
          </template>
          <template v-slot:no-data>
            <v-btn color="primary">Reset</v-btn>
          </template>
        </v-data-table>
      </v-flex>
    </v-layout>
    <v-snackbar v-model="snackbar" :color="snackbars.color">
      {{ snackbars.text }}
      <v-icon @click="snackbar = false" flat color="white">close</v-icon>
    </v-snackbar>
  </div>
</template>
<script>
import { eventBus } from "../main";
import EditSettings from "@/components/EditSettings";

export default {
  components: {
    appEditSettings: EditSettings
  },
  data: () => ({
    fav: true,
    menu: false,
    message: false,
    hints: true,
    distanceValues: [],
    parameters: {},
    search: "",
    snackbar: false,
    snackbars: {
      text: "",
      color: ""
    },
    dialog: false,
    headers: [
      {
        text: "Plaka",
        align: "left",
        sortable: false,
        value: "id"
      },
      { text: "İL", value: "il" },
      { text: "Km", value: "km" },
      { text: "Fiyat", value: "fiyat", sortable: false }
    ]
  }),

  computed: {
    checkGuest() {
      return this.$store.getters.isGuest;
    },
    checkGroup() {
      if (this.$store.getters.userValues.userGroup == "Admin") {
        return true;
      } else return false;
    },
    formTitle() {
      return this.editedIndex === -1 ? "New Item" : "Edit Item";
    }
  },

  watch: {
    dialog(val) {
      val || this.close();
    }
  },
  activated() {
    this.$store.dispatch("loadDistances").then(() => {
      this.distanceValues = this.$store.getters.distances;
    });
    this.$store.dispatch("getParameters").then(() => {
      this.parameters = this.$store.getters.parameterValues;
    });
    eventBus.$on("snackBar", snackBar => {
      this.snackbars.text = snackBar.text;
      this.snackbars.color = snackBar.color;
      this.snackbar = snackBar.show;
    });
  },

  methods: {
    updateParameters() {
      this.$store
        .dispatch("updateParameters", this.parameters)
        .then(() => {
          this.$store
            .dispatch("getParameters")
            .then(() => {
              this.parameters = this.$store.getters.parameterValues;
            })
            .then(() => {
              this.snackbars.text = "Kaydetme Başarılı!";
              this.snackbars.color = "success";
              this.snackbar = true;
            });
        })
        .catch(function(error) {
          this.snackbars.text = error;
          this.snackbars.color = "error";
          this.snackbar = true;
        });
    },
    updateDistance(item) {
      this.dialog = true;
      eventBus.$emit("showModal", this.dialog);
      eventBus.$emit("editedItem", item);
    },
    editItem(item) {
      this.editedItem = Object.assign({}, item);
    },
    deleteItem(item) {
      const index = this.distanceValues.indexOf(item);
      confirm("Are you sure you want to delete this item?") &&
        this.distanceValues.splice(index, 1);
    },
    close() {
      this.dialog = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },
    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.distanceValues[this.editedIndex], this.editedItem);
      } else {
        this.distanceValues.push(this.editedItem);
      }
      this.close();
    }
  }
};
</script>