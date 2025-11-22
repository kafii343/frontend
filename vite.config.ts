import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import fs from "fs";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Check if we have certificates for HTTPS
  const httpsConfig = {};
  const keyPath = path.resolve(__dirname, 'cert', 'localhost-key.pem');
  const certPath = path.resolve(__dirname, 'cert', 'localhost.pem');

  if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
    httpsConfig.http = {
      key: fs.readFileSync(keyPath),
      cert: fs.readFileSync(certPath),
    };
  } else {
    // Fallback to HTTP if certificates don't exist
    console.log('⚠️  HTTPS certificates not found. Running on HTTP. Create cert directory with certificates to enable HTTPS.');
  }

  return {
    server: {
      host: true,
      port: 8080,
      ...httpsConfig
    },
    plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
