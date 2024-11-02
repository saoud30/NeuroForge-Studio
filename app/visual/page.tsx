"use client";

import { useState } from "react";
import { Upload, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { ImageAnalysis } from "@/components/visual/image-analysis";
import { ImageGeneration } from "@/components/visual/image-generation";

export default function VisualStudio() {
  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-4xl font-bold">Visual Studio</h1>
          <p className="text-muted-foreground">
            Advanced image analysis and generation powered by state-of-the-art models
          </p>
        </div>

        <Tabs defaultValue="analysis" className="w-full">
          <TabsList>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
            <TabsTrigger value="generation">Generation</TabsTrigger>
          </TabsList>
          <TabsContent value="analysis">
            <ImageAnalysis />
          </TabsContent>
          <TabsContent value="generation">
            <ImageGeneration />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}