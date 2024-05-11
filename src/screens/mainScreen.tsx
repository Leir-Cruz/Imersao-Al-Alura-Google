import { Audio } from "expo-av";
import { useEffect, useMemo, useState } from "react";
import { View, StyleSheet, Text, ScrollView, TextInput, Button, ActivityIndicator } from "react-native"
import { useConvertAudio } from "../hooks/useConvertAudio";
import { gemini } from "../services/gemini.service";
import { geminiKey } from "../../env-config";

export const MainScreen = () => {

  const [recording, setRecording] = useState<Audio.Recording | undefined>(undefined);
  const [recording64, setRecording64] = useState<unknown>(null);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isLoadingFeedbacks, setIsLoadingFeedbacks] = useState<boolean>(false);
  const [feedbacks, setFeedbacks] = useState<string>('');
  const [instrument, setInstrument] = useState<string>('');
  const [music, setMusic] = useState<string>('');

  const model = useMemo(() => gemini.generateModel(geminiKey), [geminiKey])
  const { startRecording, stopRecording } = useConvertAudio


  const handleStopRecording = async () => {
    if (recording) {
      const audio64 = await stopRecording(recording, setRecording);
      setRecording64(audio64)
    }
    setIsRecording(false)
  }

  const handleGeminiFeedbacks = async () => {
    setIsLoadingFeedbacks(true);
    const geminiFeedbacks = await gemini.sendMessage({
      instrument: instrument,
      music: music,
      generatedModel: model,
      audioBase64: recording64,
    })
    setFeedbacks(geminiFeedbacks)
    setIsLoadingFeedbacks(false)
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Maestro digital</Text>
      </View>
      <View style={styles.audioSection}>
        <TextInput
          style={styles.input}
          value={instrument}
          onChangeText={setInstrument}
          placeholder="Instrumento"
        />
        <TextInput
          style={styles.input}
          value={music}
          onChangeText={setMusic}
          placeholder="Musica"
        />
        <Button title="Gravar" color={"#88c9bf"} disabled={isRecording} onPress={() => { setIsRecording(true); startRecording(setRecording) }} />
        <Button title="Interromper gravação" color={"#F15F5C"} disabled={!isRecording} onPress={() => handleStopRecording()}
        />
        {!!recording64 && (
          <ScrollView contentContainerStyle={{ justifyContent: "center", padding: 20, gap: 10 }}>
            <Button title="Colher feedbacks" color={"#88c9bf"} disabled={isRecording} onPress={() => handleGeminiFeedbacks()} />
            {!!isLoadingFeedbacks && <ActivityIndicator size="large" />}
            {!isLoadingFeedbacks && <Text>{feedbacks}</Text>}
          </ScrollView>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },

  header: {
    width: "100%",
    backgroundColor: "#88c9bf",
    padding: 16,
    paddingTop: 40,
    height: "12%",
    justifyContent: "center",
    alignItems: "center"
  },

  title: {
    fontSize: 18,
    color: "#fff",
  },

  audioSection: {
    flex: 1,
    width: "100%",
    padding: 20,
    gap: 12,
    backgroundColor: '#fff',
    alignItems: "center"
  },

  input: {
    height: 40,
    width: "100%",
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    borderColor: "#c9c9c9",
  }
});
