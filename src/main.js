import Vue from 'vue'
import App from './App.vue'
Vue.config.productionTip = false

// export const loadedGoogleMapsAPI = new Promise( (resolve,reject) => {

//   window['GoogleMapsInit'] = resolve;

//   let GMap = document.createElement('script');
  
//   GMap.setAttribute('src',`https://maps.googleapis.com/maps/api/js?key=AIzaSyAjEn4M4V78EDEku1FoJ1p7AdGHSjHzp3c&callback=GoogleMapsInit&libraries=places`);

//   document.body.appendChild(GMap); 
// });



new Vue({
  render: h => h(App),
}).$mount('#app')
