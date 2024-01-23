import React, { useState, useEffect, useRef } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Flex,
  Text,
  Box,
} from "@chakra-ui/react";
import "./App.css";

function Main({ isClicked, isScreenExtended, defaultScreenSize }) {
  // Modal görünürlüğü için hook'u kullanma
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Ekran boyutu varsayılan değerlerini tutmak için useRef kullanma

  // Ekran boyutu durumu için state ve başlangıç değeri
  const [currentScreenSize, setCurrentScreenSize] = useState({
    width: "",
    height: "",
  });

  // Tarayıcı penceresinin odaklanma durumu
  const [hasFocus, setHasFocus] = useState(true);

  // Tam ekran durumu
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Geri sayım için kullanılan state
  const [reverseCounter, setReverseCounter] = useState(10);

  // Kural ihlali sayıları
  const [ruleBreakCount, setRuleBreakCount] = useState(0);
  const [isButtonVisible, setIsButtonVisible] = useState(false);
  const [screenSizeBreach, setScreenSizeBreach] = useState(0);
  const [focusBreach, setFocusBreach] = useState(0);
  const [extendedBreach, setExtendedBreach] = useState(0);

  // Pencere boyutu değişikliği durumunu ele alma
  const handleResize = () => {
    setCurrentScreenSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
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
      if (!isClicked) {
        // Eğer tıklanmadıysa, ana sayfaya yönlendirme
        window.location.href = "/";
        return;
      }
      // Tam ekran modunu açma
      element.requestFullscreen().catch((err) => {
        console.error("Tam ekran hatası:", err);
      });
    }

    // F11 tuşuna basıldığında tam ekran modunu açma
    const handleF11Press = (event) => {
      console.log("aaaaaa");
      if (event.key === "F11") {
        event.preventDefault();
        // Eğer tam ekran modu kapalıysa, açma
        if (!document.fullscreenElement) {
          element.requestFullscreen().catch((err) => {
            console.error("Tam ekran hatası:", err);
          });
        } else {
          document.exitFullscreen();
        }
      }
    };

    // F11 tuşu olayını dinleme
    window.addEventListener("keydown", handleF11Press);
  };

  // Modal içindeki butona tıklama olayı
  const modalButton = () => {
    if (!document.fullscreenElement) {
      // Tam ekran modunu açma
      document.documentElement.requestFullscreen().catch((err) => {
        console.error("Tam ekran hatası:", err);
      });
    }
  };

  // Komponentin monte edilmesi ve demonte edilmesini ele alma
  useEffect(() => {
    openFullScreen();
    handleResize();
    window.addEventListener("resize", handleResize);
    window.addEventListener("blur", handleBlur);
    window.addEventListener("focus", handleFocus);

    // Tam ekran değişikliğini ele alma
    const handleFullscreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  // Kural ihlali durumu için genel useEffect
  const intval = useRef(null);

  const handleRuleBreak = () => {
    onOpen();

    if (!intval.current) {
      intval.current = setInterval(() => {
        setReverseCounter((prev) => prev - 1);
      }, 1000);
    }

    setRuleBreakCount((prev) => prev + 1);
  };

  // Kural ihlali durumlarını ele alan useEffect'ler
  useEffect(() => {
    // Tam ekran modunda olup, ekran boyutu değişikliği durumu varsa kural ihlali
    if (
      isFullScreen &&
      !(
        defaultScreenSize.current.width === currentScreenSize.width &&
        defaultScreenSize.current.height === currentScreenSize.height
      )
    ) {
      console.log("def", defaultScreenSize.current, "cur", currentScreenSize);
      handleRuleBreak();
      setScreenSizeBreach((prev) => prev + 1);
      setIsButtonVisible(true);
    }
  }, [currentScreenSize, isFullScreen]);

  useEffect(() => {
    // Tam ekran modunda olup, odak kaybı durumu varsa kural ihlali
    if (isFullScreen && !hasFocus) {
      handleRuleBreak();
      setFocusBreach((prev) => prev + 1);
      setIsButtonVisible(false);
    }
  }, [hasFocus, isFullScreen]);

  useEffect(() => {
    // Tam ekran modunda olup, çoklu ekran durumu varsa kural ihlali
    if (isFullScreen && isScreenExtended) {
      handleRuleBreak();
      setExtendedBreach((prev) => prev + 1);
      setIsButtonVisible(false);
    }
  }, [isScreenExtended, isFullScreen]);

  useEffect(() => {
    // Tam ekran modunda olup, ekran boyutu, odak ve çoklu ekran durumları uygunsa kural ihlali yok
    if (
      isFullScreen &&
      document.fullscreenElement &&
      defaultScreenSize.current.width === currentScreenSize.width &&
      defaultScreenSize.current.height === currentScreenSize.height &&
      hasFocus &&
      !isScreenExtended
    ) {
      onClose();
      setReverseCounter(10);
      clearInterval(intval.current);
      intval.current = null;
    }
  }, [isFullScreen, hasFocus, isScreenExtended, currentScreenSize]);

  // Geri sayım sıfır olduğunda interval'i temizleme
  useEffect(() => {
    if (reverseCounter === 0) {
      clearInterval(intval.current);
    }
  }, [reverseCounter]);

  // Ana bileşen render'ı
  return (
    <>
      <Box position={"relative"}>
        <Flex
          justifyContent={"center"}
          alignItems={"center"}
          height={"100vh"}
          position={"relative"}
          top={0}
          left={0}
        >
          {/* Modal bileşeni */}
          <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            closeOnOverlayClick={false}
          >
            <ModalOverlay />
            <ModalContent>
              <ModalBody>
                {isScreenExtended
                  ? `Dikkat birden çok ekran algılandı, ikincil ekranı ${reverseCounter} saniye içinde kapatın!`
                  : `Dikkat Sınav odağı bozuldu ${reverseCounter} içinde odaklanın!`}
              </ModalBody>
              <ModalFooter>
                {isButtonVisible && (
                  <Button onClick={() => modalButton()}>Sınava dön</Button>
                )}
              </ModalFooter>
            </ModalContent>
          </Modal>
        </Flex>
        <Box position={"absolute"} top={"10%"} left={"10px"}>
          {/* Kural ihlali sayısını gösterme */}
          {ruleBreakCount !== 0 ? (
            <>
              <Text>İhlal sayısı : {ruleBreakCount}</Text>
              {screenSizeBreach !== 0 && (
                <Text>Ekran boyutu ihlal sayısı : {screenSizeBreach}</Text>
              )}
              {focusBreach !== 0 && (
                <Text>Sınav odağı ihlal sayısı : {focusBreach}</Text>
              )}
              {extendedBreach !== 0 && (
                <Text>Çoklu ekran ihlal sayısı : {extendedBreach}</Text>
              )}
            </>
          ) : (
            <Text>Herhangi bir ihlal yok devam edebilirsiniz</Text>
          )}
        </Box>
      </Box>
    </>
  );
}

export default Main;
