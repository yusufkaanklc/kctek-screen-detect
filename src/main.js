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
import handleScreenRecord from "./ScreenRecord.js";

function Main({
  isClicked,
  isScreenExtended,
  isScreenRecorded,
  setIsScreenRecorded,
  isDevToolsOpen,
  prevDevToolsState,
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [currentScreenSize, setCurrentScreenSize] = useState({
    width: "",
    height: "",
  });
  const [hasFocus, setHasFocus] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [reverseCounter, setReverseCounter] = useState(10);
  const [ruleBreakCount, setRuleBreakCount] = useState(0);
  const [isButtonVisible, setIsButtonVisible] = useState(false);
  const [focusBreach, setFocusBreach] = useState(0);
  const [extendedBreach, setExtendedBreach] = useState(0);
  const [devToolsBreach, setDevToolsBreach] = useState(0);
  const [screenExtendedFlag, setScreenExtendedFlag] = useState(false);
  const [screenRecordedFlag, setScreenRecordedFlag] = useState(false);
  const [focusFlag, setFocusFlag] = useState(false);
  const [devToolsFlag, setDevToolsFlag] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const handleResize = () => {
    setCurrentScreenSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };

  const handleBlur = () => {
    setHasFocus(false);
  };

  const handleFocus = () => {
    setHasFocus(true);
  };

  const openFullScreen = () => {
    const element = document.documentElement;

    if (!document.fullscreenElement) {
      if (!isClicked) {
        window.location.href = "/";
        return;
      }
      element.requestFullscreen().catch((err) => {
        console.error("Tam ekran hatası:", err);
      });
    }

    const handleF11Press = (event) => {
      if (event.key === "F11") {
        event.preventDefault();
        if (event.key === "Escape") {
          return;
        }

        if (!document.fullscreenElement) {
          element.requestFullscreen().catch((err) => {
            console.error("Tam ekran hatası:", err);
          });
        } else {
          document.exitFullscreen();
        }
      }
    };

    window.addEventListener("keydown", handleF11Press);
  };

  const modalButton = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error("Tam ekran hatası:", err);
      });
    }
    if (!isScreenRecorded) {
      setRuleBreakCount((prev) => prev - 1);
      handleScreenRecord(setIsScreenRecorded);
    }
  };

  useEffect(() => {
    openFullScreen();
    handleResize();
    window.addEventListener("resize", handleResize);
    window.addEventListener("blur", handleBlur);
    window.addEventListener("focus", handleFocus);

    const handleFullscreenChange = () => {
      setIsFullScreen(
        !!document.fullscreenElement &&
          !screenExtendedFlag &&
          !screenRecordedFlag &&
          !devToolsFlag
      );
      if (!document.fullscreenElement) {
        handleRuleBreak();
        setFocusBreach((prev) => prev + 1);
        setIsButtonVisible(true);
        setScreenRecordedFlag(false);
        setFocusFlag(true);
        setDevToolsFlag(false);
        setScreenExtendedFlag(false);
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

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

  useEffect(() => {
    if (ruleBreakCount === 3) {
      clearInterval(intval.current);
      setIsFinished(true);
      onClose();
    }
  }, [ruleBreakCount, onClose]);

  useEffect(() => {
    if (reverseCounter === 0) {
      setIsFinished(true);
      clearInterval(intval.current);
    }
  }, [reverseCounter, onClose]);

  useEffect(() => {
    if (isFinished) onClose();
  }, [isFinished]);

  useEffect(() => {
    if (
      isFullScreen &&
      !hasFocus &&
      !screenRecordedFlag &&
      !screenExtendedFlag &&
      !devToolsFlag &&
      !isFinished
    ) {
      if (!focusFlag) {
        handleRuleBreak();
        setFocusBreach((prev) => prev + 1);
        setIsButtonVisible(false);
        setScreenExtendedFlag(false);
        setScreenRecordedFlag(false);
        setFocusFlag(true);
        setDevToolsFlag(false);
      }
    }
  }, [hasFocus, isFullScreen]);

  useEffect(() => {
    if (
      isFullScreen &&
      isScreenExtended &&
      !screenRecordedFlag &&
      !focusFlag &&
      !isFinished &&
      !devToolsFlag
    ) {
      if (!screenExtendedFlag) {
        handleRuleBreak();
        setExtendedBreach((prev) => prev + 1);
        setIsButtonVisible(false);
        setScreenRecordedFlag(false);
        setFocusFlag(false);
        setDevToolsFlag(false);
        setScreenExtendedFlag(true);
      }
    }
  }, [isScreenExtended, isFullScreen]);

  useEffect(() => {
    if (
      !isScreenRecorded &&
      !focusFlag &&
      !screenExtendedFlag &&
      !isFinished &&
      !devToolsFlag
    ) {
      if (!screenRecordedFlag) {
        handleRuleBreak();
        setRuleBreakCount((prev) => prev - 1);
        setIsButtonVisible(true);
        setScreenExtendedFlag(false);
        setFocusFlag(false);
        setDevToolsFlag(false);
        setScreenRecordedFlag(true);
      }
    }
  }, [isScreenRecorded]);

  useEffect(() => {
    // Check if isDevToolsOpen changed from false to true
    if (isDevToolsOpen === true && !isFinished && !prevDevToolsState.current) {
      setDevToolsBreach((prev) => prev + 1);
      setRuleBreakCount((prev) => prev - 1);
      handleRuleBreak();
      setIsButtonVisible(false);
      setScreenRecordedFlag(false);
      setFocusFlag(false);
      setDevToolsFlag(true);
      setScreenExtendedFlag(false);
    }
    // Update the previous state
    prevDevToolsState.current = isDevToolsOpen;
  }, [isDevToolsOpen, isFinished]);

  useEffect(() => {
    if (
      isFullScreen &&
      document.fullscreenElement &&
      hasFocus &&
      !isScreenExtended &&
      isScreenRecorded &&
      !isDevToolsOpen
    ) {
      onClose();
      setReverseCounter(10);
      clearInterval(intval.current);
      intval.current = null;
      setScreenExtendedFlag(false);
      setFocusFlag(false);
      setScreenRecordedFlag(false);
      setDevToolsFlag(false);
    }
  }, [
    isFullScreen,
    hasFocus,
    isScreenExtended,
    isScreenRecorded,
    isDevToolsOpen,
    currentScreenSize,
  ]);

  return (
    <>
      <Box position={"relative"}>
        <Flex
          justifyContent={"center"}
          alignItems={"center"}
          height={"100vh"}
          bg={"#E8E8E8"}
          position={"relative"}
          top={0}
          left={0}
        >
          <Modal
            isOpen={isOpen && !isFinished}
            onRequestClose={onClose}
            closeOnOverlayClick={false}
          >
            <ModalOverlay />
            <ModalContent>
              <ModalBody px={6} pt={6} fontWeight={500}>
                {screenExtendedFlag &&
                  !isFinished &&
                  `Dikkat! Birden çok ekran algılandı, ikincil ekranı ${reverseCounter} saniye içinde kapatın!`}
                {devToolsFlag &&
                  !isFinished &&
                  `Dikkat! Geliştirici konsolu açık, lütfen ${reverseCounter} saniye içinde kapatın!`}
                {screenRecordedFlag &&
                  !isFinished &&
                  `Dikkat! Ekran kaydı durduruldu, ${reverseCounter} saniye içinde tekrar başlatın!`}
                {focusFlag &&
                  !isFinished &&
                  `Dikkat! Sınav odağı bozuldu, ${reverseCounter} saniye içinde odaklanın!`}
              </ModalBody>
              <ModalFooter p={6}>
                {isButtonVisible && !isFinished && (
                  <Button onClick={() => modalButton()} colorScheme="red">
                    {screenRecordedFlag ? "Kaydı başlat" : "Sınava dön"}
                  </Button>
                )}
              </ModalFooter>
            </ModalContent>
          </Modal>
        </Flex>
        <Box position={"absolute"} top={0} left={0} zIndex={1}>
          <Flex
            justify={"center"}
            height={"100vh"}
            w={"100vw"}
            flexDir={"column"}
            align={"center"}
          >
            <Box
              bg={"white"}
              p={6}
              borderRadius={"10"}
              boxShadow={"0 0 20px 0 rgba(0, 0, 0, 0.1)"}
              textAlign={"center"}
            >
              <Text fontWeight={500} color={"black"}>
                {isFinished
                  ? "Dikkat! Kural ihlali sınırı aşıldı"
                  : ruleBreakCount === 0 &&
                    focusBreach === 0 &&
                    extendedBreach === 0 &&
                    devToolsBreach === 0
                  ? "Herhangi bir ihlal yok, sınava devam edebilirsiniz"
                  : !focusFlag &&
                    !screenExtendedFlag &&
                    !devToolsFlag &&
                    isScreenRecorded
                  ? "Sınava devam edebilirsiniz"
                  : ""}
              </Text>
              {isFinished
                ? ""
                : (ruleBreakCount !== 0 ||
                    focusBreach !== 0 ||
                    extendedBreach !== 0) && (
                    <>
                      <Text
                        fontWeight={500}
                        mt={!focusFlag && !screenExtendedFlag ? 3 : ""}
                        color={"black"}
                      >
                        Toplam ihlal sayısı: {ruleBreakCount} / 3
                      </Text>
                    </>
                  )}
            </Box>
          </Flex>
        </Box>
      </Box>
    </>
  );
}

export default Main;
