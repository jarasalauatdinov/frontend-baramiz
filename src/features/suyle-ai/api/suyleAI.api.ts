import { ApiRequestError, apiRequest, apiRequestBlob } from "@/shared/api/client";
import type {
  SpeechToTextResponse,
  SuyleAILanguage,
  TextToSpeechRequest,
  TranslateLocalToTouristRequest,
  TranslateResponse,
  TranslateTouristToLocalRequest,
} from "../shared-conversation/model/types";

function resolveAudioFileName(mimeType: string) {
  if (mimeType.includes("mp4")) {
    return "suyle-ai-recording.m4a";
  }

  if (mimeType.includes("ogg")) {
    return "suyle-ai-recording.ogg";
  }

  return "suyle-ai-recording.webm";
}

function toRequestErrorMessage(error: unknown, fallback: string) {
  if (error instanceof ApiRequestError) {
    return error.message;
  }

  return fallback;
}

export async function translateTouristToLocal(input: TranslateTouristToLocalRequest) {
  try {
    return await apiRequest<TranslateResponse>("/suyle-ai/translate/tourist-to-local", {
      method: "POST",
      body: JSON.stringify(input),
    });
  } catch (error) {
    throw new Error(toRequestErrorMessage(error, "Tourist translation failed."));
  }
}

export async function translateLocalToTourist(input: TranslateLocalToTouristRequest) {
  try {
    return await apiRequest<TranslateResponse>("/suyle-ai/translate/local-to-tourist", {
      method: "POST",
      body: JSON.stringify(input),
    });
  } catch (error) {
    throw new Error(toRequestErrorMessage(error, "Local reply translation failed."));
  }
}

export async function speechToText(input: { audio: Blob; languageHint: SuyleAILanguage }) {
  const formData = new FormData();
  formData.append("audio", input.audio, resolveAudioFileName(input.audio.type));
  formData.append("languageHint", input.languageHint);

  try {
    return await apiRequest<SpeechToTextResponse>("/suyle-ai/speech-to-text", {
      method: "POST",
      body: formData,
    });
  } catch (error) {
    throw new Error(toRequestErrorMessage(error, "Speech recognition failed."));
  }
}

export async function textToSpeech(input: TextToSpeechRequest) {
  try {
    return await apiRequestBlob("/suyle-ai/text-to-speech", {
      method: "POST",
      body: JSON.stringify(input),
    });
  } catch (error) {
    throw new Error(toRequestErrorMessage(error, "Audio generation failed."));
  }
}
