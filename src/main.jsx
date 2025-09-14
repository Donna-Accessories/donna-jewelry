import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { ProductProvider } from "./contexts/ProductContext.jsx"; // 👈 we bring in the provider

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ProductProvider>   {/* 👈 wrap App with the provider */}
      <App />
    </ProductProvider>
  </React.StrictMode>
);
