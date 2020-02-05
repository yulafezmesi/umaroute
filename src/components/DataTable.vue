<template>
  <div>
    <v-layout align-center justify-center row>
      <v-flex md7>
        <v-toolbar color="white">
          <v-toolbar-title>Lokasyon Verileri</v-toolbar-title>
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
          <app-edit-form-values></app-edit-form-values>
        </v-toolbar>
      </v-flex>
    </v-layout>
    <v-layout align-center justify-center fill-height>
      <v-flex ma-3 md12>
        <v-data-table
          rows-per-page-text="Görüntülenecek veri sayısı"
          :rows-per-page-items="[
              {
                text: '50',
                value: 50
              },
              {
                text: '100',
                value: 100
              },
              {
                text: '150',
                value: 150
              },
              {
                text: 'Hepsi',
                value: -1
              }
            ]"
          :headers="headers"
          :items="formValues"
          :search="search"
          :disable-initial-sort="true"
        >
          <template v-slot:items="props">
            <td>{{ props.item.endPoint.il }}</td>
            <td>
              <span :key="index" v-for="(list,index) in props.item.waypts">
                {{list.location}}
                <span v-if="index+1 < props.item.waypts.length">,</span>
              </span>
            </td>
            <td>{{ props.item.extraCharge }}</td>
            <td>{{ props.item.pointCount }}</td>
            <td>{{ props.item.shippingNumber }}</td>
            <td>{{ props.item.totalDistance }}</td>
            <td>{{ props.item.vehicleType }}</td>
            <td>{{ props.item.plate }}</td>
            <td>{{ props.item.description }}</td>
            <td>{{ props.item.totalPrice }}</td>
            <td>{{ props.item.invoiceDate }}</td>
            <!-- <td v-if="checkGuest" class="justify-center layout px-0">
              <v-icon class="mr-2" @click="updateFormValues(props.item)">edit</v-icon>
            </td>-->
            <td v-if="checkGuest" class="justify-center layout px-0">
              <v-icon class="mr-2" @click="updateFormValues(props.item.id)">edit</v-icon>
            </td>
            <td v-if="checkGuest" class="justify-center layout px-0">
              <v-icon class="mr-2" @click="deteDistancesData(props.item.id)">delete</v-icon>
            </td>
            <!-- <td>{{ props.item.date }}</td> -->

            <td>
              <v-btn small target="_blank" :href="props.item.mapUrl">
                <v-icon left color="primary">streetview</v-icon>
              </v-btn>
            </td>
          </template>
          <template v-slot:no-results>
            <v-alert
              :value="true"
              color="error"
              icon="warning"
            >{{ search }}" ile ilgili bir sonuç bulunamadı.</v-alert>
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
import { mapGetters } from "vuex";
import { eventBus } from "../main";
import EditFormValues from "@/components/EditFormValues";
export default {
  data() {
    return {
      snackbar: false,
      snackbars: {
        text: "",
        color: ""
      },
      search: "",
      headers: [
        { text: "Varış Noktası", value: "endPoint.il" },
        { text: "Noktalar", value: "waypts[0].location" },
        { text: "Ek Ücret", value: "extraCharge" },
        { text: "Nokta Sayısı", value: "pointCount" },
        { text: "Kargo Numarası", value: "shippingNumber" },
        { text: "Toplam KM", value: "totalDistance" },
        { text: "Araç Türü", value: "vehicleType" },
        { text: "Plaka", value: "plate" },
        { text: "Açıklama", value: "description" },
        { text: "Toplam Fiyat", value: "totalPrice" },
        { text: "Fatura Tarihi", value: "invoiceDate" }
      ]
    };
  },
  watch: {},
  activated() {
    this.$store.dispatch("loadMapValues");

    eventBus.$on("snackBar", snackBar => {
      this.snackbars.text = snackBar.text;
      this.snackbars.color = snackBar.color;
      this.snackbar = snackBar.show;
    });
  },
  computed: {
    ...mapGetters(["formValues"]),
    checkGuest() {
      return this.$store.getters.isGuest;
    }
  },
  methods: {
    deteDistancesData(id) {
      this.$store
        .dispatch("deteDistancesData", id)
        .then(() => {
          this.$store.dispatch("loadMapValues");
          this.snackbars.text = "Kayıt Başarıyla Silindi";
          this.snackbars.color = "green";
          this.snackbar = true;
        })
        .catch(err => {
          this.snackbars.text = "Hata oluştu";
          this.snackbars.color = "red";
          this.snackbar = true;
        });
    },
    updateFormValues(obj) {
      this.$router.push({ path: `/kayitlar/${obj}` });
    }
  },
  components: {
    appEditFormValues: EditFormValues
  }
};
</script>