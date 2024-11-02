"use client";

import { useEffect, useState } from "react";
import { BarChart3, Clock, CheckCircle2, AlertCircle, Zap, Brain, FileText, Mic, Image as ImageIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

// Analytics data structure
interface StudioMetrics {
  name: string;
  requests: number;
  avgResponseTime: number;
  successRate: number;
  icon: any;
}

export default function Analytics() {
  const [totalRequests, setTotalRequests] = useState(0);
  const [avgResponseTime, setAvgResponseTime] = useState(0);
  const [successRate, setSuccessRate] = useState(100);
  const [studioMetrics, setStudioMetrics] = useState<StudioMetrics[]>([
    { name: "Flash Studio", requests: 0, avgResponseTime: 0, successRate: 100, icon: Zap },
    { name: "Detailed Studio", requests: 0, avgResponseTime: 0, successRate: 100, icon: Brain },
    { name: "Text Studio", requests: 0, avgResponseTime: 0, successRate: 100, icon: FileText },
    { name: "Audio Studio", requests: 0, avgResponseTime: 0, successRate: 100, icon: Mic },
    { name: "Visual Studio", requests: 0, avgResponseTime: 0, successRate: 100, icon: ImageIcon },
  ]);

  useEffect(() => {
    // Retrieve analytics data from localStorage
    const getAnalyticsData = () => {
      const storedData = localStorage.getItem('neuroforge_analytics');
      if (storedData) {
        const data = JSON.parse(storedData);
        setTotalRequests(data.totalRequests || 0);
        setAvgResponseTime(data.avgResponseTime || 0);
        setSuccessRate(data.successRate || 100);
        if (data.studioMetrics) {
          setStudioMetrics(prev => 
            prev.map(studio => ({
              ...studio,
              ...data.studioMetrics.find((s: any) => s.name === studio.name)
            }))
          );
        }
      }
    };

    getAnalyticsData();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">
          Real-time usage insights and performance metrics
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRequests.toLocaleString()}</div>
            <div className="flex items-center space-x-2">
              <Progress value={Math.min((totalRequests / 1000) * 100, 100)} className="flex-1" />
              <span className="text-xs text-muted-foreground">
                {Math.min(Math.round((totalRequests / 1000) * 100), 100)}%
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Across all studios
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgResponseTime.toFixed(2)}ms</div>
            <div className="flex items-center space-x-2">
              <Progress 
                value={Math.max(100 - (avgResponseTime / 10), 0)} 
                className="flex-1"
              />
              <span className="text-xs text-muted-foreground">
                {Math.max(100 - Math.round(avgResponseTime / 10), 0)}%
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Last 24 hours
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            {successRate >= 95 ? (
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            ) : (
              <AlertCircle className="h-4 w-4 text-yellow-500" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{successRate}%</div>
            <div className="flex items-center space-x-2">
              <Progress value={successRate} className="flex-1" />
              <span className="text-xs text-muted-foreground">{successRate}%</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Last 100 requests
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-semibold tracking-tight">Studio Performance</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {studioMetrics.map((studio) => (
            <Card key={studio.name} className="hover:shadow-lg transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium flex items-center space-x-2">
                  <studio.icon className="h-4 w-4" />
                  <span>{studio.name}</span>
                </CardTitle>
                <div className="text-xs text-muted-foreground">
                  {studio.requests} requests
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Response Time</span>
                      <span>{studio.avgResponseTime.toFixed(2)}ms</span>
                    </div>
                    <Progress value={Math.max(100 - (studio.avgResponseTime / 10), 0)} />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Success Rate</span>
                      <span>{studio.successRate}%</span>
                    </div>
                    <Progress value={studio.successRate} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}