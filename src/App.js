import { Route, Routes, Link, Navigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { Button, Flex, Text } from "@chakra-ui/react";
import Main from "./main.js";
import ScreenRecord from "./ScreenRecord.js";
import "./Debugger.js";

function App() {
  const [debuggerBool, setDebuggerBool] = useState(
    window.devtoolsDetector.isOpen
  );

  const [isClicked, setIsClicked] = useState(false);
  const [isScreenExtended, setIsScreenExtended] = useState(null);
  const [isScreenRecorded, setIsScreenRecorded] = useState(false);

  const handleExtended = () => {
    const element = window.screen.isExtended;
    setIsScreenExtended(element);
  };

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

  window.onload = function () {
    if (fnBrowserDetect()) {
      !isScreenRecorded && ScreenRecord(setIsScreenRecorded);
    }
  };

  const handleUrl = () => {
    if (window.location.pathname !== "/" && !isClicked) {
      window.location.href = "/";
    }
  };

  useEffect(() => {
    handleExtended();
    handleUrl();

    // Resize olayını dinle

    window.screen.addEventListener("change", handleExtended);
    return () => {
      window.screen.removeEventListener("change", handleExtended);
    };
  }, []);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Flex align={"center"} justify={"center"} h={"100vh"}>
            {fnBrowserDetect() ? (
              isScreenRecorded ? (
                isClicked ? (
                  <Navigate to="/main" />
                ) : (
                  <Link to="/" onClick={() => setIsClicked(true)}>
                    Sınava Girebilmek için lütfen tıklayın
                  </Link>
                )
              ) : (
                <Flex flexDirection={"column"} align={"flex-end"}>
                  <Text>
                    Sınava girebilmek için lütfen ekran kaydına izin verin
                  </Text>
                  <Button
                    mt={2}
                    onClick={() => {
                      setIsScreenRecorded(false);
                      ScreenRecord(setIsScreenRecorded);
                    }}
                  >
                    izin ver
                  </Button>
                </Flex>
              )
            ) : (
              <div>Sınava Girebilmek için lütfen Chrome tarayıcı ile girin</div>
            )}
          </Flex>
        }
      />
      <Route
        path="/main"
        element={
          <Main
            isClicked={isClicked}
            isScreenExtended={isScreenExtended}
            isScreenRecorded={isScreenRecorded}
            setIsScreenRecorded={setIsScreenRecorded}
            debuggerBool={debuggerBool}
            setDebuggerBool={setDebuggerBool}
          />
        }
      />
    </Routes>
  );
}

export default App;
