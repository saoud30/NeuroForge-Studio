"use client";

import { useState } from "react";
import { Wand2, Sparkles, Download } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";

const quickPrompts = [
  {
    title: "Professional Portrait",
    prompt: "A professional headshot of a confident young woman with natural makeup, wearing a crisp white blazer, standing against a blurred office background, shot with a Canon EOS R5, 85mm lens, studio lighting, shallow depth of field, 8k resolution, ultra detailed, photorealistic, high-end commercial photography",
  },
  {
    title: "Cyberpunk Character",
    prompt: "A hyperrealistic close-up portrait of a male cyberpunk character with glowing blue cybernetic implants, iridescent hair, wearing a high-tech translucent visor, neon city reflections, volumetric lighting, shot on Hasselblad H6D-100c, ultra detailed skin texture, photorealistic, 8k resolution, cinematic color grading",
  },
  {
    title: "Fantasy Warrior",
    prompt: "A stunning portrait of a female warrior in ornate golden armor, intricate braided hair with jewels, dramatic evening lighting, atmospheric forest background, shot on Phase One IQ4 150MP, dramatic rim lighting, ultra high detail, photorealistic rendering, 8k resolution, fantasy photography, volumetric fog",
  },
  {
    title: "Modern Explorer",
    prompt: "A dramatic portrait of an adventurous man in his 30s, rugged appearance, wearing a weathered leather jacket, morning sunlight streaming through desert canyons behind him, captured with Sony A1 camera, natural lighting, sweat and dirt details on skin, ultra realistic texture, 8k resolution, National Geographic style",
  }
];

export function ImageGeneration() {
  const [prompt, setPrompt] = useState("");
  const [generatedImage, setGeneratedImage] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const generateImage = async () => {
    setIsGenerating(true);
    setProgress(0);
    const progressInterval = setInterval(() => {
      setProgress((prev) => Math.min(prev + 10, 90));
    }, 500);

    try {
      const response = await fetch(
        "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_HUGGING_FACE_KEY}`,
          },
          body: JSON.stringify({
            inputs: prompt,
            options: { wait_for_model: true }
          }),
        }
      );

      if (!response.ok) throw new Error('Failed to generate image');

      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);
      setGeneratedImage(imageUrl);
      
      toast({
        title: "Success",
        description: "Image generated successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate image. Please try again.",
        variant: "destructive",
      });
    } finally {
      clearInterval(progressInterval);
      setProgress(100);
      setIsGenerating(false);
    }
  };

  const downloadImage = async () => {
    try {
      const response = await fetch(generatedImage);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `generated-image-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download image.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-[2fr,1fr]">
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <Textarea
                placeholder="Describe the image you want to generate..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={4}
                className="resize-none"
              />
              <Button
                onClick={generateImage}
                disabled={!prompt || isGenerating}
                className="w-full"
                size="lg"
              >
                <Wand2 className="w-4 h-4 mr-2" />
                {isGenerating ? "Generating..." : "Generate Image"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {isGenerating && (
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Generating image...</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} />
              </div>
            </CardContent>
          </Card>
        )}

        {generatedImage && (
          <Card>
            <CardContent className="pt-6">
              <div className="relative w-full aspect-square">
                <Image
                  src={generatedImage}
                  alt="Generated"
                  fill
                  className="rounded-lg shadow-lg object-contain"
                  unoptimized
                />
              </div>
              <div className="flex gap-4 mt-4">
                <Button
                  className="flex-1"
                  onClick={downloadImage}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Image
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    URL.revokeObjectURL(generatedImage);
                    setGeneratedImage("");
                  }}
                >
                  Generate Another
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-4">Tips for Better Results</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Be specific about subject and camera details</li>
              <li>• Include lighting and composition settings</li>
              <li>• Mention resolution and quality requirements</li>
              <li>• Add atmosphere and environmental details</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-4">Quick Prompts</h3>
            <div className="space-y-2">
              {quickPrompts.map((quickPrompt) => (
                <Button
                  key={quickPrompt.title}
                  variant="outline"
                  className="w-full justify-start text-left"
                  onClick={() => setPrompt(quickPrompt.prompt)}
                >
                  <Sparkles className="w-4 h-4 mr-2 flex-shrink-0" />
                  <div>
                    <div className="font-medium">{quickPrompt.title}</div>
                    <div className="text-xs text-muted-foreground truncate">
                      {quickPrompt.prompt.slice(0, 60)}...
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}