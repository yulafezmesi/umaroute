const loadGoogleMapsApi = require("load-google-maps-api-2");
loadGoogleMapsApi.key = process.env.VUE_APP_GOOGLE_MAPS_API_KEY;
loadGoogleMapsApi.language = "tr";
loadGoogleMapsApi.libraries = ["places"];

export default loadGoogleMapsApi