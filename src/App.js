import React, { useState, useEffect, useRef } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  useDisclosure,
  Flex,
  Text,
} from "@chakra-ui/react";
import "./App.css";
import { calcLength } from "framer-motion";

function App() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [currentScreenSize, setCurrentScreenSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const [defaultScreenSize, setDefaultScreenSize] = useState({
    width: window.screen.width,
    height: window.screen.height,
  });

  const [hasFocus, setHasFocus] = useState(true);
  const [isTabChange, setIsTabChange] = useState(false);

  const [isFullScreen, setIsFullScreen] = useState(false);

  const [reverseCounter, setReverseCounter] = useState(10);

  const [ruleBreakCount, setRuleBreakCount] = useState(0);

  const handleResize = () => {
    setCurrentScreenSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };

  const handleTabChange = () => {
    setIsTabChange((prev) => !prev);
  };

  const handleBlur = () => {
    setHasFocus(false);
  };

  const handleFocus = () => {
    setHasFocus(true);
  };

  const openFullScreen = () => {
    const element = document.documentElement;

    const clickHandler = () => {
      if (!document.fullscreenElement) {
        element.requestFullscreen().catch((err) => {
          console.error("Tam ekran hatası:", err);
        });
      }
    };

    const handleModalClose = () => {
      // Burada modalın kapatılmasını engelleyecek bir koşul ekleyebilirsiniz.
      // Örneğin, isFullScreen durumu veya başka bir durum kontrolü ekleyebilirsiniz.
      if (isFullScreen) {
        console.log("Modal kapatılamaz, tam ekran modundayız.");
        return;
      }

      // Modalı kapatma işlemi
      onClose();
    };

    const handleF11Press = (event) => {
      if (event.key === "F11") {
        event.preventDefault(); // Bu, tarayıcının varsayılan F11 işlevini devre dışı bırakır
        if (!document.fullscreenElement) {
          element.requestFullscreen().catch((err) => {
            console.error("Tam ekran hatası:", err);
          });
        }
      }
    };

    if (element.requestFullscreen) {
      // Tıklama olayını dinle
      document.addEventListener("click", clickHandler);
      window.addEventListener("keydown", handleF11Press);
    } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen().catch((err) => {
        console.error("Tam ekran hatası:", err);
      });
    } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen().catch((err) => {
        console.error("Tam ekran hatası:", err);
      });
    }
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    document.addEventListener("visibilitychange", handleTabChange);

    openFullScreen();

    window.addEventListener("blur", handleBlur);
    window.addEventListener("focus", handleFocus);

    const handleFullscreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleTabChange);
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const intval = useRef(null);

  useEffect(() => {
    if (isFullScreen) {
      if (
        defaultScreenSize.width !== currentScreenSize.width ||
        defaultScreenSize.height !== currentScreenSize.height ||
        !document.fullscreenElement ||
        isTabChange ||
        !hasFocus
      ) {
        // Konsola bir mesaj yaz ve modalı aç
        console.log("Bir şey değişti. Modal açılıyor...");

        onOpen();

        if (intval.current) return;

        intval.current = setInterval(() => {
          setReverseCounter((prev) => prev - 1);
        }, 1000);

        setRuleBreakCount((prev) => prev + 1);
      } else {
        // Değişen bir şey yoksa, konsola bir mesaj yaz ve modalı kapat
        console.log("Değişen bir şey yok. Modal kapatılıyor...");
        onClose();
        setReverseCounter(10);
        // clearTimeout(reverseCounterId);
        clearInterval(intval.current);
        intval.current = null;
      }
    }
  }, [
    isFullScreen,
    currentScreenSize,
    defaultScreenSize,
    isTabChange,
    hasFocus,
  ]);

  useEffect(() => {
    if (reverseCounter === 0) {
      clearInterval(intval.current);
      intval.current = null;
    }
  }, [reverseCounter]);

  return (
    <>
      <Flex justifyContent={"center"} alignItems={"center"} height={"100vh"}>
        <Modal
          isOpen={isOpen}
          onRequestClose={onClose}
          closeOnOverlayClick={false}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalBody>
              Dikkat Sınav odağı bozuldu {reverseCounter} içinde odaklanın!
            </ModalBody>
          </ModalContent>
        </Modal>
        {ruleBreakCount !== 0 ? (
          <Text>İhlal sayısı : {ruleBreakCount}</Text>
        ) : (
          <Text>Herhangi bir ihlal yok devam edebilirsiniz</Text>
        )}
      </Flex>
    </>
  );
}

export default App;
