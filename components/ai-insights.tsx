"use client"

import { useState, useEffect } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, TrendingUp, AlertTriangle, RefreshCw } from "lucide-react"
import { aiService } from "@/lib/services/weather-service"
import { useWeatherStore } from "@/lib/store/weather-store"

export function AIInsights() {
  const { weatherData, forecastData, currentLocation } = useWeatherStore()
  const [insights, setInsights] = useState<string>("")
  const [trends, setTrends] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generateInsights = async () => {
    if (!weatherData || !currentLocation) return

    setLoading(true)
    setError(null)

    try {
      const insightsText = await aiService.getCloudBurstInsights(weatherData, currentLocation.name)
      setInsights(insightsText)

      if (forecastData?.list) {
        const trendsText = await aiService.getWeatherTrends(forecastData.list, currentLocation.name)
        setTrends(trendsText)
      }
    } catch (err) {
      setError("Failed to generate AI insights")
      console.error("AI insights error:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (weatherData && currentLocation) {
      generateInsights()
    }
  }, [weatherData, currentLocation])

  return (
    <div className="space-y-6">
      {/* AI Insights Card */}
      <Card className="border-l-4 border-l-purple-500 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50">
          <CardTitle className="flex items-center gap-3 text-purple-800">
            <Brain className="h-6 w-6" />
            AI Cloud Burst Analysis
            {loading && <RefreshCw className="h-4 w-4 animate-spin ml-auto" />}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {error ? (
            <div className="text-center py-8">
              <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <p className="text-red-600 font-medium">{error}</p>
              <p className="text-gray-500 text-sm mt-2">
                Make sure your GROQ_API_KEY environment variable is configured.
              </p>
            </div>
          ) : loading ? (
            <div className="text-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin text-purple-600 mx-auto mb-4" />
              <p className="text-gray-600">Generating AI insights...</p>
            </div>
          ) : insights ? (
            <div className="ai-markdown prose prose-sm max-w-none prose-headings:font-semibold prose-headings:text-gray-800 prose-h2:text-xl prose-h2:mt-6 prose-h2:mb-4 prose-h3:text-lg prose-h3:mt-4 prose-h3:mb-3 prose-p:text-gray-600 prose-p:leading-relaxed prose-p:mb-3 prose-strong:text-gray-800 prose-strong:font-semibold prose-ul:list-disc prose-ul:ml-6 prose-ul:mb-4 prose-li:text-gray-600 prose-li:mb-2 prose-table:w-full prose-table:border-collapse prose-table:my-4 prose-th:bg-gray-100 prose-th:border prose-th:border-gray-300 prose-th:px-4 prose-th:py-2 prose-th:text-left prose-th:font-semibold prose-th:text-gray-800 prose-td:border prose-td:border-gray-300 prose-td:px-4 prose-td:py-2 prose-td:text-gray-600 prose-blockquote:border-l-4 prose-blockquote:border-purple-400 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-600 prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:text-purple-700">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h2: ({ node, ...props }) => (
                    <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-4 pb-2 border-b border-gray-200" {...props} />
                  ),
                  h3: ({ node, ...props }) => (
                    <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-3" {...props} />
                  ),
                  p: ({ node, ...props }) => (
                    <p className="text-gray-600 leading-relaxed mb-3" {...props} />
                  ),
                  ul: ({ node, ...props }) => (
                    <ul className="list-disc ml-6 mb-4 space-y-1" {...props} />
                  ),
                  ol: ({ node, ...props }) => (
                    <ol className="list-decimal ml-6 mb-4 space-y-1" {...props} />
                  ),
                  li: ({ node, ...props }) => (
                    <li className="text-gray-600 mb-1" {...props} />
                  ),
                  table: ({ node, ...props }) => (
                    <div className="overflow-x-auto my-4">
                      <table className="w-full border-collapse border border-gray-300 rounded-lg overflow-hidden" {...props} />
                    </div>
                  ),
                  thead: ({ node, ...props }) => (
                    <thead className="bg-gradient-to-r from-purple-50 to-indigo-50" {...props} />
                  ),
                  th: ({ node, ...props }) => (
                    <th className="border border-gray-300 px-4 py-2 text-left font-semibold text-gray-800" {...props} />
                  ),
                  td: ({ node, ...props }) => (
                    <td className="border border-gray-300 px-4 py-2 text-gray-600" {...props} />
                  ),
                  strong: ({ node, ...props }) => (
                    <strong className="font-semibold text-gray-800" {...props} />
                  ),
                  em: ({ node, ...props }) => (
                    <em className="italic text-gray-700" {...props} />
                  ),
                  blockquote: ({ node, ...props }) => (
                    <blockquote className="border-l-4 border-purple-400 pl-4 italic text-gray-600 my-4" {...props} />
                  ),
                  code: ({ node, inline, ...props }: any) => {
                    if (inline) {
                      return (
                        <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm text-purple-700 font-mono" {...props} />
                      )
                    }
                    return (
                      <code className="block bg-gray-100 p-3 rounded text-sm text-gray-800 font-mono overflow-x-auto my-4" {...props} />
                    )
                  },
                }}
              >
                {insights}
              </ReactMarkdown>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No AI insights available yet.</p>
              <p className="text-sm">Weather data is being analyzed...</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Weather Trends Card */}
      {trends && (
        <Card className="border-l-4 border-l-green-500 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
            <CardTitle className="flex items-center gap-3 text-green-800">
              <TrendingUp className="h-6 w-6" />
              5-Day Weather Trend Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="ai-markdown prose prose-sm max-w-none prose-headings:font-semibold prose-headings:text-gray-800 prose-h2:text-xl prose-h2:mt-6 prose-h2:mb-4 prose-h3:text-lg prose-h3:mt-4 prose-h3:mb-3 prose-p:text-gray-600 prose-p:leading-relaxed prose-p:mb-3 prose-strong:text-gray-800 prose-strong:font-semibold prose-ul:list-disc prose-ul:ml-6 prose-ul:mb-4 prose-li:text-gray-600 prose-li:mb-2 prose-table:w-full prose-table:border-collapse prose-table:my-4 prose-th:bg-gray-100 prose-th:border prose-th:border-gray-300 prose-th:px-4 prose-th:py-2 prose-th:text-left prose-th:font-semibold prose-th:text-gray-800 prose-td:border prose-td:border-gray-300 prose-td:px-4 prose-td:py-2 prose-td:text-gray-600">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h2: ({ node, ...props }) => (
                    <h2 className="text-xl font-semibold text-green-800 mt-6 mb-4 pb-2 border-b border-green-200" {...props} />
                  ),
                  h3: ({ node, ...props }) => (
                    <h3 className="text-lg font-semibold text-green-800 mt-4 mb-3" {...props} />
                  ),
                  p: ({ node, ...props }) => (
                    <p className="text-gray-600 leading-relaxed mb-3" {...props} />
                  ),
                  ul: ({ node, ...props }) => (
                    <ul className="list-disc ml-6 mb-4 space-y-1" {...props} />
                  ),
                  ol: ({ node, ...props }) => (
                    <ol className="list-decimal ml-6 mb-4 space-y-1" {...props} />
                  ),
                  li: ({ node, ...props }) => (
                    <li className="text-gray-600 mb-1" {...props} />
                  ),
                  table: ({ node, ...props }) => (
                    <div className="overflow-x-auto my-4">
                      <table className="w-full border-collapse border border-gray-300 rounded-lg overflow-hidden" {...props} />
                    </div>
                  ),
                  thead: ({ node, ...props }) => (
                    <thead className="bg-gradient-to-r from-green-50 to-emerald-50" {...props} />
                  ),
                  th: ({ node, ...props }) => (
                    <th className="border border-gray-300 px-4 py-2 text-left font-semibold text-gray-800" {...props} />
                  ),
                  td: ({ node, ...props }) => (
                    <td className="border border-gray-300 px-4 py-2 text-gray-600" {...props} />
                  ),
                  strong: ({ node, ...props }) => (
                    <strong className="font-semibold text-green-700" {...props} />
                  ),
                }}
              >
                {trends}
              </ReactMarkdown>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Risk Assessment Summary */}
      {insights && (
        <Card className="border-l-4 border-l-orange-500 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50">
            <CardTitle className="flex items-center gap-3 text-orange-800">
              <AlertTriangle className="h-6 w-6" />
              AI Risk Assessment
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600 mb-1">AI</div>
                <div className="text-sm text-gray-600">Powered Analysis</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 mb-1">24/7</div>
                <div className="text-sm text-gray-600">Real-time Monitoring</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600 mb-1">ML</div>
                <div className="text-sm text-gray-600">Machine Learning</div>
              </div>
            </div>
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 text-center">
                <strong>Note:</strong> AI insights are generated using advanced meteorological analysis
                and should be used in conjunction with official weather warnings and emergency services.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
