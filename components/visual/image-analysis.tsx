"use client";

import { useState, useCallback } from "react";
import { Upload, Sparkles, Scan } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useDropzone } from "react-dropzone";
import { Progress } from "@/components/ui/progress";

export function ImageAnalysis() {
  const [imageUrl, setImageUrl] = useState("");
  const [results, setResults] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif"],
    },
    multiple: false,
  });

  const analyzeImage = async (type: string) => {
    if (!imageUrl) return;

    setIsAnalyzing(true);
    setProgress(0);
    const progressInterval = setInterval(() => {
      setProgress((prev) => Math.min(prev + 10, 90));
    }, 500);

    try {
      const imageData = imageUrl.split(",")[1];
      const endpoint = type === "classification" 
        ? "google/vit-base-patch16-224"
        : "facebook/detr-resnet-50";
      
      const res = await fetch(
        `https://api-inference.huggingface.co/models/${endpoint}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_HUGGING_FACE_KEY}`,
          },
          body: JSON.stringify({
            inputs: imageData,
            options: { wait_for_model: true }
          }),
        }
      );

      const data = await res.json();
      
      if (type === "classification") {
        setResults(data.map((item: any) => ({
          label: item.label,
          confidence: Math.round(item.score * 100)
        })).slice(0, 5));
      } else {
        setResults(data.map((item: any) => ({
          label: item.label,
          confidence: Math.round(item.score * 100),
          box: item.box
        })));
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to analyze image. Please try again.",
        variant: "destructive",
      });
    } finally {
      clearInterval(progressInterval);
      setProgress(100);
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-[2fr,1fr]">
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div
              {...getRootProps()}
              className={`flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg transition-colors ${
                isDragActive ? "border-primary" : "border-border"
              }`}
            >
              <input {...getInputProps()} />
              {imageUrl ? (
                <div className="relative w-full h-full">
                  <div className="relative w-full h-full">
                    <Image
                      src={imageUrl}
                      alt="Uploaded"
                      fill
                      className="object-contain"
                      unoptimized
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      setImageUrl("");
                      setResults(null);
                    }}
                  >
                    Change Image
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <Upload className="w-8 h-8 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Drag and drop an image here, or click to select
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {isAnalyzing && (
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Analyzing image...</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} />
              </div>
            </CardContent>
          </Card>
        )}

        {results && (
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">Analysis Results</h3>
              <div className="space-y-2">
                {results.map((result: any, index: number) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-3 bg-secondary rounded-lg"
                  >
                    <span className="font-medium">{result.label}</span>
                    <span className="text-sm bg-primary/10 px-2 py-1 rounded">
                      {result.confidence}%
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-4">Analysis Options</h3>
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => analyzeImage("classification")}
                disabled={!imageUrl || isAnalyzing}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Classify Image
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => analyzeImage("detection")}
                disabled={!imageUrl || isAnalyzing}
              >
                <Scan className="w-4 h-4 mr-2" />
                Detect Objects
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-4">Tips</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Supported formats: PNG, JPG, JPEG</li>
              <li>• Maximum file size: 5MB</li>
              <li>• Higher resolution images work better</li>
              <li>• Ensure good lighting and focus</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}