import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import App from "./App.tsx";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { InitDataContextProviver } from "./hooks/useInitData.tsx";
import { parseInitDataQuery } from "@telegram-apps/sdk";

const queryClient = new QueryClient();

// Безопасный парсинг initData: в браузере вне Telegram строка может отсутствовать
const rawInitData = (window as any)?.Telegram?.WebApp?.initData || "";
let initData = null as any;
if (rawInitData) {
  try {
    initData = parseInitDataQuery(rawInitData);
  } catch (error) {
    console.error("Failed to parse Telegram initData:", error);
    initData = null;
  }
} else {
  initData = null;
}
// const initData = parseInitDataQuery('query_id=AAFaCxkqAAAAAFoLGSq2MO94&user=%7B%22id%22%3A706284378%2C%22first_name%22%3A%22%D0%9D%D0%B8%D0%BA%D0%B8%D1%82%D0%B0%22%2C%22last_name%22%3A%22%22%2C%22username%22%3A%22ChilDrake%22%2C%22language_code%22%3A%22ru%22%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2FA9lvB76GTPMhQuwI-S0Nt5t8XAEa8SsqImGoLG9Jwb8.svg%22%7D&auth_date=1738230125&signature=e-fDQ74DxS7JxMT_Gvrcm7vziZPzleQTMRJvPTG-wtmyOG8ZZFvkwb5TdEvmkuiV6I0wYcwmyRC3mpMjxCtfCw&hash=0107f728ffa322e1c7cb605f2ca3d435684b7f98bae76fe78ab9b4bd51f1a910')

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <InitDataContextProviver value={initData}>
          <Toaster containerStyle={{ zIndex: 10000 }} />
          <App />
        </InitDataContextProviver>
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>
);
