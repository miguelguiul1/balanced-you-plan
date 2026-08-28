import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const supabaseHost = (() => {
    try {
      const value = loadEnv(mode, process.cwd(), "").VITE_SUPABASE_URL;
      return value ? new URL(value).hostname : null;
    } catch {
      return null;
    }
  })();

  return {
    server: {
      host: "::",
      port: 8080,
      hmr: {
        overlay: false,
      },
    },
    plugins: [
      react(),
      mode === "development" && componentTagger(),
      supabaseHost
        ? {
            name: "preconnect:supabase",
            transformIndexHtml(html: string) {
              return html.replace(
                "</head>",
                `    <link rel="preconnect" href="https://${supabaseHost}" />\n  </head>`
              );
            },
          }
        : null,
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ["react", "react-dom", "react-router-dom", "@tanstack/react-query", "lucide-react"],
          },
        },
      },
    },
  };
});
