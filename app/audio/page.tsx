"use client";

import { useState } from "react";
import { Mic, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

export default function AudioStudio() {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [transcript, setTranscript] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAudioFile(file);
    }
  };

  const processAudio = async () => {
    if (!audioFile) return;

    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append("file", audioFile);

      const res = await fetch(
        "https://api-inference.huggingface.co/models/openai/whisper-large-v3",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_HUGGING_FACE_KEY}`,
          },
          body: formData,
        }
      );

      const data = await res.json();
      setTranscript(data.text);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process audio. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold">Audio Studio</h1>
        <p className="text-muted-foreground">
          Advanced audio processing and analysis tools
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex flex-col items-center gap-4 p-6 border-2 border-dashed rounded-lg">
              <input
                type="file"
                accept="audio/*"
                className="hidden"
                id="audio-upload"
                onChange={handleFileUpload}
              />
              <label
                htmlFor="audio-upload"
                className="flex flex-col items-center gap-2 cursor-pointer"
              >
                <Upload className="w-8 h-8" />
                <span>Upload Audio File</span>
              </label>
              {audioFile && <p className="text-sm">{audioFile.name}</p>}
            </div>

            <Button
              onClick={processAudio}
              disabled={!audioFile || isProcessing}
              className="w-full"
            >
              <Mic className="w-4 h-4 mr-2" />
              {isProcessing ? "Processing..." : "Process Audio"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {transcript && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-2">Transcript</h3>
            <div className="prose dark:prose-invert max-w-none">
              <div className="whitespace-pre-wrap">{transcript}</div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}