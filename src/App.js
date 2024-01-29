import { Route, Routes, Link, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button, Flex, Text } from "@chakra-ui/react";
import Main from "./main.js";
import ScreenRecord from "./ScreenRecord.js";
// import "./Debugger.js";

function App() {
  // Debugger'ın durumunu takip etmek için state
  // const [debuggerBool, setDebuggerBool] = useState(
  //   window.devtoolsDetector.isOpen
  // );

  // Çeşitli koşulları takip etmek için state'ler
  const [isClicked, setIsClicked] = useState(false);
  const [isScreenExtended, setIsScreenExtended] = useState(null);
  const [isScreenRecorded, setIsScreenRecorded] = useState(false);
  const [isDevToolsOpen, setIsDevToolsOpen] = useState(false);
  const [isScreenSize, setIsScreenSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // Ekran uzatma durumunu ele alan fonksiyon
  const handleExtended = () => {
    const element = window.screen.isExtended;
    setIsScreenExtended(element);
  };

  const handleScreenSize = () => {
    setIsScreenSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };
  function checkDevTools() {
    console.log("debugger");
    const threshold = 160;

    const start = new Date().getTime();
    debugger;
    const end = new Date().getTime();

    const isOpen = end - start > threshold;

    if (isOpen) {
      setIsDevToolsOpen(true);
    } else {
      setIsDevToolsOpen(false);
    }
  }

  // Chrome tarayıcıyı algılayan fonksiyon
  const fnBrowserDetect = () => {
    let isChrome;
    if (
      navigator.userAgent.includes("Chrome") &&
      !navigator.userAgent.includes("Edg") &&
      !navigator.userAgent.includes("Firefox") &&
      !(
        navigator.userAgent.includes("Opera") ||
        navigator.userAgent.includes("OPR")
      )
    ) {
      isChrome = true;
    } else {
      isChrome = false;
    }
    return isChrome;
  };

  // Pencere yüklendiğinde yapılacak işlemleri ele alan fonksiyon
  window.onload = function () {
    if (fnBrowserDetect()) {
      !isScreenRecorded && ScreenRecord(setIsScreenRecorded);
    }
    // burada debugger çalışıyor
    checkDevTools();
  };

  useEffect(() => {
    // Ekran değişikliği olayını dinlemek için event listener ekleniyor
    window.addEventListener("resize", handleScreenSize);
    window.screen.addEventListener("change", handleExtended);

    return () => {
      // Component unmount olduğunda event listener kaldırılıyor
      window.removeEventListener("resize", handleScreenSize);
      window.screen.removeEventListener("change", handleExtended);
    };
  }, []);

  useEffect(() => {
    checkDevTools();
  }, [isScreenSize]);

  // Sayfaları render et
  return (
    <>
      {isDevToolsOpen ? <div>açık</div> : <div>kapalı</div>}
      <Routes>
        <Route
          path="/"
          element={linkPage(
            fnBrowserDetect,
            isScreenRecorded,
            isClicked,
            setIsClicked,
            setIsScreenRecorded
          )}
        />
        <Route
          path="/main"
          element={
            <Main
              isClicked={isClicked}
              isScreenExtended={isScreenExtended}
              isScreenRecorded={isScreenRecorded}
              setIsScreenRecorded={setIsScreenRecorded}
              // debuggerBool={debuggerBool}
              // setDebuggerBool={setDebuggerBool}
            />
          }
        />
      </Routes>
    </>
  );
}

// Browser tespiti ve diğer koşullara göre içeriği render etmek için fonksiyon
const linkPage = (
  fnBrowserDetect,
  isScreenRecorded,
  isClicked,
  setIsClicked,
  setIsScreenRecorded
) => {
  return (
    <>
      <Flex align={"center"} justify={"center"} h={"100vh"} bg={"#E8E8E8"}>
        <Flex
          flexDirection={"column"}
          align={"flex-end"}
          bg={"white"}
          p={6}
          borderRadius={"10"}
          boxShadow={"0 0 20px 0 rgba(0, 0, 0, 0.1)"}
        >
          {fnBrowserDetect ? (
            isScreenRecorded ? (
              isClicked ? (
                // Zaten tıklandıysa ana sayfaya yönlendir
                <Navigate to="/main" />
              ) : (
                // Tıklama başlatmak için bağlantıyı göster
                <Link to="/" onClick={() => setIsClicked(true)}>
                  <Text fontWeight={"500"} onClick={() => setIsClicked(true)}>
                    Sınava Girebilmek için lütfen tıklayın
                  </Text>
                </Link>
              )
            ) : (
              <Text fontWeight={"500"}>
                Sınava girebilmek için lütfen ekran kaydına izin verin
              </Text>
            )
          ) : (
            <Text fontWeight={"500"}>
              Sınava Girebilmek için lütfen Chrome tarayıcı ile girin
            </Text>
          )}

          {!isScreenRecorded && (
            <Button
              variant={"outline"}
              colorScheme="green"
              mt={6}
              onClick={() => {
                setIsScreenRecorded(false);
                ScreenRecord(setIsScreenRecorded);
              }}
            >
              İzin ver
            </Button>
          )}
        </Flex>
      </Flex>
    </>
  );
};

export default App;
