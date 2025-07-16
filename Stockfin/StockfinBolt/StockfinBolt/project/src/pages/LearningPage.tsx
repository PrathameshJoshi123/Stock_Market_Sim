import React, { useState } from "react";
import {
  Book,
  BookOpen,
  Video,
  Award,
  CreditCard,
  BarChart2,
  PieChart,
  Users,
  Monitor,
  CheckCircle,
  ChevronRight,
  Star,
  Lightbulb,
  Info,
} from "lucide-react";

// Mock course data
const courses = [
  {
    id: "course-1",
    title: "Trading Fundamentals",
    description:
      "Learn the basics of stock trading, market mechanics, and essential terminology.",
    level: "Beginner",
    duration: "3 hours",
    topics: [
      "Market Basics",
      "Order Types",
      "Reading Charts",
      "Risk Management",
    ],
    image: "https://via.placeholder.com/400x225",
    progress: 65,
  },
  {
    id: "course-2",
    title: "Technical Analysis",
    description:
      "Master chart patterns, indicators, and technical tools to improve your trading decisions.",
    level: "Intermediate",
    duration: "5 hours",
    topics: [
      "Chart Patterns",
      "Indicators",
      "Trend Analysis",
      "Support & Resistance",
    ],
    image: "https://via.placeholder.com/400x225",
    progress: 30,
  },
  {
    id: "course-3",
    title: "Fundamental Analysis",
    description:
      "Understand how to evaluate company financials and economic factors for long-term investing.",
    level: "Intermediate",
    duration: "4 hours",
    topics: [
      "Financial Statements",
      "Valuation Methods",
      "Economic Indicators",
      "Industry Analysis",
    ],
    image: "https://via.placeholder.com/400x225",
    progress: 0,
  },
  {
    id: "course-4",
    title: "Advanced Trading Psychology",
    description:
      "Develop mental discipline and overcome emotional biases that affect trading decisions.",
    level: "Advanced",
    duration: "3 hours",
    topics: [
      "Cognitive Biases",
      "Emotional Control",
      "Decision Making",
      "Psychology of Risk",
    ],
    image: "https://via.placeholder.com/400x225",
    progress: 0,
  },
];

// Mock quiz data
const quizzes = [
  {
    id: "quiz-1",
    title: "Stock Market Basics",
    questions: 10,
    difficulty: "Easy",
    completions: 1243,
    avgScore: "78%",
  },
  {
    id: "quiz-2",
    title: "Technical Indicators",
    questions: 15,
    difficulty: "Medium",
    completions: 867,
    avgScore: "65%",
  },
  {
    id: "quiz-3",
    title: "Risk Management Strategies",
    questions: 12,
    difficulty: "Medium",
    completions: 954,
    avgScore: "72%",
  },
  {
    id: "quiz-4",
    title: "Advanced Portfolio Theory",
    questions: 20,
    difficulty: "Hard",
    completions: 432,
    avgScore: "58%",
  },
];

// Featured lesson content
const featuredLesson = {
  title: "Understanding Market Volatility",
  description:
    "Learn how to navigate and profit from market volatility instead of fearing it.",
  video: "https://via.placeholder.com/640x360",
  keyPoints: [
    "Volatility as an opportunity rather than a threat",
    "Strategies for volatile market conditions",
    "Using technical indicators to measure volatility",
    "Setting appropriate stop-losses in volatile markets",
  ],
  instructor: "Jane Wilson",
  instructorTitle: "Professional Trader & Educator",
};

// Trading tips
const tradingTips = [
  "Always use stop-loss orders to limit potential losses",
  "Never risk more than 1-2% of your portfolio on a single trade",
  "Develop and stick to a consistent trading plan",
  "Keep a trading journal to track and analyze your decisions",
  "Practice new strategies in a simulator before using real money",
  "Avoid making emotional decisions - stick to your analysis",
];

export function LearningPage() {
  const [activeTab, setActiveTab] = useState("courses");
  const [expandedTip, setExpandedTip] = useState<number | null>(null);

  return (
    <div className="min-h-screen p-6">
      {/* Background effects */}
      <div className="fixed inset-0 bg-black z-0">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 255, 0.03) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        ></div>
        <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-black to-transparent"></div>
      </div>

      <div className="relative z-10 max-w-[1440px] mx-auto">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-2 mb-2">
            <BookOpen className="w-7 h-7 text-cyan-400" /> Learning Center
          </h1>
          <p className="text-gray-300">
            Enhance your trading knowledge with courses, tutorials, and
            interactive quizzes
          </p>
        </div>

        {/* Featured lesson */}
        <div className="mb-12">
          <div className="bg-black/80 neon-border rounded-lg overflow-hidden">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6">
                <div className="mb-4">
                  <div className="bg-cyan-900/30 text-cyan-300 text-xs px-2 py-1 rounded-full inline-block mb-2">
                    Featured Lesson
                  </div>
                  <h2 className="text-2xl font-bold">{featuredLesson.title}</h2>
                  <p className="text-gray-300 mt-2">
                    {featuredLesson.description}
                  </p>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-2">
                    What you'll learn:
                  </h3>
                  <ul className="space-y-2">
                    {featuredLesson.keyPoints.map((point, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-cyan-400 mr-2 flex-shrink-0 mt-0.5" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-cyan-900/50 rounded-full"></div>
                  <div>
                    <div className="font-medium">
                      {featuredLesson.instructor}
                    </div>
                    <div className="text-sm text-gray-400">
                      {featuredLesson.instructorTitle}
                    </div>
                  </div>
                </div>

                <button className="mt-6 bg-gradient-to-r from-cyan-600 to-cyan-400 hover:from-cyan-500 hover:to-cyan-300 text-black font-semibold px-6 py-2 rounded-lg transition-all flex items-center gap-2">
                  Start Learning <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <div className="bg-gray-900 flex items-center justify-center">
                <div className="relative w-full h-full min-h-[300px]">
                  <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                    <div className="w-16 h-16 rounded-full bg-cyan-500/80 text-black flex items-center justify-center cursor-pointer hover:bg-cyan-400 transition-colors">
                      <Video className="w-8 h-8" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation tabs */}
        <div className="mb-6">
          <div className="bg-black/70 border border-cyan-500/30 rounded-lg p-1 flex gap-1 shadow-[0_0_10px_rgba(0,255,255,0.15)] max-w-md">
            <button
              className={`flex-1 px-4 py-2 rounded flex items-center justify-center gap-2 transition-all duration-300 ${
                activeTab === "courses"
                  ? "bg-gradient-to-r from-cyan-600 to-cyan-500 text-black font-semibold shadow-lg"
                  : "bg-black/60 text-cyan-400 hover:bg-black/40"
              }`}
              onClick={() => setActiveTab("courses")}
            >
              <Book
                className={`w-4 h-4 ${
                  activeTab === "courses" ? "text-black" : "text-cyan-400"
                }`}
              />
              <span>Courses</span>
            </button>

            <button
              className={`flex-1 px-4 py-2 rounded flex items-center justify-center gap-2 transition-all duration-300 ${
                activeTab === "quizzes"
                  ? "bg-gradient-to-r from-cyan-600 to-cyan-500 text-black font-semibold shadow-lg"
                  : "bg-black/60 text-cyan-400 hover:bg-black/40"
              }`}
              onClick={() => setActiveTab("quizzes")}
            >
              <Award
                className={`w-4 h-4 ${
                  activeTab === "quizzes" ? "text-black" : "text-cyan-400"
                }`}
              />
              <span>Quizzes</span>
            </button>

            <button
              className={`flex-1 px-4 py-2 rounded flex items-center justify-center gap-2 transition-all duration-300 ${
                activeTab === "tips"
                  ? "bg-gradient-to-r from-cyan-600 to-cyan-500 text-black font-semibold shadow-lg"
                  : "bg-black/60 text-cyan-400 hover:bg-black/40"
              }`}
              onClick={() => setActiveTab("tips")}
            >
              <Lightbulb
                className={`w-4 h-4 ${
                  activeTab === "tips" ? "text-black" : "text-cyan-400"
                }`}
              />
              <span>Trading Tips</span>
            </button>
          </div>
        </div>

        {/* Courses Tab */}
        {activeTab === "courses" && (
          <div className="mb-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="bg-black/80 neon-border rounded-lg overflow-hidden flex flex-col"
                >
                  <div className="h-40 bg-cyan-900/20 relative">
                    <div className="absolute top-3 right-3 bg-black/70 text-cyan-300 text-xs px-2 py-1 rounded-full">
                      {course.level}
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      {course.level === "Beginner" && (
                        <CreditCard className="w-12 h-12 text-cyan-500/50" />
                      )}
                      {course.level === "Intermediate" && (
                        <BarChart2 className="w-12 h-12 text-cyan-500/50" />
                      )}
                      {course.level === "Advanced" && (
                        <PieChart className="w-12 h-12 text-cyan-500/50" />
                      )}
                    </div>
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <h3 className="text-lg font-bold mb-2">{course.title}</h3>
                    <p className="text-gray-300 text-sm mb-4 flex-1">
                      {course.description}
                    </p>
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <div className="text-xs text-gray-400 flex items-center">
                        <Clock className="w-3 h-3 mr-1 text-cyan-400" />{" "}
                        {course.duration}
                      </div>
                      <div className="text-xs text-gray-400 flex items-center">
                        <BookOpen className="w-3 h-3 mr-1 text-cyan-400" />{" "}
                        {course.topics.length} topics
                      </div>
                    </div>

                    {course.progress > 0 ? (
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-cyan-300">In Progress</span>
                          <span className="text-gray-400">
                            {course.progress}% complete
                          </span>
                        </div>
                        <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-cyan-500 to-cyan-300 h-full rounded-full"
                            style={{ width: `${course.progress}%` }}
                          />
                        </div>
                        <button className="w-full mt-4 bg-cyan-600 hover:bg-cyan-500 text-white font-medium py-2 rounded transition-colors">
                          Continue
                        </button>
                      </div>
                    ) : (
                      <button className="w-full mt-4 bg-black border border-cyan-500 hover:bg-cyan-900/20 text-cyan-400 font-medium py-2 rounded transition-colors">
                        Start Course
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {/* Browse more courses card */}
              <div className="bg-gradient-to-r from-cyan-900/20 to-purple-900/20 border border-cyan-500/30 border-dashed rounded-lg flex flex-col items-center justify-center min-h-[320px] cursor-pointer hover:bg-black/40 transition-all">
                <Book className="w-12 h-12 text-cyan-500/50 mb-4" />
                <h3 className="text-lg font-bold text-cyan-400 mb-2">
                  Browse More Courses
                </h3>
                <p className="text-cyan-500/70 text-center max-w-xs">
                  Explore our full course catalog with over 30+ specialized
                  trading courses
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Quizzes Tab */}
        {activeTab === "quizzes" && (
          <div className="mb-8">
            <div className="grid md:grid-cols-2 gap-6">
              {quizzes.map((quiz) => (
                <div
                  key={quiz.id}
                  className="bg-black/80 neon-border rounded-lg p-5 hover:bg-black/60 transition-all"
                >
                  <div className="flex justify-between mb-4">
                    <h3 className="text-lg font-bold">{quiz.title}</h3>
                    <div
                      className={`text-xs px-2 py-1 rounded-full ${
                        quiz.difficulty === "Easy"
                          ? "bg-green-900/30 text-green-400"
                          : quiz.difficulty === "Medium"
                          ? "bg-yellow-900/30 text-yellow-400"
                          : "bg-red-900/30 text-red-400"
                      }`}
                    >
                      {quiz.difficulty}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mb-6">
                    <div className="bg-black/40 p-3 rounded border border-cyan-500/20">
                      <div className="text-xs text-gray-400">Questions</div>
                      <div className="text-lg font-semibold text-cyan-300">
                        {quiz.questions}
                      </div>
                    </div>
                    <div className="bg-black/40 p-3 rounded border border-cyan-500/20">
                      <div className="text-xs text-gray-400">Completions</div>
                      <div className="text-lg font-semibold text-cyan-300">
                        {quiz.completions}
                      </div>
                    </div>
                    <div className="bg-black/40 p-3 rounded border border-cyan-500/20">
                      <div className="text-xs text-gray-400">Avg. Score</div>
                      <div className="text-lg font-semibold text-cyan-300">
                        {quiz.avgScore}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex">
                      {Array(5)
                        .fill(0)
                        .map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < 4
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-600"
                            }`}
                          />
                        ))}
                    </div>
                    <button className="bg-gradient-to-r from-cyan-600 to-cyan-400 hover:from-cyan-500 hover:to-cyan-300 text-black font-semibold px-4 py-1.5 rounded transition-all text-sm">
                      Take Quiz
                    </button>
                  </div>
                </div>
              ))}

              {/* Create Quiz Card */}
              <div className="bg-black/80 neon-border rounded-lg p-5 flex items-center">
                <div className="border-r border-cyan-500/30 pr-5 mr-5">
                  <Monitor className="w-12 h-12 text-cyan-500" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-1">Instructor Mode</h3>
                  <p className="text-gray-300 text-sm mb-3">
                    Create custom quizzes to test your students or peers on
                    specific trading concepts
                  </p>
                  <button className="bg-black border border-cyan-500 hover:bg-cyan-900/20 text-cyan-400 px-4 py-1.5 rounded transition-colors text-sm">
                    Create Quiz
                  </button>
                </div>
              </div>

              {/* Certification Quiz Card */}
              <div className="bg-gradient-to-r from-cyan-900/20 to-purple-900/30 border border-cyan-500/50 rounded-lg p-5">
                <div className="flex items-center gap-3 mb-3">
                  <Award className="w-8 h-8 text-yellow-400" />
                  <h3 className="text-lg font-bold">StockFin Certification</h3>
                </div>
                <p className="text-gray-300 text-sm mb-4">
                  Complete our comprehensive certification exam to showcase your
                  trading knowledge and skills
                </p>
                <div className="flex justify-between items-center">
                  <div className="text-sm text-yellow-300">
                    120 questions • 90 minutes
                  </div>
                  <button className="bg-yellow-600 hover:bg-yellow-500 text-black font-semibold px-4 py-1.5 rounded transition-all text-sm">
                    Get Certified
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Trading Tips Tab */}
        {activeTab === "tips" && (
          <div className="mb-8">
            <div className="bg-black/80 neon-border rounded-lg p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-cyan-900/30 p-3 rounded-lg">
                  <Lightbulb className="w-6 h-6 text-yellow-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Essential Trading Tips</h2>
                  <p className="text-gray-300">
                    Key principles to improve your trading performance and
                    discipline
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {tradingTips.map((tip, index) => (
                  <div
                    key={index}
                    className="bg-black/40 border border-cyan-500/30 rounded-lg p-4 cursor-pointer hover:bg-cyan-900/10 transition-all"
                    onClick={() =>
                      setExpandedTip(expandedTip === index ? null : index)
                    }
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-cyan-900/30 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                        {index + 1}
                      </div>
                      <h3 className="font-medium">{tip}</h3>
                    </div>

                    {expandedTip === index && (
                      <div className="ml-11 mt-3 text-gray-300 text-sm">
                        <p>
                          Additional explanation and context for this trading
                          tip would appear here. This would include examples,
                          real-world applications, and specific scenarios where
                          this principle is particularly important.
                        </p>
                        <div className="mt-3 flex items-start gap-2 bg-cyan-900/10 p-3 rounded">
                          <Info className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                          <p className="text-cyan-300">
                            Pro tip: Experienced traders often implement this
                            principle by setting up automated rules in their
                            trading system to remove emotional decision-making.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-8 bg-gradient-to-r from-cyan-900/20 to-purple-900/20 rounded-lg p-5">
                <div className="flex items-center gap-3 mb-3">
                  <Users className="w-6 h-6 text-cyan-400" />
                  <h3 className="text-lg font-bold">Community Tips</h3>
                </div>
                <p className="text-gray-300 mb-4">
                  Learn from the StockFin community! Browse and submit trading
                  tips from experienced traders around the world.
                </p>
                <button className="bg-black border border-cyan-500 hover:bg-cyan-900/20 text-cyan-400 px-4 py-2 rounded transition-colors text-sm">
                  Browse Community Tips
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
