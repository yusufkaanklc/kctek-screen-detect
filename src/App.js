import { Route, Routes, Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import Main from "./Main.js";

function App() {
  const [isClicked, setIsClicked] = useState(false);
  const [isScreenExtended, setIsScreenExtended] = useState(null);
  const [isScreenRecorded, setIsScreenRecorded] = useState(false);

  const defaultScreenSize = useRef({
    width: "",
    height: "",
  });

  const handleExtended = () => {
    const element = window.screen.isExtended;
    setIsScreenExtended(element);
  };

  const handleScreenSize = () => {
    defaultScreenSize.current = {
      width: window.screen.width,
      height: window.screen.height,
    };
  };

  const fnBrowserDetect = () => {
    let isChrome;
    console.log(navigator.userAgent);
    if (
      navigator.userAgent.includes("Chrome") &&
      !navigator.userAgent.includes("Edg") &&
      !navigator.userAgent.includes("Firefox") &&
      !(
        navigator.userAgent.includes("Opera") ||
        navigator.userAgent.includes("Opr")
      )
    ) {
      isChrome = true;
    } else {
      isChrome = false;
    }
    return isChrome;
  };

  const handleScreenRecord = async () => {
    console.log("aaaa");
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { mediaSource: "screen" },
      });
      setIsScreenRecorded(true);
      console.log("Ekran kaydı alındı:", stream);
    } catch (error) {
      setIsScreenRecorded(false);
      console.error("Ekran kaydı alınırken bir hata oluştu:", error);
    }
  };

  window.onload = handleScreenRecord;

  useEffect(() => {
    handleScreenSize();
    handleExtended();

    // Resize olayını dinle
    window.screen.addEventListener("change", handleScreenSize);
    window.screen.addEventListener("change", handleExtended);

    return () => {
      window.screen.removeEventListener("change", handleScreenSize);
      window.screen.removeEventListener("change", handleExtended);
    };
  }, []);

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
            {fnBrowserDetect() ? (
              isScreenRecorded ? (
                <Link to="/main" onClick={() => setIsClicked(true)}>
                  Sınava Başlamak için tıkla
                </Link>
              ) : (
                <div>Ekran kaydına izin verin</div>
              )
            ) : (
              <div>Lütfen Chrome tarayıcı ile girin</div>
            )}
          </div>
        }
      />
      <Route
        path="/main"
        element={
          fnBrowserDetect() &&
          isScreenRecorded && (
            <Main
              isClicked={isClicked}
              isScreenExtended={isScreenExtended}
              defaultScreenSize={defaultScreenSize}
            />
          )
        }
      />
    </Routes>
  );
}

export default App;
