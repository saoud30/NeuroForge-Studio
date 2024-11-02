// Analytics utility functions
export const updateAnalytics = (studio: string, responseTime: number, success: boolean) => {
  try {
    // Get existing analytics data
    const storedData = localStorage.getItem('neuroforge_analytics') || '{}';
    const data = JSON.parse(storedData);

    // Update total metrics
    const totalRequests = (data.totalRequests || 0) + 1;
    const totalResponseTime = (data.totalResponseTime || 0) + responseTime;
    const successCount = (data.successCount || 0) + (success ? 1 : 0);

    // Update studio-specific metrics
    const studioMetrics = data.studioMetrics || [];
    const studioIndex = studioMetrics.findIndex((s: any) => s.name === studio);
    
    if (studioIndex >= 0) {
      const currentStudio = studioMetrics[studioIndex];
      studioMetrics[studioIndex] = {
        ...currentStudio,
        requests: (currentStudio.requests || 0) + 1,
        avgResponseTime: ((currentStudio.avgResponseTime || 0) * (currentStudio.requests || 0) + responseTime) / ((currentStudio.requests || 0) + 1),
        successRate: ((currentStudio.successCount || 0) + (success ? 1 : 0)) / ((currentStudio.requests || 0) + 1) * 100
      };
    } else {
      studioMetrics.push({
        name: studio,
        requests: 1,
        avgResponseTime: responseTime,
        successRate: success ? 100 : 0,
        successCount: success ? 1 : 0
      });
    }

    // Update analytics data
    const updatedData = {
      totalRequests,
      avgResponseTime: totalResponseTime / totalRequests,
      successRate: (successCount / totalRequests) * 100,
      studioMetrics,
      lastUpdated: new Date().toISOString()
    };

    localStorage.setItem('neuroforge_analytics', JSON.stringify(updatedData));
  } catch (error) {
    console.error('Error updating analytics:', error);
  }
};