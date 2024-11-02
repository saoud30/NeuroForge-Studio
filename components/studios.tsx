"use client";

import Link from "next/link";
import { 
  Zap, 
  Brain, 
  FileText, 
  Mic, 
  Image as ImageIcon,
  BarChart3,
  Code2
} from "lucide-react";

const studios = [
  {
    title: "Flash Studio",
    description: "Quick responses powered by Gemini Flash 1.5",
    icon: Zap,
    href: "/flash",
    gradient: "from-yellow-500 to-orange-500",
  },
  {
    title: "Detailed Studio",
    description: "Complex content generation with Hugging Face",
    icon: Brain,
    href: "/detailed",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    title: "Code Studio",
    description: "Advanced code generation and assistance",
    icon: Code2,
    href: "/code",
    gradient: "from-indigo-500 to-blue-500",
  },
  {
    title: "Text Studio",
    description: "Advanced text processing and analysis",
    icon: FileText,
    href: "/text",
    gradient: "from-blue-500 to-indigo-500",
  },
  {
    title: "Audio Studio",
    description: "Audio processing and transcription",
    icon: Mic,
    href: "/audio",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    title: "Visual Studio",
    description: "Image analysis and generation",
    icon: ImageIcon,
    href: "/visual",
    gradient: "from-pink-500 to-rose-500",
  },
  {
    title: "Analytics",
    description: "Usage insights and performance metrics",
    icon: BarChart3,
    href: "/analytics",
    gradient: "from-orange-500 to-red-500",
  },
];

export function Studios() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {studios.map((studio, index) => (
        <Link
          key={studio.title}
          href={studio.href}
          className="studio-card group"
          style={{ animationDelay: `${index * 150}ms` }}
        >
          <div className="p-6 relative z-10">
            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-lg bg-gradient-to-br ${studio.gradient}`}>
                <studio.icon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-lg group-hover:text-gradient transition-all duration-300">
                  {studio.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {studio.description}
                </p>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}