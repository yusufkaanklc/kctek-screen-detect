import { Route, Routes, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Main from "./Main.js";

function App() {
  const [isClicked, setIsClicked] = useState(false);
  const [screenCount, setScreenCount] = useState(null);

  useEffect(() => {
    // Ekran genişliği ve yüksekliği değiştiğinde çalışacak kod
    const handleResize = () => {
      window.getScreenDetails().then((res) => {
        if (res.screens.length !== screenCount) {
          console.log(`Ekran sayısı değişti: ${res.screens.length}`);
          setScreenCount(res.screens.length);
        }
      });
    };

    // Resize olayını dinle
    window.addEventListener("resize", handleResize);

    // Component unmount olduğunda dinleyiciyi kaldır
    return () => {
      window.removeEventListener("resize", handleResize);
    };

    // Diğer bağımlılıklar burada olabilir (eğer varsa)
  }, [screenCount]);

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
        element={<Main isClicked={isClicked} screenCount={screenCount} />}
      />
    </Routes>
  );
}

export default App;
