import { useEffect, useState } from "react";
import { Provider } from "react-redux";
import ClickSpark from "./components/ClickSpark.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import AppRoutes from "./routes";
import Loader from "./components/Loader.jsx";
import store from "./store/store";
import AuthInitializer from "./components/AuthInitializer";
import { SubscriptionProvider } from "./contexts/SubscriptionContext";
import { Toaster } from "react-hot-toast";

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <Loader />;

  return (
    <Provider store={store}>
      <AuthInitializer>
        <SubscriptionProvider>
          <ClickSpark color="#ff5722" />
          <ScrollToTop />
          <AppRoutes />
          <Toaster />
        </SubscriptionProvider>
      </AuthInitializer>
    </Provider>
  );
}
export default App;
