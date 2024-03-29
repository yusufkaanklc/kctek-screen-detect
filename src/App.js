import { Route, Routes, Link, Navigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { Button, Flex, Text } from "@chakra-ui/react";
import Main from "./main.js";
import ScreenRecord from "./ScreenRecord.js";

function App() {
  // Çeşitli koşulları takip etmek için state'ler
  const [isClicked, setIsClicked] = useState(false);
  const [isScreenExtended, setIsScreenExtended] = useState(null);
  const [isScreenRecorded, setIsScreenRecorded] = useState(false);
  const [isDevToolsOpen, setIsDevToolsOpen] = useState(false);
  const prevDevToolsState = useRef(false);

  // Ekran uzatma durumunu ele alan fonksiyon
  const handleExtended = () => {
    const element = window.screen.isExtended;
    setIsScreenExtended(element);
  };

  function checkDevTools() {
    if (window.location.pathname === "/main") {
      const errorObject = Object.defineProperties(new Error(), {
        message: {
          get() {
            setIsDevToolsOpen(true);
          },
        },
        toString: {
          value() {
            setIsDevToolsOpen(false);
          },
        },
      });

      console.log(errorObject);
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
  };

  useEffect(() => {
    checkDevTools();
    const devToolsInterval = setInterval(checkDevTools, 500);
    handleExtended();
    // Ekran değişikliği olayını dinlemek için event listener ekleniyor
    window.screen.addEventListener("change", handleExtended);

    return () => {
      clearInterval(devToolsInterval);
      // Component unmount olduğunda event listener kaldırılıyor
      window.screen.removeEventListener("change", handleExtended);
    };
  }, []);

  useEffect(() => {
    console.log(isDevToolsOpen);
  }, [isDevToolsOpen]);

  // Sayfaları render et
  return (
    <>
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
              isDevToolsOpen={isDevToolsOpen}
              prevDevToolsState={prevDevToolsState}
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
  setIsScreenRecorded,
  isDevToolsOpen
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
              ) : isDevToolsOpen > 0 ? (
                <Text fontWeight={"500"} color={"black"}>
                  Sınava Girebilmek için geliştirici konsolunu kapatın
                </Text>
              ) : (
                // Tıklama başlatmak için bağlantıyı göster
                <Link to="/" onClick={() => setIsClicked(true)}>
                  <Text fontWeight={"500"} color={"black"}>
                    Sınava Girebilmek için lütfen tıklayın
                  </Text>
                </Link>
              )
            ) : (
              <Text fontWeight={"500"} color={"black"}>
                Sınava girebilmek için lütfen ekran kaydına izin verin
              </Text>
            )
          ) : (
            <Text fontWeight={"500"} color={"black"}>
              Sınava Girebilmek için lütfen Chrome tarayıcı ile girin
            </Text>
          )}

          {!isScreenRecorded && (
            <Button
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
