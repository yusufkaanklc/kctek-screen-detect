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
  debuggerBool,
  setDebuggerBool,
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
  const [screenExtendedFlag, setScreenExtendedFlag] = useState(false);
  const [screenRecordedFlag, setScreenRecordedFlag] = useState(false);
  const [focusFlag, setFocusFlag] = useState(false);
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
    let timer = setInterval(() => {
      setDebuggerBool(window.devtoolsDetector.isOpen);
    }, 500);

    openFullScreen();
    handleResize();
    window.addEventListener("resize", handleResize);
    window.addEventListener("blur", handleBlur);
    window.addEventListener("focus", handleFocus);

    /**
     * @returns Array
     * @number ASd
     */
    const handleFullscreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
      if (!document.fullscreenElement) {
        handleRuleBreak();
        setFocusBreach((prev) => prev + 1);
        setIsButtonVisible(true);
        setScreenRecordedFlag(false);
        setFocusFlag(true);
        setScreenExtendedFlag(false);
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      clearInterval(timer);
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
      setIsFinished(true);
    }
  }, [ruleBreakCount]);

  useEffect(() => {
    if (reverseCounter === 0) {
      setIsFinished(true);
      clearInterval(intval.current);
    }
  }, [reverseCounter]);

  useEffect(() => {
    //if (isFinished) onClose();
  }, [isFinished]);

  useEffect(() => {
    if (
      isFullScreen &&
      !hasFocus &&
      !screenRecordedFlag &&
      !screenExtendedFlag
    ) {
      handleRuleBreak();
      setFocusBreach((prev) => prev + 1);
      setIsButtonVisible(false);
      setScreenExtendedFlag(false);
      setScreenRecordedFlag(false);
      setFocusFlag(true);
    }
  }, [hasFocus, isFullScreen]);

  useEffect(() => {
    if (isFullScreen && isScreenExtended && !screenRecordedFlag && !focusFlag) {
      handleRuleBreak();
      setExtendedBreach((prev) => prev + 1);
      setIsButtonVisible(false);
      setScreenRecordedFlag(false);
      setFocusFlag(false);
      setScreenExtendedFlag(true);
    }
  }, [isScreenExtended, isFullScreen]);

  useEffect(() => {
    if (!isScreenRecorded && !focusFlag && !screenExtendedFlag) {
      handleRuleBreak();
      setRuleBreakCount((prev) => prev - 1);
      setIsButtonVisible(true);
      setScreenExtendedFlag(false);
      setFocusFlag(false);
      setScreenRecordedFlag(true);
    }
  }, [isScreenRecorded]);

  useEffect(() => {
    if (
      debuggerBool &&
      !focusFlag &&
      !screenRecordedFlag &&
      !screenExtendedFlag
    ) {
      handleRuleBreak();
      setIsButtonVisible(false);
      setScreenExtendedFlag(false);
      setFocusFlag(true);
      setScreenRecordedFlag(false);
    }
  }, [debuggerBool, isFullScreen]);

  useEffect(() => {
    if (
      isFullScreen &&
      document.fullscreenElement &&
      hasFocus &&
      !isScreenExtended &&
      !debuggerBool &&
      isScreenRecorded
    ) {
      onClose();
      setReverseCounter(10);
      clearInterval(intval.current);
      intval.current = null;
      setScreenExtendedFlag(false);
      setFocusFlag(false);
      setScreenRecordedFlag(false);
    }
  }, [
    isFullScreen,
    hasFocus,
    isScreenExtended,
    isScreenRecorded,
    currentScreenSize,
    debuggerBool,
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
            isOpen={isOpen}
            onRequestClose={onClose}
            closeOnOverlayClick={false}
          >
            <ModalOverlay />
            <ModalContent>
              <ModalBody px={6} pt={6} fontWeight={500}>
                {screenExtendedFlag &&
                  `Dikkat! Birden çok ekran algılandı, ikincil ekranı ${reverseCounter} saniye içinde kapatın!`}
                {screenRecordedFlag &&
                  `Dikkat! Ekran kaydı durduruldu, ${reverseCounter} saniye içinde tekrar başlatın!`}
                {focusFlag &&
                  `Dikkat! Sınav odağı bozuldu, ${reverseCounter} saniye içinde odaklanın!`}
              </ModalBody>
              <ModalFooter p={6}>
                {isButtonVisible && (
                  <Button
                    onClick={() => modalButton()}
                    variant={"outline"}
                    colorScheme="red"
                  >
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
              <Text fontWeight={500}>
                {isFinished
                  ? "Sınavınız kural ihlalinden dolayı iptal edilmiştir!"
                  : ruleBreakCount === 0 &&
                    focusBreach === 0 &&
                    extendedBreach === 0
                  ? "Herhangi bir ihlal yok, sınava devam edebilirsiniz"
                  : !focusFlag && !screenExtendedFlag
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
