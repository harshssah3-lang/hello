import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { initSupaStorage } from "./lib/supaStorage";

async function bootstrap() {
  try {
    await initSupaStorage();
  } catch (e) {
    console.warn('[bootstrap] supaStorage init failed', e);
  }
  createRoot(document.getElementById("root")!).render(<App />);
}

bootstrap();
