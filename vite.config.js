import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/donna-jewelry/", // 👈 use your repo name here
});
// If you are deploying to a custom domain, you can set base to "/"