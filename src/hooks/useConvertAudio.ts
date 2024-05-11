import { Audio } from "expo-av";
import { blobToBase64 } from "../utils/blobToBase64";
import base64 from "react-native-base64";
async function startRecording(
  setRecording: React.Dispatch<
    React.SetStateAction<Audio.Recording | undefined>
  >
) {
  try {
    const perm = await Audio.requestPermissionsAsync();
    if (perm.status === "granted") {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
    }
  } catch (err) {
    console.log("error recording", err);
  }
}

async function stopRecording(
  recording: Audio.Recording,
  setRecording: React.Dispatch<
    React.SetStateAction<Audio.Recording | undefined>
  >
) {
  setRecording(undefined);

  await recording.stopAndUnloadAsync();
  const { sound, status } = await recording.createNewLoadedSoundAsync();

  sound.playAsync();

  const audioURI = recording.getURI();
  const blob = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      resolve(xhr.response);
    };
    xhr.onerror = function (e) {
      reject(new TypeError("Network request failed"));
    };
    xhr.responseType = "blob";
    xhr.open("GET", audioURI as string, true);
    xhr.send(null);
  });

  console.log("uri", audioURI);

  const audioBase64 = await blobToBase64(blob as Blob);
  return base64.encode(audioBase64 as string);
}

export const useConvertAudio = {
  startRecording,
  stopRecording,
};
