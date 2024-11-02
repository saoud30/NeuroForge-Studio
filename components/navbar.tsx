"use client";

import Link from "next/link";
import { Brain } from "lucide-react";
import { ModeToggle } from "./mode-toggle";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b glass-effect backdrop-blur-lg">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-500 transition-all duration-300 group-hover:shadow-lg group-hover:scale-105">
            <Brain className="h-6 w-6 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight group-hover:text-gradient transition-all duration-300">
            NeuroForge Studio
          </span>
        </Link>
        <ModeToggle />
      </div>
    </nav>
  );
}