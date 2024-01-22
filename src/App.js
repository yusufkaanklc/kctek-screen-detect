import { Route, Routes, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Main from "./Main.js";

function App() {
  const [isClicked, setIsClicked] = useState(false);
  const [isScreenExtended, setIsScreenExtended] = useState(null);

  useEffect(() => {
    // Ekran genişliği ve yüksekliği değiştiğinde çalışacak kod
    const handleResize = () => {
      const currentScreen = window.screen;
      setIsScreenExtended(currentScreen.isExtended);
    };

    // Resize olayını dinle
    window.addEventListener("resize", handleResize);

    // fullscreenchange olayını dinle
    document.addEventListener("fullscreenchange", handleResize);

    // Component unmount olduğunda dinleyiciyi kaldır
    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("fullscreenchange", handleResize);
    };

    // Diğer bağımlılıklar burada olabilir (eğer varsa)
  }, [isScreenExtended]);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100vh",
            }}
          >
            <Link to="/main" onClick={() => setIsClicked(true)}>
              Sınava Başlamak için tıkla
            </Link>
          </div>
        }
      />
      <Route
        path="/main"
        element={
          <Main isClicked={isClicked} isScreenExtended={isScreenExtended} />
        }
      />
    </Routes>
  );
}

export default App;
