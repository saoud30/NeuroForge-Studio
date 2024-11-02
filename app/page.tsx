import { Studios } from '@/components/studios';
import { Brain, Sparkles, Zap } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen">
      <section className="hero-gradient py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-8">
            <div className="inline-block animate-in">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-500">
                <Brain className="h-12 w-12 text-white" />
              </div>
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight animate-in" style={{ animationDelay: '150ms' }}>
              <span className="text-gradient">NeuroForge Studio</span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto animate-in" style={{ animationDelay: '300ms' }}>
              Your comprehensive AI-powered platform for content generation, analysis, and processing
            </p>

            <div className="flex flex-wrap justify-center gap-4 animate-in" style={{ animationDelay: '450ms' }}>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Sparkles className="h-4 w-4" />
                <span>Advanced AI Models</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Zap className="h-4 w-4" />
                <span>Real-time Processing</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-secondary/20">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold tracking-tight">
              Explore Our Studios
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover our suite of specialized AI-powered studios designed for every creative and analytical need
            </p>
          </div>
          
          <Studios />
        </div>
      </section>
    </div>
  );
}