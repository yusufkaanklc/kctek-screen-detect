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

function Main({ isClicked }) {
  // Modal görünürlüğü için hook'u kullanma
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Ekran boyutu durumu için state ve başlangıç değeri
  const [currentScreenSize, setCurrentScreenSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // Default ekran boyutu için useRef kullanma
  const defaultScreenSize = useRef({
    width: window.screen.width,
    height: window.screen.height,
  });

  // Tarayıcı penceresinin odaklanma durumu
  const [hasFocus, setHasFocus] = useState(true);

  // Tarayıcı sekmesi değişiklik durumu
  const [isTabChange, setIsTabChange] = useState(false);

  // Tam ekran durumu
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Geri sayım için kullanılan state
  const [reverseCounter, setReverseCounter] = useState(10);

  // Kural ihlali sayısı
  const [ruleBreakCount, setRuleBreakCount] = useState(0);

  // Pencere boyutu değişikliği durumunu ele alma
  const handleResize = () => {
    setCurrentScreenSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };

  // Tarayıcı sekmesi değişikliğini ele alma
  const handleTabChange = () => {
    setIsTabChange((prev) => !prev);
  };

  // Pencere odak kaybını ele alma
  const handleBlur = () => {
    setHasFocus(false);
  };

  // Pencere odak kazanımını ele alma
  const handleFocus = () => {
    setHasFocus(true);
  };

  // Tam ekran modunu açma
  const openFullScreen = () => {
    const element = document.documentElement;

    if (!document.fullscreenElement) {
      if (isClicked) console.log("link ile girildi");
      else {
        window.location.href = "/"
        return
      };
      element.requestFullscreen().catch((err) => {
        console.error("Tam ekran hatası:", err);
      });
    }

    // F11 tuşuna basıldığında tam ekran modunu açma
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

    // F11 tuşu olayını dinleme
    if (element.requestFullscreen) {
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

  // Komponentin monte edilmesi ve demonte edilmesini ele alma
  useEffect(() => {
    openFullScreen();

    window.addEventListener("resize", handleResize);
    document.addEventListener("visibilitychange", handleTabChange);

    window.addEventListener("blur", handleBlur);
    window.addEventListener("focus", handleFocus);

    // Tam ekran değişikliğini ele alma
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

  // Geri sayım ve modal kontrolü için useEffect
  const intval = useRef(null);

  useEffect(() => {
    if (isFullScreen) {
      if (
        defaultScreenSize.current.width !== currentScreenSize.width ||
        defaultScreenSize.current.height !== currentScreenSize.height ||
        !document.fullscreenElement ||
        isTabChange ||
        !hasFocus
      ) {
        // Konsola bir mesaj yaz ve modalı aç
        console.log("Bir şey değişti. Modal açılıyor...");

        onOpen();

        if (intval.current) return;

        // Geri sayım başlatma
        intval.current = setInterval(() => {
          setReverseCounter((prev) => prev - 1);
        }, 1000);

        // Kural ihlali sayısını artırma
        setRuleBreakCount((prev) => prev + 1);
      } else {
        // Değişen bir şey yoksa, konsola bir mesaj yaz ve modalı kapat
        console.log("Değişen bir şey yok. Modal kapatılıyor...");
        onClose();
        setReverseCounter(10);
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

  // Geri sayım sıfır olduğunda interval'i temizleme
  useEffect(() => {
    if (reverseCounter === 0) {
      clearInterval(intval.current);
      intval.current = null;
    }
  }, [reverseCounter]);

  // Konsola ekran boyutu bilgilerini yazma
  useEffect(() => {
    console.log(defaultScreenSize.current);
    console.log("current", currentScreenSize);
  }, [defaultScreenSize]);

  // Ana bileşen render'ı
  return (
    <>
      <Flex justifyContent={"center"} alignItems={"center"} height={"100vh"}>
        {/* Modal bileşeni */}
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
        {/* Kural ihlali sayısını gösterme */}
        {ruleBreakCount !== 0 ? (
          <Text>İhlal sayısı : {ruleBreakCount}</Text>
        ) : (
          <Text>Herhangi bir ihlal yok devam edebilirsiniz</Text>
        )}
      </Flex>
    </>
  );
}

export default Main;
