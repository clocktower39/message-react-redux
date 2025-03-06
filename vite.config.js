import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/message/",
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom"],
          "mui-vendor": [
            "@mui/material",
            "@mui/icons-material",
            "@mui/styles",
            "@emotion/react",
            "@emotion/styled",
          ],
          "redux-vendor": ["react-redux", "redux", "redux-thunk", "@redux-devtools/extension"],
          socket: ["socket.io-client"],
          utils: ["axios", "jwt-decode"],
        },
      },
    },
  },
});
