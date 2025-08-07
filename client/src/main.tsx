import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

const rootElement = document.getElementById("root");
if (rootElement) {
  try {
    const root = createRoot(rootElement);
    root.render(<App />);
  } catch (error) {
    console.error("Failed to render App:", error);
    rootElement.innerHTML = `
      <div style="padding: 20px; text-align: center; color: red;">
        <h2>載入錯誤</h2>
        <p>應用程式無法啟動，請重新整理頁面</p>
        <button onclick="window.location.reload()">重新載入</button>
      </div>
    `;
  }
} else {
  console.error("Root element not found!");
}
