import { useEffect, useState } from "react";
import ClickSpark from "./components/ClickSpark.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import AppRoutes from "./routes";
import Loader from "./components/Loader.jsx";

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <ClickSpark color="#ff5722" />
      <ScrollToTop />
      <AppRoutes />
    </>
  );
}

export default App;
