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
            <!-- <td>{{ props.item.date }}</td> -->

            <td>
              <v-btn target="_blank" :href="props.item.mapUrl">
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
  </div>
</template>
<script>
export default {
  data() {
    return {
      formValues: [],
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
        { text: "Fatura Tarihi", value: "invoiceDate" },
      
      ]
    };
  },
  activated() {
    this.$store.dispatch("loadMapValues").then(() => {
      this.formValues = this.$store.getters.formValues;
    });
  },

  methods: {}
};
</script>