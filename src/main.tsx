import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import { Toaster } from "./components/ui/sonner";
import { CartProvider } from "./lib/cart";
import "./styles.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CartProvider>
      <App />
      <Toaster richColors position="top-right" />
    </CartProvider>
  </StrictMode>,
);
