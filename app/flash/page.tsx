"use client";

import { useState } from "react";
import { Zap, Sparkles, Clock, Cpu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";

export default function FlashStudio() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [responseTime, setResponseTime] = useState(0);
  const { toast } = useToast();

  const generateResponse = async () => {
    const startTime = Date.now();
    setIsLoading(true);
    try {
      const res = await fetch(
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

      const data = await res.json();
      setResponse(data.candidates[0].content.parts[0].text);
      setResponseTime((Date.now() - startTime) / 1000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const quickActions = [
    { label: "Summarize", icon: Sparkles },
    { label: "Translate", icon: Zap },
    { label: "Proofread", icon: Clock },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold">Flash Studio</h1>
          <p className="text-muted-foreground">
            Powered by Gemini Flash 1.5 for lightning-fast responses
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <div className="text-sm font-medium">Response Time</div>
            <div className="text-2xl font-bold text-primary">
              {responseTime.toFixed(2)}s
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium">API Load</div>
            <div className="text-2xl font-bold text-primary">0%</div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-[2fr,1fr]">
        <div className="space-y-6">
          <Card className="border-2">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <Textarea
                  placeholder="Enter your prompt for quick generation..."
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
                  <Zap className="w-5 h-5 mr-2" />
                  {isLoading ? "Generating..." : "Generate"}
                </Button>
              </div>
            </CardContent>
          </Card>

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
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-2">
                {quickActions.map((action) => (
                  <Button
                    key={action.label}
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => setPrompt(`${action.label}: ${prompt}`)}
                  >
                    <action.icon className="w-4 h-4 mr-2" />
                    {action.label}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">Performance Metrics</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Response Time</span>
                    <span className="text-sm font-medium">{responseTime.toFixed(2)}s</span>
                  </div>
                  <Progress value={Math.min(responseTime * 20, 100)} />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">API Load</span>
                    <span className="text-sm font-medium">0%</span>
                  </div>
                  <Progress value={0} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}