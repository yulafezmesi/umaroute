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
                <div v-show="isDone">
                  <v-alert
                    v-show="formValues.waypts.length==0"
                    :value="true"
                    type="info"
                    transition="scale-transition"
                  >Konum eklenmedi.</v-alert>
                  <v-text-field
                    py-2
                    ref="location"
                    class="form-control mb-3"
                    v-model="location"
                    id="waypoint1"
                    type="text"
                  ></v-text-field>
                  <v-card>
                    <v-list v-show="formValues.waypts">
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
                <!-- <v-text-field py-2 v-model="formValues.endPoint" id="to"></v-text-field> -->
                <v-autocomplete
                  :rules="endpointRules"
                  v-model="formValues.endPoint"
                  :items="items"
                  :loading="isLoading"
                  :search-input.sync="search"
                  hide-no-data
                  hide-selected
                  item-text="il"
                  item-value="il"
                  label="Konum girin"
                  return-object
                ></v-autocomplete>
                <v-radio-group
                  label="Araç Tipi"
                  color="info"
                  @change="setVehicleValue(formValues.vehicleType)"
                  v-model="formValues.vehicleType"
                  row
                >
                  <v-radio label="TIR" value="TIR"></v-radio>
                  <v-radio label="KAMYON" value="KAMYON"></v-radio>
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
                      readonly
                      label="Sabit Ücret"
                      v-model="formValues.endPoint.fiyat"
                      type="number"
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
    </v-container>
  </div>
</template>
// <script>
// import { debuglog } from "util";
var moment = require("moment");
export default {
  name: "app",
  data() {
    return {
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
        totalDistance: 0,
        totalPrice: 0,
        vehicleType: "",
        plate: "",
        vehicleValue: 0,
        endPoint: {
          il: "",
          km: "",
          fiyat: ""
        },
        pointCount: 0,
        beginPoint: "Nazilli, Aydın, Türkiye",
        extraCharge: 0,
        description: "",
        shippingNumber: ""
      }
    };
  },
  updated() {},
  watch: {
    "formValues.waypts"() {
      let arr = [];
      document.getElementById("submit").click();
      let waypoints = this.formValues.waypts;
      for (let i = 0; i < waypoints.length; i++) {
        arr.push(waypoints[i].location);
      }
      let arrNew = arr.join("%7C");
      this.formValues.mapUrl = `https://www.google.com/maps/dir/?api=1&origin=Nazilli, Aydın, Türkiye,&destination=${
        this.formValues.endPoint.il
      }&travelmode=driving&waypoints=${arrNew}`;
    },
    search(val) {
      // Items have already been loaded
      if (this.items.length > 0) return;

      // Items have already been requested
      if (this.isLoading) return;

      this.isLoading = true;

      // Lazily load input items
      fetch("https://routes-75247.firebaseio.com/distance.json")
        .then(res => res.json())
        .then(res => {
          const { count, entries } = res;
          this.count = count;
          this.entries = res;
        })
        .catch(err => {
          console.log(err);
        })
        .finally(() => (this.isLoading = false));
    }
  },
  computed: {
    deserved() {
      if (!this.formValues.endPoint.il) return 0;
      debugger;
      var t = +this.formValues.totalDistance;
      var r = +this.formValues.endPoint.km;
      var ex = +this.formValues.extraCharge;
      var p = +this.pointCount === 0 ? 1 : +this.pointCount;
      var v = +this.formValues.vehicleValue;
      var f = +this.formValues.endPoint.fiyat;
      var y;
      if (t < r) {
        y = 0;
      } else {
        y = t - r;
      }
      var totalHesap = y * 3.1 + ex + ((p - 1) * v + f);
      this.formValues.totalPrice = totalHesap.toFixed(2);
      return totalHesap.toFixed(2);
    },
    fields() {
      if (!this.model) return [];
      return Object.keys(this.model).map(key => {
        return {
          key,
          value: this.model[key] || "n/a"
        };
      });
    },
    items() {
      return this.entries.map(entry => {
        const Description =
          entry.il.length > this.descriptionLimit
            ? entry.il.slice(0, this.descriptionLimit) + "..."
            : entry.il;
        return Object.assign({}, entry);
      });
    },
    pointCount() {
      this.formValues.pointCount = this.formValues.waypts.length +1;
      return this.formValues.waypts.length +1;
    }
  },
  components: {},
  methods: {
    initMaps() {
      var _this = this;
      const loadGoogleMapsApi = require("load-google-maps-api-2");
      loadGoogleMapsApi.key = "AIzaSyAjEn4M4V78EDEku1FoJ1p7AdGHSjHzp3c";
      loadGoogleMapsApi.language = "tr";
      loadGoogleMapsApi.libraries = ["places"];
      loadGoogleMapsApi().then(function(googleMaps) {
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
    // checkPlaka(val) {
    //   var regex, v;
    //   v = val.replace(/\s+/g, "").toUpperCase();
    //   regex = /^(0[1-9]|[1-7][0-9]|8[01])(([A-Z])(\d{4,5})|([A-Z]{2})(\d{3,4})|([A-Z]{3})(\d{2}))$/;
    //   if (!v.match(regex)) {
    //     this.$refs.plaka.focus();
    //     this.snackbar.visible = true;
    //     this.snackbar.text = "Lütfen geçerli plaka giriniz";
    //     alert("selam");
    //     return true;
    //   }

    //   return v.match(regex) != null;
    // },
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
      debugger;
      var lorryValue = this.parameters.lorryValue;
      var truckValue = this.parameters.truckValue;
      console.log(this.parameters.lorryValue);
      if (type === "KAMYON") {
        this.formValues.vehicleValue = lorryValue;
      } else this.formValues.vehicleValue = truckValue;
    },
    postForm() {
      var _this = this;

      if (_this.$refs.mapsForm.validate()) {
        this.axios
          .post("https://routes-75247.firebaseio.com/umaroute.json", {
            ..._this.formValues
          })
          .then(function(response) {
            _this.snackbars.text = "Form başarıyla gönderildi";
            _this.snackbars.color = "success";
            _this.snackbar = true;
            console.log(response); // eslint-disable-line
          })
          .catch(function(error) {
            // eslint-disable-line
            // handle error
          })
          .finally(function() {
            // always executed
          });
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
          destination: this.formValues.endPoint.il,
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
              _this.formValues.mapUrl = `https://www.google.com/maps/dir/?api=1&origin=Nazilli, Aydın, Türkiye,&destination=${
                _this.formValues.endPoint.il
              }&travelmode=driving`;
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
      var input2 = document.getElementById("waypoint1");
      _this.autocomplete2 = new this.googleMaps.places.Autocomplete(
        input2,
        _this.options
      );
      _this.autocomplete2.addListener("place_changed", () => {
        let place2 = _this.autocomplete2.getPlace();
        this.formValues.waypts.push({
          location: place2.formatted_address,
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
