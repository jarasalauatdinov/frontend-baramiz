import type { SuyleAILanguage } from "@/features/suyle-ai/shared-conversation/model/types";

export type SpeechRecognitionErrorCode =
  | "not_supported"
  | "permission_denied"
  | "no_match"
  | "capture_failed";

interface SpeechRecognitionAlternative {
  transcript: string;
}

interface SpeechRecognitionResult {
  0: SpeechRecognitionAlternative;
  isFinal: boolean;
  length: number;
}

interface SpeechRecognitionResultList {
  length: number;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface RecognitionInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  onend: (() => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onstart: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

interface RecognitionConstructor {
  new (): RecognitionInstance;
}

declare global {
  interface Window {
    SpeechRecognition?: RecognitionConstructor;
    webkitSpeechRecognition?: RecognitionConstructor;
  }
}

export interface SpeechRecognitionController {
  abort: () => void;
  stop: () => void;
}

interface StartSpeechRecognitionParams {
  language: SuyleAILanguage;
  onEnd?: () => void;
  onError: (errorCode: SpeechRecognitionErrorCode) => void;
  onResult: (transcript: string) => void;
  onStart?: () => void;
}

const RECOGNITION_LOCALES: Record<SuyleAILanguage, string> = {
  en: "en-US",
  kaa_cyrl: "uz-UZ",
  kaa_latn: "uz-UZ",
  ru: "ru-RU",
  tr: "tr-TR",
  uz: "uz-UZ",
};

function getRecognitionConstructor() {
  if (typeof window === "undefined") {
    return undefined;
  }

  return window.SpeechRecognition ?? window.webkitSpeechRecognition;
}

export function isSpeechRecognitionSupported() {
  return Boolean(getRecognitionConstructor());
}

export function startSpeechRecognition({
  language,
  onEnd,
  onError,
  onResult,
  onStart,
}: StartSpeechRecognitionParams): SpeechRecognitionController | null {
  const RecognitionConstructor = getRecognitionConstructor();

  if (!RecognitionConstructor) {
    onError("not_supported");
    return null;
  }

  const recognition = new RecognitionConstructor();

  recognition.lang = RECOGNITION_LOCALES[language];
  recognition.continuous = false;
  recognition.interimResults = true;
  recognition.maxAlternatives = 1;

  recognition.onstart = () => {
    onStart?.();
  };

  recognition.onresult = (event) => {
    const transcript = Array.from({ length: event.results.length })
      .map((_, index) => event.results[index]?.[0]?.transcript ?? "")
      .join(" ")
      .trim();

    onResult(transcript);
  };

  recognition.onerror = (event) => {
    if (event.error === "not-allowed" || event.error === "service-not-allowed") {
      onError("permission_denied");
      return;
    }

    if (event.error === "no-speech") {
      onError("no_match");
      return;
    }

    onError("capture_failed");
  };

  recognition.onend = () => {
    onEnd?.();
  };

  recognition.start();

  return {
    abort: () => recognition.abort(),
    stop: () => recognition.stop(),
  };
}
