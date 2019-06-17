<template>
  <div id="app">
    <div id="map"></div>
    <button id="submit"></button>
    <img alt="Vue logo" src="./assets/logo.png">
  </div>
</template>

<script>
const directionsService = new google.maps.DirectionsService();
const directionsDisplay = new google.maps.DirectionsRenderer();
import HelloWorld from "./components/HelloWorld.vue";
export default {
  name: "app",
  data() {
    return {
      map: "",
      fetcedData: ["selam"],
      location: "",
      isSend: false,
      isDone: false,
      formValues: {
        waypts: [],
        realDistance: 0,
        totalDistance: 0,
        vehicleType: "",
        vehicleValue: 0,
        endPoint: "",
        pointCount: 0,
        beginPoint: "Nazilli, Aydın, Türkiye",
        extraCharge: 0,
        description: "",
        shippingNumber: ""
      }
    };
  },
  computed: {},
  components: {
    HelloWorld
  },
  methods: {
    initMap() {
      this.map = new google.maps.Map(document.getElementById("map"), {
        zoom: 7,
        center: { lat: 39.01, lng: 30.97 }
      });
      // directionsDisplay.setMap(this.map);
      document.getElementById("submit").addEventListener("click", function() {
        if (this.formValues.endPoint) {
          calculateAndDisplayRoute(directionsService, directionsDisplay);
        } else {
          alert("bitiş noktası belirtmeniz gerekiyor");
        }
      });
      google.maps.Polyline.prototype.getBounds = function(startBounds) {
        if (startBounds) {
          var bounds = startBounds;
        } else {
          var bounds = new google.maps.LatLngBounds();
        }

        this.getPath().forEach(function(item, index) {
          bounds.extend(new google.maps.LatLng(item.lat(), item.lng()));
        });
        return bounds;
      };
    }
  },
  mounted() {
    this.initMap();
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
