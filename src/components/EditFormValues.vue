<template>
  <v-dialog v-model="editDialog" max-width="500px">
    <!-- <template v-slot:activator="{ on }">
      <v-btn color="primary" dark class="mb-2" v-on="on">New Item</v-btn>
    </template>-->
    <v-card>
      <v-card-title>
        <span class="headline">Düzenle</span>
      </v-card-title>
      <v-card-text>
        <v-container grid-list-md>
          <v-layout wrap>
            <v-flex xs12 sm6 md4>
              <v-text-field v-model="editedItem.invoiceDate" label="Fatura Tarihi"></v-text-field>
            </v-flex>
            <v-flex xs12 sm6 md4>
              <v-text-field v-model="editedItem.plate" label="Plaka"></v-text-field>
            </v-flex>
            <v-flex xs12 sm6 md4>
              <v-text-field v-model="editedItem.shippingNumber" label="Sevkiyat Numarası"></v-text-field>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" flat @click="close">İptal</v-btn>
        <v-btn color="blue darken-1" flat @click="onSaveChanges">Kaydet</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import { eventBus } from "../main";
export default {
  mounted() {
    eventBus.$on("showFormModal", editDialog => {
      this.editDialog = editDialog;
    });
    eventBus.$on("editedFormItem", editedItem => {
      this.editedItem = editedItem;
    });
  },
  data() {
    return {
      snackbars: {
        show: false,
        text: "",
        color: ''
      },
      editDialog: false,
      editedItem: {}
    };
  },
  methods: {
    close() {
      this.editDialog = false;
    },
    onSaveChanges() {
      if (
        this.editedItem.invoiceDate.trim() === "" ||
        this.editedItem.plate.trim() === "" ||
        this.editedItem.shippingNumber.trim() === ""
      ) {
        return;
      }

      this.$store
        .dispatch("updateFormValues", {
          id: this.editedItem.id,
          invoiceDate: this.editedItem.invoiceDate,
          plate: this.editedItem.plate,
          shippingNumber: this.editedItem.shippingNumber
        })
        .then(() => {
          this.editDialog = false;
          this.snackbars.text = "Kaydetme Başarılı!";
          this.snackbars.color = "success";
          this.snackbars.show = true;
          eventBus.$emit("snackBar", this.snackbars);
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
