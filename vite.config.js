import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: '/donna-jewelry/', // Set to '/<repo-name>/' for GitHub Pages
  plugins: [react()],
});
// If you are deploying to a custom domain, you can set base to "/"