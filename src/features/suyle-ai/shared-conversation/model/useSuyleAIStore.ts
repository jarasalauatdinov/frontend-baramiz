import { useCallback, useEffect, useMemo, useRef, useState, type MutableRefObject } from "react";
import { speechToText, textToSpeech, translateLocalToTourist, translateTouristToLocal } from "@/features/suyle-ai/api/suyleAI.api";
import {
  isAudioRecordingSupported,
  startAudioRecording,
  type AudioRecorderController,
  type AudioRecordingErrorCode,
} from "@/shared/lib/speech/recorder";
import {
  isSpeechRecognitionSupported,
  startSpeechRecognition,
  type SpeechRecognitionController,
  type SpeechRecognitionErrorCode,
} from "@/shared/lib/speech/recognition";
import { speakText } from "@/shared/lib/speech/synthesis";
import type { AudioTarget, LocalLanguage, SuyleAIErrorState, TouristLanguage, VoiceSupportState } from "./types";

const TOURIST_EMPTY_ERROR = "Enter what the tourist wants to say.";
const LOCAL_EMPTY_ERROR = "Enter what the local person said.";
const AUDIO_UNAVAILABLE_ERROR = "Audio voice is unavailable for this language.";
const RECORDING_UNAVAILABLE_ERROR = "Speech recognition is not supported in this browser.";
const RECORDING_PERMISSION_ERROR = "Microphone access is blocked on this device.";
const RECORDING_CAPTURE_ERROR = "Voice input could not be captured. Try again.";

function mapRecordingError(errorCode: AudioRecordingErrorCode) {
  if (errorCode === "not_supported") {
    return RECORDING_UNAVAILABLE_ERROR;
  }

  if (errorCode === "permission_denied") {
    return RECORDING_PERMISSION_ERROR;
  }

  return RECORDING_CAPTURE_ERROR;
}

function mapRecognitionError(errorCode: SpeechRecognitionErrorCode) {
  if (errorCode === "not_supported") {
    return RECORDING_UNAVAILABLE_ERROR;
  }

  if (errorCode === "permission_denied") {
    return RECORDING_PERMISSION_ERROR;
  }

  return RECORDING_CAPTURE_ERROR;
}

function stopAudioPlayback(audioRef: MutableRefObject<HTMLAudioElement | null>) {
  audioRef.current?.pause();
  audioRef.current = null;
}

export function useSuyleAIStore() {
  const [touristLanguage, setTouristLanguageState] = useState<TouristLanguage>("en");
  const [targetLocalScript, setTargetLocalScriptState] = useState<LocalLanguage>("kaa_latn");
  const [touristInput, setTouristInput] = useState("");
  const [touristTranslatedText, setTouristTranslatedText] = useState("");
  const [localInput, setLocalInput] = useState("");
  const [localTranslatedText, setLocalTranslatedText] = useState("");
  const [localSourceScript, setLocalSourceScriptState] = useState<LocalLanguage>("kaa_latn");
  const [localReplyTargetLanguage, setLocalReplyTargetLanguageState] = useState<TouristLanguage>("en");
  const [isTouristListening, setIsTouristListening] = useState(false);
  const [isLocalListening, setIsLocalListening] = useState(false);
  const [isTouristLoading, setIsTouristLoading] = useState(false);
  const [isLocalLoading, setIsLocalLoading] = useState(false);
  const [isTouristAudioLoading, setIsTouristAudioLoading] = useState(false);
  const [isLocalAudioLoading, setIsLocalAudioLoading] = useState(false);
  const [touristAudioUrl, setTouristAudioUrl] = useState<string | null>(null);
  const [localAudioUrl, setLocalAudioUrl] = useState<string | null>(null);
  const [errors, setErrors] = useState<SuyleAIErrorState>({});

  const touristRecorderRef = useRef<AudioRecorderController | null>(null);
  const localRecorderRef = useRef<AudioRecorderController | null>(null);
  const touristRecognitionRef = useRef<SpeechRecognitionController | null>(null);
  const localRecognitionRef = useRef<SpeechRecognitionController | null>(null);
  const touristAudioRef = useRef<string | null>(null);
  const localAudioRef = useRef<string | null>(null);
  const playbackRef = useRef<HTMLAudioElement | null>(null);
  const speechRecognitionSupported = useMemo(() => isSpeechRecognitionSupported(), []);
  const audioRecordingSupported = useMemo(() => isAudioRecordingSupported(), []);

  const voiceSupport = useMemo<VoiceSupportState>(() => ({
    speechRecognitionSupported,
    recordingSupported: speechRecognitionSupported || audioRecordingSupported,
  }), [audioRecordingSupported, speechRecognitionSupported]);

  const clearError = useCallback((target: AudioTarget) => {
    setErrors((current) => ({
      ...current,
      [target]: undefined,
    }));
  }, []);

  const setError = useCallback((target: AudioTarget, message: string) => {
    setErrors((current) => ({
      ...current,
      [target]: message,
    }));
  }, []);

  const clearCachedAudio = useCallback((target: AudioTarget) => {
    if (target === "tourist") {
      if (touristAudioRef.current) {
        URL.revokeObjectURL(touristAudioRef.current);
      }

      touristAudioRef.current = null;
      setTouristAudioUrl(null);
      return;
    }

    if (localAudioRef.current) {
      URL.revokeObjectURL(localAudioRef.current);
    }

    localAudioRef.current = null;
    setLocalAudioUrl(null);
  }, []);

  const stopAllListening = useCallback(() => {
    touristRecognitionRef.current?.abort();
    localRecognitionRef.current?.abort();
    touristRecorderRef.current?.cancel();
    localRecorderRef.current?.cancel();
    touristRecognitionRef.current = null;
    localRecognitionRef.current = null;
    touristRecorderRef.current = null;
    localRecorderRef.current = null;
    setIsTouristListening(false);
    setIsLocalListening(false);
  }, []);

  useEffect(() => {
    return () => {
      stopAllListening();
      stopAudioPlayback(playbackRef);
      clearCachedAudio("tourist");
      clearCachedAudio("local");
    };
  }, [clearCachedAudio, stopAllListening]);

  const setTouristLanguage = useCallback((value: TouristLanguage) => {
    setTouristLanguageState(value);
    setTouristTranslatedText("");
    clearCachedAudio("tourist");
    clearError("tourist");
    stopAllListening();
  }, [clearCachedAudio, clearError, stopAllListening]);

  const setTargetLocalScript = useCallback((value: LocalLanguage) => {
    setTargetLocalScriptState(value);
    setTouristTranslatedText("");
    clearCachedAudio("tourist");
    clearError("tourist");
  }, [clearCachedAudio, clearError]);

  const setLocalSourceScript = useCallback((value: LocalLanguage) => {
    setLocalSourceScriptState(value);
    setLocalTranslatedText("");
    clearCachedAudio("local");
    clearError("local");
    stopAllListening();
  }, [clearCachedAudio, clearError, stopAllListening]);

  const setLocalReplyTargetLanguage = useCallback((value: TouristLanguage) => {
    setLocalReplyTargetLanguageState(value);
    setLocalTranslatedText("");
    clearCachedAudio("local");
    clearError("local");
  }, [clearCachedAudio, clearError]);

  const translateTouristMessage = useCallback(async (value?: string) => {
    const nextValue = (value ?? touristInput).trim();
    if (!nextValue) {
      setError("tourist", TOURIST_EMPTY_ERROR);
      setTouristTranslatedText("");
      clearCachedAudio("tourist");
      return;
    }

    setIsTouristLoading(true);
    clearError("tourist");
    clearCachedAudio("tourist");

    try {
      const response = await translateTouristToLocal({
        sourceLanguage: touristLanguage,
        targetLocalScript,
        text: nextValue,
      });

      setTouristTranslatedText(response.translatedText);
    } catch (error) {
      setError("tourist", error instanceof Error ? error.message : "Tourist translation failed.");
      setTouristTranslatedText("");
    } finally {
      setIsTouristLoading(false);
    }
  }, [clearCachedAudio, clearError, setError, targetLocalScript, touristInput, touristLanguage]);

  const translateLocalMessage = useCallback(async (value?: string) => {
    const nextValue = (value ?? localInput).trim();
    if (!nextValue) {
      setError("local", LOCAL_EMPTY_ERROR);
      setLocalTranslatedText("");
      clearCachedAudio("local");
      return;
    }

    setIsLocalLoading(true);
    clearError("local");
    clearCachedAudio("local");

    try {
      const response = await translateLocalToTourist({
        sourceLocalScript: localSourceScript,
        targetLanguage: localReplyTargetLanguage,
        text: nextValue,
      });

      setLocalTranslatedText(response.translatedText);
    } catch (error) {
      setError("local", error instanceof Error ? error.message : "Local reply translation failed.");
      setLocalTranslatedText("");
    } finally {
      setIsLocalLoading(false);
    }
  }, [
    clearCachedAudio,
    clearError,
    localInput,
    localReplyTargetLanguage,
    localSourceScript,
    setError,
  ]);

  const beginRecording = useCallback(async (target: AudioTarget) => {
    const isTouristTarget = target === "tourist";

    if (!voiceSupport.recordingSupported) {
      setError(target, RECORDING_UNAVAILABLE_ERROR);
      return;
    }

    if (isTouristTarget && isTouristListening) {
      touristRecognitionRef.current?.stop();
      touristRecorderRef.current?.stop();
      return;
    }

    if (!isTouristTarget && isLocalListening) {
      localRecognitionRef.current?.stop();
      localRecorderRef.current?.stop();
      return;
    }

    stopAllListening();
    clearError(target);

    if (speechRecognitionSupported) {
      let recognizedTranscript = "";

      const recognitionController = startSpeechRecognition({
        language: isTouristTarget ? touristLanguage : localSourceScript,
        onEnd: () => {
          if (isTouristTarget) {
            touristRecognitionRef.current = null;
            setIsTouristListening(false);
          } else {
            localRecognitionRef.current = null;
            setIsLocalListening(false);
          }

          const nextTranscript = recognizedTranscript.trim();
          if (!nextTranscript) {
            return;
          }

          if (isTouristTarget) {
            void translateTouristMessage(nextTranscript);
            return;
          }

          void translateLocalMessage(nextTranscript);
        },
        onError: (errorCode) => {
          if (isTouristTarget) {
            touristRecognitionRef.current = null;
            setIsTouristListening(false);
          } else {
            localRecognitionRef.current = null;
            setIsLocalListening(false);
          }

          setError(target, mapRecognitionError(errorCode));
        },
        onResult: (transcript) => {
          recognizedTranscript = transcript;

          if (isTouristTarget) {
            setTouristInput(transcript);
            return;
          }

          setLocalInput(transcript);
        },
        onStart: () => {
          if (isTouristTarget) {
            setIsTouristListening(true);
          } else {
            setIsLocalListening(true);
          }
        },
      });

      if (!recognitionController) {
        setError(target, RECORDING_UNAVAILABLE_ERROR);
        return;
      }

      if (isTouristTarget) {
        touristRecognitionRef.current = recognitionController;
      } else {
        localRecognitionRef.current = recognitionController;
      }

      return;
    }

    const controller = await startAudioRecording({
      onComplete: async ({ blob }) => {
        if (isTouristTarget) {
          touristRecorderRef.current = null;
          setIsTouristListening(false);
        } else {
          localRecorderRef.current = null;
          setIsLocalListening(false);
        }

        try {
          const languageHint = isTouristTarget ? touristLanguage : localSourceScript;
          const response = await speechToText({ audio: blob, languageHint });

          if (isTouristTarget) {
            setTouristInput(response.text);
            await translateTouristMessage(response.text);
          } else {
            setLocalInput(response.text);
            await translateLocalMessage(response.text);
          }
        } catch (error) {
          setError(target, error instanceof Error ? error.message : RECORDING_CAPTURE_ERROR);
        }
      },
      onError: (errorCode) => {
        if (isTouristTarget) {
          touristRecorderRef.current = null;
          setIsTouristListening(false);
        } else {
          localRecorderRef.current = null;
          setIsLocalListening(false);
        }

        setError(target, mapRecordingError(errorCode));
      },
      onStart: () => {
        if (isTouristTarget) {
          setIsTouristListening(true);
        } else {
          setIsLocalListening(true);
        }
      },
    });

    if (!controller) {
      return;
    }

    if (isTouristTarget) {
      touristRecorderRef.current = controller;
    } else {
      localRecorderRef.current = controller;
    }
  }, [
    clearError,
    isLocalListening,
    isTouristListening,
    localSourceScript,
    setError,
    speechRecognitionSupported,
    stopAllListening,
    touristLanguage,
    translateLocalMessage,
    translateTouristMessage,
    voiceSupport.recordingSupported,
  ]);

  const playAudioForTarget = useCallback(async (
    target: AudioTarget,
    text: string,
    language: TouristLanguage | LocalLanguage,
  ) => {
    const safeText = text.trim();
    if (!safeText) {
      setError(
        target,
        target === "tourist"
          ? "Translate a message for the local listener first."
          : "Translate the local reply first.",
      );
      return;
    }

    const isTouristTarget = target === "tourist";
    const currentUrl = isTouristTarget ? touristAudioRef.current : localAudioRef.current;
    const setLoading = isTouristTarget ? setIsTouristAudioLoading : setIsLocalAudioLoading;

    setLoading(true);
    clearError(target);

    try {
      let audioUrl = currentUrl;

      if (!audioUrl) {
        const audioBlob = await textToSpeech({ text: safeText, language });
        audioUrl = URL.createObjectURL(audioBlob);

        if (isTouristTarget) {
          clearCachedAudio("tourist");
          touristAudioRef.current = audioUrl;
          setTouristAudioUrl(audioUrl);
        } else {
          clearCachedAudio("local");
          localAudioRef.current = audioUrl;
          setLocalAudioUrl(audioUrl);
        }
      }

      stopAudioPlayback(playbackRef);
      const audio = new Audio(audioUrl);
      playbackRef.current = audio;
      await audio.play();
    } catch {
      try {
        const didSpeak = await speakText({ language, text: safeText });
        if (!didSpeak) {
          setError(target, AUDIO_UNAVAILABLE_ERROR);
        }
      } catch {
        setError(target, AUDIO_UNAVAILABLE_ERROR);
      }
    } finally {
      setLoading(false);
    }
  }, [clearCachedAudio, clearError, setError]);

  return {
    errors,
    isLocalAudioLoading,
    isLocalListening,
    isLocalLoading,
    isTouristAudioLoading,
    isTouristListening,
    isTouristLoading,
    localAudioUrl,
    localInput,
    localReplyTargetLanguage,
    localSourceScript,
    localTranslatedText,
    setLocalInput,
    setLocalReplyTargetLanguage,
    setLocalSourceScript,
    setTargetLocalScript,
    setTouristInput,
    setTouristLanguage,
    targetLocalScript,
    touristAudioUrl,
    touristInput,
    touristLanguage,
    touristTranslatedText,
    voiceSupport,
    playLocalAudio: () => playAudioForTarget("local", localTranslatedText, localReplyTargetLanguage),
    playTouristAudio: () => playAudioForTarget("tourist", touristTranslatedText, targetLocalScript),
    toggleLocalListening: () => beginRecording("local"),
    toggleTouristListening: () => beginRecording("tourist"),
    translateLocalMessage: (value?: string) => translateLocalMessage(value),
    translateTouristMessage: (value?: string) => translateTouristMessage(value),
  };
}

export type SuyleAIStore = ReturnType<typeof useSuyleAIStore>;
