"use client";

import { useState } from "react";
import { Brain, Sparkles, Sliders, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";

const models = [
  {
    id: "mistral",
    name: "Mistral Nemo",
    endpoint: "mistralai/Mistral-Nemo-Instruct-2407",
    description: "Balanced performance and quality",
  },
  {
    id: "llama",
    name: "Llama 3.1",
    endpoint: "meta-llama/Llama-3.1-8B-Instruct",
    description: "Advanced reasoning and comprehension",
  },
  {
    id: "gemma",
    name: "Gemma 2B",
    endpoint: "google/gemma-2-2b-it",
    description: "Fast and efficient for general tasks",
  },
  {
    id: "phi",
    name: "Phi-3 Mini",
    endpoint: "microsoft/Phi-3-mini-4k-instruct",
    description: "Compact but powerful instruction model",
  },
];

export default function DetailedStudio() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [selectedModel, setSelectedModel] = useState("mistral");
  const [temperature, setTemperature] = useState(0.7);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const generateResponse = async () => {
    setIsLoading(true);
    setProgress(0);
    const progressInterval = setInterval(() => {
      setProgress((prev) => Math.min(prev + 5, 90));
    }, 300);

    try {
      const model = models.find((m) => m.id === selectedModel);
      if (!model) throw new Error("Model not found");

      const response = await fetch(
        `https://api-inference.huggingface.co/models/${model.endpoint}/v1/chat/completions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_HUGGING_FACE_KEY}`,
          },
          body: JSON.stringify({
            model: model.endpoint,
            messages: [{ role: "user", content: prompt }],
            temperature: temperature,
            max_tokens: 500,
          }),
        }
      );

      const data = await response.json();
      setResponse(data.choices?.[0]?.message?.content || "No response generated");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate response. Please try again.",
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
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold">Detailed Studio</h1>
          <p className="text-muted-foreground">
            Powered by advanced language models for in-depth content generation
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-[2fr,1fr]">
        <div className="space-y-6">
          <Card className="border-2">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <Textarea
                  placeholder="Enter your prompt for detailed generation..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={6}
                  className="resize-none text-lg"
                />
                <Button
                  onClick={generateResponse}
                  disabled={!prompt || isLoading}
                  className="w-full"
                  size="lg"
                >
                  <Brain className="w-5 h-5 mr-2" />
                  {isLoading ? "Generating..." : "Generate"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {isLoading && (
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Generating response...</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} />
                </div>
              </CardContent>
            </Card>
          )}

          {response && (
            <Card>
              <CardContent className="pt-6">
                <div className="prose dark:prose-invert max-w-none">
                  <div className="whitespace-pre-wrap text-lg">{response}</div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">Model Settings</h3>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Model</label>
                  <Select value={selectedModel} onValueChange={setSelectedModel}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {models.map((model) => (
                        <SelectItem key={model.id} value={model.id}>
                          <div className="flex flex-col">
                            <span>{model.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {model.description}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-sm font-medium">Temperature</label>
                    <span className="text-sm text-muted-foreground">
                      {temperature}
                    </span>
                  </div>
                  <Slider
                    value={[temperature]}
                    onValueChange={([value]) => setTemperature(value)}
                    min={0}
                    max={1}
                    step={0.1}
                  />
                  <p className="text-xs text-muted-foreground">
                    Higher values make the output more creative but less focused
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">Quick Settings</h3>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setTemperature(0.3)}
                >
                  Focused
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setTemperature(0.7)}
                >
                  Balanced
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setTemperature(1)}
                >
                  Creative
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setTemperature(0.7);
                    setSelectedModel("mistral");
                  }}
                >
                  Reset All
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}