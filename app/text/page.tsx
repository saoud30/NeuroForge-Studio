"use client";

import { useState } from "react";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";

const languages = [
  { value: "fr", label: "French" },
  { value: "es", label: "Spanish" },
  { value: "de", label: "German" },
  { value: "it", label: "Italian" },
  { value: "pt", label: "Portuguese" },
  { value: "ru", label: "Russian" },
  { value: "ja", label: "Japanese" },
  { value: "ko", label: "Korean" },
  { value: "zh", label: "Chinese" },
  { value: "hi", label: "Hindi" },
];

interface ApiPayload {
  inputs: string;
  options: {
    wait_for_model: boolean;
  };
  parameters?: {
    max_length: number;
    min_length: number;
    do_sample: boolean;
  };
}

export default function TextStudio() {
  const [text, setText] = useState("");
  const [result, setResult] = useState("");
  const [mode, setMode] = useState("translate");
  const [targetLang, setTargetLang] = useState("fr");
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const getModelEndpoint = () => {
    switch (mode) {
      case "translate":
        return `Helsinki-NLP/opus-mt-en-${targetLang}`;
      case "summarize":
        return "facebook/bart-large-cnn";
      case "analyze":
        return "distilbert-base-uncased-finetuned-sst-2-english";
      default:
        return "";
    }
  };

  const processText = async () => {
    setIsLoading(true);
    setProgress(0);
    const progressInterval = setInterval(() => {
      setProgress((prev) => Math.min(prev + 10, 90));
    }, 500);

    try {
      const endpoint = getModelEndpoint();
      const payload: ApiPayload = {
        inputs: text,
        options: { wait_for_model: true }
      };

      // Add specific parameters for summarization
      if (mode === "summarize") {
        payload.parameters = {
          max_length: 130,
          min_length: 30,
          do_sample: false
        };
      }

      const res = await fetch(
        `https://api-inference.huggingface.co/models/${endpoint}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_HUGGING_FACE_KEY}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();
      
      if (mode === "analyze") {
        const sentiment = data[0][0].label;
        const score = Math.round(data[0][0].score * 100);
        setResult(`Sentiment: ${sentiment}\nConfidence: ${score}%`);
      } else if (mode === "summarize") {
        setResult(data[0].summary_text || data[0].generated_text);
      } else {
        setResult(data[0].translation_text || data[0].generated_text);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process text. Please try again.",
        variant: "destructive",
      });
    } finally {
      clearInterval(progressInterval);
      setProgress(100);
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold">Text Studio</h1>
        <p className="text-muted-foreground">Advanced text processing and analysis</p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <Select value={mode} onValueChange={setMode}>
              <SelectTrigger>
                <SelectValue placeholder="Select processing mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="translate">Translation</SelectItem>
                <SelectItem value="summarize">Summarization</SelectItem>
                <SelectItem value="analyze">Analysis</SelectItem>
              </SelectContent>
            </Select>

            {mode === "translate" && (
              <Select value={targetLang} onValueChange={setTargetLang}>
                <SelectTrigger>
                  <SelectValue placeholder="Select target language" />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value}>
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            <Textarea
              placeholder="Enter text to process..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
            />
            <Button
              onClick={processText}
              disabled={!text || isLoading}
              className="w-full"
            >
              <FileText className="w-4 h-4 mr-2" />
              {isLoading ? "Processing..." : "Process"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {isLoading && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Processing text...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} />
            </div>
          </CardContent>
        </Card>
      )}

      {result && (
        <Card>
          <CardContent className="pt-6">
            <div className="prose dark:prose-invert max-w-none">
              <div className="whitespace-pre-wrap">{result}</div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}