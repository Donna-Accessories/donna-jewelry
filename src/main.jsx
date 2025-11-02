// Fix GitHub Pages refresh
if (sessionStorage.redirect) {
  const redirectUrl = sessionStorage.redirect;
  delete sessionStorage.redirect;
  window.history.replaceState(null, "", redirectUrl);
}


import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";



ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
