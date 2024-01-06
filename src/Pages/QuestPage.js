import React, { useState, useEffect, useRef } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  useDisclosure,
  Flex,
  Box,
  Text,
  Stack,
} from "@chakra-ui/react";
import "../App.css";

function QuestPage() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const modalProps = {
    closeOnOverlayClick: false,
    closeOnEsc: false,
  };

  const [currentScreenSize, setCurrentScreenSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const defScreen = useRef({
    width: window.screen.width,
    height: window.screen.height,
  });

  const hasRuleBreak = useRef({
    value: false,
  });

  const [hasFocus, setHasFocus] = useState(true);
  const [isTabChange, setIsTabChange] = useState(false);

  const [isFullScreen, setIsFullScreen] = useState(false);

  const [reverseCounter, setReverseCounter] = useState(10);

  const [ruleBreakCount, setRuleBreakCount] = useState(0);

  const handleResize = () => {
    if (!isFullScreen) {
      setCurrentScreenSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
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

    const handleF11Press = (event) => {
      if (event.key === "F11") {
        event.preventDefault();
        if (!document.fullscreenElement) {
          element.requestFullscreen().catch((err) => {
            console.error("Tam ekran hatası:", err);
          });
        }
      }
    };

    if (element.requestFullscreen) {
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
    openFullScreen();
  }, []);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    document.addEventListener("visibilitychange", handleTabChange);

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
        defScreen.current.width !== currentScreenSize.width ||
        defScreen.current.height !== currentScreenSize.height ||
        !document.fullscreenElement ||
        isTabChange ||
        !hasFocus
      ) {
        console.log("Bir şey değişti. Modal açılıyor...");
        onOpen();
        if (intval.current) return;
        intval.current = setInterval(() => {
          setReverseCounter((prev) => prev - 1);
        }, 1000);
        hasRuleBreak.current.value = true;
        setRuleBreakCount((prevCount) => prevCount + 1);
      } else {
        console.log("Değişen bir şey yok. Modal kapatılıyor...");
        onClose();
        setReverseCounter(10);
        clearInterval(intval.current);
        intval.current = null;
        hasRuleBreak.current.value = false;
      }
    }
  }, [isFullScreen, currentScreenSize, defScreen, isTabChange, hasFocus]);

  useEffect(() => {
    if (reverseCounter === 0) {
      console.error("Bitti");

      clearInterval(intval.current);
      intval.current = null;
    }
  }, [reverseCounter]);

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
          <Modal
            isOpen={isOpen}
            onClose={onClose}
            {...modalProps}
            closeOnOverlayClick={false}
          >
            <ModalOverlay />
            <ModalContent top={"35%"}>
              <ModalBody fontSize={"lg"} textAlign={"center"}>
                Dikkat Sınav odağı bozuldu {reverseCounter} içinde odaklanın!
              </ModalBody>
            </ModalContent>
          </Modal>
        </Flex>
        {!hasRuleBreak.current.value ? (
          <Flex
            justifyContent={"start"}
            width={"100%"}
            px={"1em"}
            position={"absolute"}
            top={"5em"}
            left={0}
          >
            <Stack>
              <Text fontSize="3xl">
                Herhangi bir sorun yok devam edebilirsiniz
              </Text>
              <Text fontSize={"2xl"}>
                {ruleBreakCount} adet kural ihlali yapıldı!
              </Text>
            </Stack>
          </Flex>
        ) : (
          ""
        )}
      </Box>
    </>
  );
}

export default QuestPage;
