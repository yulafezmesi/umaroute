<template>
  <div class="main-container d-flex justify-content-around">
    <div id="map"></div>
    <v-container fluid ma-0 pa-0 fill-height>
      <v-layout mr-5 ml-5 justify-start column>
        <v-flex d-flex>
          <div>
            <v-form ref="mapsForm">
              <div class="form-group">
                <v-text-field py-2 readonly v-model="formValues.beginPoint" id="from"></v-text-field>
                <div v-show="wayptShow">
                  <v-alert
                    v-show="formValues.waypts.length==0"
                    :value="true"
                    type="info"
                    transition="scale-transition"
                  >Konum eklenmedi.</v-alert>
                  <v-text-field
                    autofocus
                    py-2
                    ref="location"
                    class="form-control mb-3"
                    v-model="location"
                    id="waypoint1"
                    type="text"
                  ></v-text-field>
                  <v-card class="mb-5" v-show="formValues.waypts.length > 0">
                    <v-list class="mb-1">
                      <transition-group name="scale-transition">
                        <template v-for="(way, i) in formValues.waypts">
                          <v-list-tile :key="i">
                            <v-list-tile-content transition="scale-transition">
                              <v-list-tile-title v-html="way.location"></v-list-tile-title>
                            </v-list-tile-content>
                            <v-list-tile-action>
                              <v-btn @click="arrayDown(i)" icon flat>
                                <v-icon>keyboard_arrow_down</v-icon>
                              </v-btn>
                            </v-list-tile-action>
                            <v-list-tile-action>
                              <v-btn @click="arrayUp(i)" icon flat>
                                <v-icon>keyboard_arrow_up</v-icon>
                              </v-btn>
                            </v-list-tile-action>
                            <v-list-tile-action>
                              <v-btn @click="arraySlice(i)" icon flat>
                                <v-icon color="red">delete_forever</v-icon>
                              </v-btn>
                            </v-list-tile-action>
                          </v-list-tile>
                        </template>
                      </transition-group>
                    </v-list>
                  </v-card>
                </div>
                <v-text-field
                  autofocus
                  placeholder=" "
                  label="Varış Noktası"
                  v-model="formValues.destinationPoint"
                  py-2
                  id="to"
                ></v-text-field>
                <v-radio-group
                  label="Araç Tipi"
                  color="info"
                  @change="setVehicleValue(formValues.vehicleType)"
                  v-model="formValues.vehicleType"
                  row
                >
                  <v-radio key="TIR" label="TIR" value="TIR"></v-radio>
                  <v-radio key="KAMYON" label="KAMYON" value="KAMYON"></v-radio>
                </v-radio-group>
                <v-layout wrap row>
                  <v-flex md6>
                    <v-text-field
                      py-2
                      label="Total Mesafe"
                      readonly
                      v-model="formValues.totalDistance"
                    ></v-text-field>
                  </v-flex>
                  <v-flex md6>
                    <v-text-field
                      py-2
                      label="Gerçek Mesafe"
                      readonly
                      v-model="formValues.endPoint.km"
                    ></v-text-field>
                  </v-flex>
                  <v-flex md6>
                    <v-text-field py-2 label="Nokta Sayısı" readonly v-model="pointCount"></v-text-field>
                  </v-flex>
                  <v-flex md6>
                    <v-text-field
                      py-2
                      label="Sabit Ücret"
                      v-model="formValues.endPoint.fiyat"
                      type="number"
                      readonly
                      required
                    ></v-text-field>
                  </v-flex>
                  <v-flex md12>
                    <v-text-field
                      py-2
                      label="Ek Ücret"
                      v-model="formValues.extraCharge"
                      type="number"
                    ></v-text-field>
                  </v-flex>
                  <v-flex md6>
                    <v-text-field py-2 label="Nakliye Numarası" v-model="formValues.shippingNumber"></v-text-field>
                  </v-flex>
                  <v-flex md6>
                    <v-text-field py-2 ref="plaka" label="Plaka" v-model="formValues.plate"></v-text-field>
                  </v-flex>
                  <v-menu
                    v-model="dateMenu"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    lazy
                    transition="scale-transition"
                    offset-y
                    full-width
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        v-model="formValues.invoiceDate"
                        label="Fatura Tarihi"
                        prepend-icon="event"
                        readonly
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker locale="tr" v-model="invoiceDate" @input="dateMenu = false"></v-date-picker>
                  </v-menu>
                </v-layout>
                <v-textarea py-2 v-model="formValues.description" rows="3" label="Açıklama"></v-textarea>
                <p v-if="isDone">{{ deserved }}</p>
                <div class="d-flex justify-content-around mt-3">
                  <v-btn id="submit" color="primary">Hesapla</v-btn>
                  <v-btn color="success" :disabled="!isDone" @click="postForm">Form Gönder</v-btn>
                  <v-btn :disabled="!isDone" target="_blank" :href="formValues.mapUrl">
                    <v-icon left color="primary">streetview</v-icon>
                  </v-btn>
                </div>
              </div>
            </v-form>
          </div>
        </v-flex>
      </v-layout>
      <v-snackbar v-model="snackbar" :color="snackbars.color">
        {{ snackbars.text }}
        <v-icon @click="snackbar = false" flat color="white">close</v-icon>
      </v-snackbar>
      <template></template>
      <v-dialog v-model="dialog" persistent max-width="290">
        <v-card>
          <v-card-title class="headline">Ulaşım Tipi</v-card-title>
          <v-radio-group v-model="istanbulType" row>
            <v-radio label="Kamyon" value="İstanbul-Kamyon"></v-radio>
            <v-radio label="Kırkayak" value="İstanbul-Kırkayak"></v-radio>
          </v-radio-group>
          <v-btn small @click="dialog=false" color="primary">Tamam</v-btn>
        </v-card>
      </v-dialog>
    </v-container>
  </div>
</template>
<script>
var moment = require("moment");
import loadGoogleMapsApi from "@/googlemaps.js";
export default {
  name: "app",
  directives: { focus },
  data() {
    return {
      destinationValues: [],
      istanbulType: null,
      dialog: false,
      wayptShow: false,
      invoiceDate: "",
      dateMenu: false,
      parameters: this.$store.getters.optionValues,
      endpointRules: [v => !!v || "Konum giriniz"],
      snackbar: false,
      snackbars: {
        text: "",
        color: ""
      },
      descriptionLimit: 10,
      entries: [],
      isLoading: false,
      model: null,
      search: null,
      options: {
        types: ["(cities)"],
        componentRestrictions: { country: "tr" }
      },
      autocomplete1: "",
      autocomplete2: "",
      map: "",
      polylines: [],
      fetcedData: [],
      location: "",
      isSend: false,
      isDone: false,
      directionsDisplay: "",
      directionsService: "",
      vueMaps: "",
      googleMaps: "",
      formValues: {
        date: moment()
          .lang("tr")
          .format("L"),
        waypts: [],
        mapUrl: "",
        invoiceDate: "",
        totalDistance: 0,
        totalPrice: 0,
        vehicleType: "TIR",
        plate: "",
        vehicleValue: 100,
        destinationPoint: "",
        endPoint: {
          fiyat: "",
          id: "",
          il: "",
          km: ""
        },
        pointCount: 0,
        beginPoint: "Nazilli, Aydın, Türkiye",
        extraCharge: 0,
        description: "",
        shippingNumber: ""
      }
    };
  },
  watch: {
    istanbulType(val) {
      const destination = this.destinationValues.filter(dest => dest.il == val);
      this.formValues.endPoint = destination[0];
    },
    invoiceDate(val) {
      this.formValues.invoiceDate = moment(val)
        .lang("tr")
        .format("L");
    },
    "formValues.waypts"() {
      let arr = [];
      document.getElementById("submit").click();
      let waypoints = this.formValues.waypts;
      for (let i = 0; i < waypoints.length; i++) {
        arr.push(waypoints[i].location);
      }
      let arrNew = arr.join("%7C");
      this.formValues.mapUrl = `https://www.google.com/maps/dir/?api=1&origin=Nazilli, Aydın, Türkiye,&destination=${this.formValues.destinationPoint}&travelmode=driving&waypoints=${arrNew}`;
    }
  },
  computed: {
    deserved() {
      if (!this.formValues.endPoint.il) return 0;
      var t = +this.formValues.totalDistance;
      var r = +this.formValues.endPoint.km;
      var ex = +this.formValues.extraCharge;
      var p = +this.pointCount === 1 ? 2 : +this.pointCount;
      var v = +this.formValues.vehicleValue;
      var f = +this.formValues.endPoint.fiyat;
      var l = +this.parameters.lorryValue;
      var fn = +this.parameters.floorNumber;
      var y;
      if (this.pointCount == 1) v = 0;
      if (t < r) {
        y = 0;
        l = 0;
      } else {
        y = t - r;
      }

      var totalHesap = y * fn + ex + ((p - 1) * v + f);
      this.formValues.totalPrice = totalHesap.toFixed(2);
      return totalHesap.toFixed(2);
    },
    pointCount() {
      this.formValues.pointCount = this.formValues.waypts.length + 1;
      return this.formValues.waypts.length + 1;
    }
  },
  methods: {
    initMaps() {
      var _this = this;

      loadGoogleMapsApi().then(function(googleMaps) {
        // document.getElementById('to').focus();
        _this.googleMaps = googleMaps;
        _this.vueMaps = new googleMaps.Map(document.getElementById("map"), {
          center: { lat: 39.01, lng: 30.97 },
          zoom: 7
        });

        _this.directionsService = new googleMaps.DirectionsService();
        _this.directionsDisplay = new googleMaps.DirectionsRenderer({
          map: _this.vueMaps,
          draggable: true
        });
        document.getElementById("submit").addEventListener("click", function() {
          _this.calculateAndDisplayRoute(
            _this.directionsService,
            _this.directionsDisplay,
            googleMaps
          );
        });
      });
    },
    arrayUp(oldIndex) {
      if (oldIndex > 0) {
        var newIndex = oldIndex - 1;
        this.formValues.waypts.move(oldIndex, newIndex);
        if (this.isSend) {
          document.getElementById("submit").click();
        }
      }
    },
    arrayDown(oldIndex) {
      var checkIndex = this.formValues.waypts[
        this.formValues.waypts.length - 1
      ];
      var checkOldIndex = this.formValues.waypts[oldIndex];
      if (checkIndex.location != checkOldIndex.location) {
        var newIndex = oldIndex + 1;
        this.formValues.waypts.move(oldIndex, newIndex);
        if (this.isSend) {
          document.getElementById("submit").click();
        }
      }
    },
    arraySlice(i) {
      this.formValues.waypts.splice(i, 1);
      if (this.isSend) {
        document.getElementById("submit").click();
      }
    },
    slicedWaypts(e) {
      return e.split(",", 2)[0] + "," + e.split(",", 2)[1];
    },
    setVehicleValue(type) {
      var lorryValue = this.parameters.lorryValue;
      var truckValue = this.parameters.truckValue;
      if (type === "KAMYON") {
        this.formValues.vehicleValue = lorryValue;
      } else this.formValues.vehicleValue = truckValue;
    },
    postForm() {
      var _this = this;
      if (this.$refs.mapsForm.validate()) {
        if (this.formValues.endPoint.fiyat) {
          this.$store
            .dispatch("postFormValues", this.formValues)
            .then(response => {
              _this.snackbars.text = "Form başarıyla gönderildi";
              _this.snackbars.color = "success";
              _this.snackbar = true;
            })
            .catch(function(error) {
              _this.snackbars.text = error;
              _this.snackbars.color = "error";
              _this.snackbar = true;
            })
            .finally(function() {
              // always executed
            });
        } else {
          _this.snackbars.text = "Sabit ücret olmadan formu gönderemem :(";
          _this.snackbars.color = "error";
          _this.snackbar = true;
        }
      }
    },
    computeTotalDistance(result, j = 0) {
      var totalDist = 0;
      var _this = this;
      if (_this.formValues.waypts.length == 0) {
        // _this.formValues.realDistance = ( result.routes[j].legs[0].distance.value / 1000 ).toFixed(1);
      }
      var myroute = result.routes[j];
      for (let i = 0; i < myroute.legs.length; i++) {
        totalDist += myroute.legs[i].distance.value;
      }
      this.formValues.totalDistance = (totalDist / 1000).toFixed(1);
    },
    calculateAndDisplayRoute(directionsService, directionsDisplay, googleMaps) {
      var _this = this;
      for (var j in this.polylines) {
        if (j != "move") {
          this.polylines[j].setVisible(false);
        }
      }
      this.polylines = [];

      _this.directionsService.route(
        {
          origin: this.formValues.beginPoint,
          destination: this.formValues.destinationPoint,
          waypoints: this.formValues.waypts,
          optimizeWaypoints: false,
          provideRouteAlternatives: true,
          travelMode: "DRIVING"
        },
        function(response, status) {
          if (status === "OK") {
            for (let i = response.routes.length - 1; i >= 0; i--) {
              googleMaps.event.addListener(
                _this.directionsDisplay,
                "directions_changed",
                function() {
                  _this.computeTotalDistance(
                    _this.directionsDisplay.getDirections()
                  );
                }
              );
            }
            directionsDisplay.setDirections(response);
            if (_this.formValues.waypts.length == 0) {
              // var distanceValue = (
              //   response.routes[0].legs[0].distance.value / 1000
              // ).toFixed(1);
            }
            _this.isDone = true;
            _this.isSend = true;
            _this.computeTotalDistance(response);
            if (_this.formValues.waypts.length == 0) {
              _this.formValues.mapUrl = `https://www.google.com/maps/dir/?api=1&origin=Nazilli, Aydın, Türkiye,&destination=${_this.formValues.destinationPoint}&travelmode=driving`;
            }
          } else {
            _this.snackbars.color = "error";
            _this.snackbars.text = "Geçerli konum giriniz";
            _this.snackbar = true;
            // window.alert("Directions request failed due to " + status);
          }
        }
      );
    },
    highlightRoute(index) {
      var color = "";
      for (var j in this.polylines) {
        if (j == index) {
          color = "#0000ff";
        } else {
          color = "#999999";
        }

        if (j != "move") {
          this.polylines[j].setOptions({ strokeColor: color });
        }
      }
    }
  },
  activated() {
    this.$store.dispatch("getParameters").then(() => {
      this.$store.dispatch("disabledElements");
      this.parameters = this.$store.getters.parameterValues;
    });
  },
  mounted() {
    Array.prototype.move = function(from1, to1) {
      this.splice(to1, 0, this.splice(from1, 1)[0]);
      return this;
    };
    this.initMaps();
    setTimeout(() => {
      var _this = this;
      var input1 = document.getElementById("waypoint1");
      var input2 = document.getElementById("to");
      _this.autocomplete1 = new this.googleMaps.places.Autocomplete(
        input1,
        _this.options
      );

      _this.autocomplete2 = new this.googleMaps.places.Autocomplete(
        input2,
        _this.options
      );

      _this.autocomplete2.addListener("place_changed", () => {
        let placeInfo = _this.autocomplete2.getPlace();
        const adminArea = placeInfo.address_components.filter(
          adress => adress.types[0] == "administrative_area_level_1"
        );
        // if (placeInfo.address_components[0].long_name == "Domaniç") {
        //   adminArea = placeInfo.address_components.filter(
        //     adress => adress.types[0] == "locality"
        //   );
        // } else {
        //   adminArea = placeInfo.address_components.filter(
        //     adress => adress.types[0] == "administrative_area_level_1"
        //   );
        // }
        fetch(`${process.env.VUE_APP_FIREBASE_DATABASE_URL}/distance.json`)
          .then(res => res.json())
          .then(res => {
            document.getElementById("submit").click();
            this.destinationValues = res;
            const destination = res.filter(
              dest => dest.il == adminArea[0].long_name
            );
            if (adminArea[0].long_name == "İstanbul") {
              this.dialog = true;
            } else {
              this.formValues.endPoint = destination[0];
            }
          });
        _this.formValues.destinationPoint = placeInfo.formatted_address;
        _this.wayptShow = true;
        setTimeout(() => {
          _this.$refs.location.focus();
        }, 200);
      });
      _this.autocomplete1.addListener("place_changed", () => {
        let place1 = _this.autocomplete1.getPlace();
        this.formValues.waypts.push({
          location: place1.formatted_address,
          stopover: true
        });
        this.formValues.location = "";
      });
    }, 1000);
  }
};
</script>

<style>
a {
  display: inline-block;
  text-decoration: none;
  text-align: center;
  vertical-align: center;
}
#map {
  float: left;
  min-width: 60% !important;
  margin-left: 1em !important;
}
.right-panel {
  width: 80% !important;
}
label {
  float: left;
}

.list-enter-active,
.list-leave-active,
.list-move {
  transition: 500ms cubic-bezier(0.59, 0.12, 0.34, 0.95);
  transition-property: opacity, transform;
}

.list-enter {
  opacity: 0;
  transform: translateX(50px) scaleY(0.5);
}

.list-enter-to {
  opacity: 1;
  transform: translateX(0) scaleY(1);
}

.list-leave-active {
  position: absolute;
}

.list-leave-to {
  opacity: 0;
  transform: scaleY(0);
  transform-origin: center top;
}
</style>
