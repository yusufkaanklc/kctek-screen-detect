const handleScreenRecord = async (setIsScreenRecorded) => {
  let captureStream = null;
  let mediaRecorder = null;

  try {
    captureStream = await navigator.mediaDevices.getDisplayMedia({
      video: {
        mediaSource: "screen",
        preferCurrentTab: true,
      },
    });

    mediaRecorder = new MediaRecorder(captureStream);

    mediaRecorder.onstop = () => {
      setIsScreenRecorded(false);
    };

    mediaRecorder.start();
    setIsScreenRecorded(true);
  } catch (error) {
    setIsScreenRecorded(false);
    console.error("Ekran kaydı alınırken bir hata oluştu:", error);
  }

  return captureStream;
};

export default handleScreenRecord;
