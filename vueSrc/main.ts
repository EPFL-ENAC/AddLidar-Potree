import { createApp } from "vue";
import { Quasar, Notify } from "quasar";
import { createPinia } from "pinia"; // Import createPinia

// Import icon libraries
import "@quasar/extras/material-icons/material-icons.css";

// Import Quasar css
import "quasar/src/css/index.sass";

// Assumes your root component is App.vue
// and placed in same folder as main.js
import App from "@/App.vue";

// Create Pinia instance
const pinia = createPinia();

const myApp = createApp(App);

// Use Pinia
myApp.use(pinia);

myApp.use(Quasar, {
  plugins: { Notify }, // import Quasar plugins and add here
});

myApp.mount("#app");
