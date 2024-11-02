"use client";

import { useState } from "react";
import { Code2, Sparkles, Sliders, Activity } from "lucide-react";
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

const models = [
  {
    id: "gemini",
    name: "Gemini Flash",
    provider: "google",
    model: "gemini-1.5-flash-latest",
    description: "Quick responses for code-related queries",
  },
  {
    id: "starchat",
    name: "StarChat 2",
    provider: "huggingface",
    model: "HuggingFaceH4/starchat2-15b-v0.1",
    description: "Specialized in technical and coding discussions",
  },
  {
    id: "starcoder",
    name: "StarCoder",
    provider: "huggingface",
    model: "bigcode/starcoder",
    description: "Code generation and completion",
  },
  {
    id: "groq",
    name: "Groq LLaMA",
    provider: "groq",
    model: "llama3-groq-70b-8192-tool-use-preview",
    description: "Fast inference with high accuracy",
  },
];

export default function CodeStudio() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [selectedModel, setSelectedModel] = useState("gemini");
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const generateResponse = async () => {
    setIsGenerating(true);
    setProgress(0);
    const progressInterval = setInterval(() => {
      setProgress((prev) => Math.min(prev + 5, 90));
    }, 300);

    try {
      const model = models.find((m) => m.id === selectedModel);
      if (!model) throw new Error("Model not found");

      let response;
      switch (model.provider) {
        case "huggingface": {
          const endpoint = model.id === "starchat" 
            ? "https://api-inference.huggingface.co/models/HuggingFaceH4/starchat2-15b-v0.1/v1/chat/completions"
            : "https://api-inference.huggingface.co/models/bigcode/starcoder";

          const payload = model.id === "starchat" 
            ? {
                model: model.model,
                messages: [{ role: "user", content: prompt }],
                max_tokens: 500,
              }
            : {
                inputs: prompt,
              };

          response = await fetch(endpoint, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_HUGGING_FACE_KEY}`,
            },
            body: JSON.stringify(payload),
          });
          break;
        }
        case "groq": {
          response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_GROQ_API_KEY}`,
            },
            body: JSON.stringify({
              messages: [{ role: "user", content: prompt }],
              model: model.model,
              temperature: 0.5,
              max_tokens: 1024,
              top_p: 0.65,
            }),
          });
          break;
        }
        case "google": {
          response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.NEXT_PUBLIC_GEMINI_FLASH_KEY}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
              }),
            }
          );
          break;
        }
        default:
          throw new Error("Invalid provider");
      }

      const data = await response.json();
      
      let generatedText = "";
      if (model.provider === "huggingface") {
        if (model.id === "starchat") {
          generatedText = data.choices?.[0]?.message?.content || data.generated_text;
        } else {
          generatedText = data[0]?.generated_text || data.generated_text;
        }
      } else if (model.provider === "groq") {
        generatedText = data.choices?.[0]?.message?.content;
      } else if (model.provider === "google") {
        generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      }

      setResponse(generatedText || "No response generated");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate response. Please try again.",
        variant: "destructive",
      });
    } finally {
      clearInterval(progressInterval);
      setProgress(100);
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold">Code Studio</h1>
          <p className="text-muted-foreground">
            Advanced code generation and assistance powered by multiple AI models
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-[2fr,1fr]">
        <div className="space-y-6">
          <Card className="border-2">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <Textarea
                  placeholder="Describe the code you want to generate or get help with..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={6}
                  className="resize-none text-lg font-mono"
                />
                <Button
                  onClick={generateResponse}
                  disabled={!prompt || isGenerating}
                  className="w-full"
                  size="lg"
                >
                  <Code2 className="w-5 h-5 mr-2" />
                  {isGenerating ? "Generating..." : "Generate Code"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {isGenerating && (
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Generating code...</span>
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
                  <pre className="whitespace-pre-wrap text-sm font-mono bg-secondary p-4 rounded-lg">
                    {response}
                  </pre>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">Model Selection</h3>
              <div className="space-y-4">
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
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">Quick Prompts</h3>
              <div className="space-y-2">
                {[
                  "Create a TypeScript interface for a REST API response with proper error handling",
                  "Optimize this code for better memory usage and execution speed: [paste code]",
                  "Generate documentation in JSDoc format for this codebase: [paste code]",
                  "Write a Python function to process and analyze JSON data from an API response",
                ].map((quickPrompt) => (
                  <Button
                    key={quickPrompt}
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => setPrompt(quickPrompt)}
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    {quickPrompt}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}