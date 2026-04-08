export type AudioRecordingErrorCode =
  | "not_supported"
  | "permission_denied"
  | "capture_failed";

export interface AudioRecordingResult {
  blob: Blob;
  mimeType: string;
}

export interface AudioRecorderController {
  cancel: () => void;
  stop: () => void;
}

interface StartAudioRecordingOptions {
  onComplete: (result: AudioRecordingResult) => void;
  onError: (errorCode: AudioRecordingErrorCode) => void;
  onStart?: () => void;
}

const MIME_TYPE_CANDIDATES = [
  "audio/webm;codecs=opus",
  "audio/webm",
  "audio/mp4",
  "audio/ogg;codecs=opus",
] as const;

function getSupportedMimeType() {
  if (typeof window === "undefined" || typeof MediaRecorder === "undefined") {
    return undefined;
  }

  return MIME_TYPE_CANDIDATES.find((candidate) => {
    return typeof MediaRecorder.isTypeSupported !== "function" || MediaRecorder.isTypeSupported(candidate);
  });
}

function stopTracks(stream: MediaStream) {
  stream.getTracks().forEach((track) => track.stop());
}

export function isAudioRecordingSupported() {
  return typeof window !== "undefined"
    && typeof navigator !== "undefined"
    && Boolean(navigator.mediaDevices?.getUserMedia)
    && typeof MediaRecorder !== "undefined";
}

export async function startAudioRecording({
  onComplete,
  onError,
  onStart,
}: StartAudioRecordingOptions): Promise<AudioRecorderController | null> {
  if (!isAudioRecordingSupported()) {
    onError("not_supported");
    return null;
  }

  let stream: MediaStream;

  try {
    stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  } catch (error) {
    if (error instanceof DOMException && (error.name === "NotAllowedError" || error.name === "SecurityError")) {
      onError("permission_denied");
      return null;
    }

    onError("capture_failed");
    return null;
  }

  const mimeType = getSupportedMimeType();
  const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
  const chunks: BlobPart[] = [];
  let shouldDiscardResult = false;

  recorder.onstart = () => {
    onStart?.();
  };

  recorder.ondataavailable = (event) => {
    if (event.data.size > 0) {
      chunks.push(event.data);
    }
  };

  recorder.onerror = () => {
    stopTracks(stream);
    onError("capture_failed");
  };

  recorder.onstop = () => {
    stopTracks(stream);

    if (shouldDiscardResult) {
      return;
    }

    if (chunks.length === 0) {
      onError("capture_failed");
      return;
    }

    onComplete({
      blob: new Blob(chunks, { type: recorder.mimeType || mimeType || "audio/webm" }),
      mimeType: recorder.mimeType || mimeType || "audio/webm",
    });
  };

  recorder.start();

  return {
    cancel: () => {
      shouldDiscardResult = true;

      if (recorder.state !== "inactive") {
        recorder.stop();
        return;
      }

      stopTracks(stream);
    },
    stop: () => {
      if (recorder.state !== "inactive") {
        recorder.stop();
      }
    },
  };
}
