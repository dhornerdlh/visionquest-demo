"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import { courses } from "@/lib/data";

export default function CourseViewer() {
  const params = useParams();
  const course = courses.find((c) => c.id === params.id);
  const [activeLesson, setActiveLesson] = useState<string | null>(null);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(
    new Set()
  );

  if (!course) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <p className="text-gray-400 text-lg">Course not found.</p>
          <Link
            href="/courses"
            className="text-teal-600 hover:text-teal-700 mt-4 inline-block"
          >
            ← Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  const allLessons = course.modules.flatMap((m) => m.lessons);
  const currentLesson = allLessons.find((l) => l.id === activeLesson);
  const progress = Math.round(
    (completedLessons.size / allLessons.length) * 100
  );

  const toggleComplete = (lessonId: string) => {
    setCompletedLessons((prev) => {
      const next = new Set(prev);
      if (next.has(lessonId)) next.delete(lessonId);
      else next.add(lessonId);
      return next;
    });
  };

  const typeIcon = (type: string) => {
    switch (type) {
      case "video":
        return "▶";
      case "quiz":
        return "?";
      default:
        return "≡";
    }
  };

  const typeColor = (type: string) => {
    switch (type) {
      case "video":
        return "bg-blue-100 text-blue-600";
      case "quiz":
        return "bg-amber-100 text-amber-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/courses" className="hover:text-teal-600">
            Courses
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">{course.title}</span>
        </div>

        {/* Course header */}
        <div className="bg-gradient-to-r from-teal-700 to-teal-600 rounded-2xl p-8 text-white mb-8">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <span className="inline-block px-3 py-1 text-xs font-medium bg-white/20 rounded-full mb-3">
                {course.category}
              </span>
              <h1 className="text-3xl font-bold mb-3">{course.title}</h1>
              <p className="text-teal-100 max-w-2xl">{course.description}</p>
              <div className="flex items-center gap-6 mt-4 text-sm text-teal-200">
                <span>{course.duration}</span>
                <span>{course.lessons} lessons</span>
                <span>{course.modules.length} modules</span>
                <span>{course.level}</span>
              </div>
            </div>
            <span className="text-6xl ml-6 hidden sm:block">
              {course.thumbnail}
            </span>
          </div>
          {/* Progress bar */}
          <div className="mt-6">
            <div className="flex items-center justify-between text-sm mb-2">
              <span>Progress</span>
              <span>{progress}% complete</span>
            </div>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Sidebar - Module list */}
          <div className="lg:col-span-1 space-y-4">
            {course.modules.map((mod) => (
              <div
                key={mod.id}
                className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
              >
                <div className="px-5 py-3 bg-gray-50 border-b border-gray-200">
                  <h3 className="font-semibold text-sm text-gray-900">
                    {mod.title}
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {mod.lessons.length} lessons
                  </p>
                </div>
                <div className="divide-y divide-gray-100">
                  {mod.lessons.map((lesson) => {
                    const isActive = activeLesson === lesson.id;
                    const isComplete = completedLessons.has(lesson.id);
                    return (
                      <button
                        key={lesson.id}
                        onClick={() => setActiveLesson(lesson.id)}
                        className={`w-full text-left px-5 py-3 flex items-center gap-3 transition-colors ${
                          isActive
                            ? "bg-teal-50 border-l-3 border-teal-500"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        <span
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium shrink-0 ${
                            isComplete
                              ? "bg-teal-500 text-white"
                              : typeColor(lesson.type)
                          }`}
                        >
                          {isComplete ? "✓" : typeIcon(lesson.type)}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-sm truncate ${
                              isActive
                                ? "font-medium text-teal-700"
                                : "text-gray-700"
                            }`}
                          >
                            {lesson.title}
                          </p>
                          <p className="text-xs text-gray-400">
                            {lesson.duration}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Content area */}
          <div className="lg:col-span-2">
            {currentLesson ? (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
                <div className="flex items-center gap-3 mb-6">
                  <span
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${typeColor(
                      currentLesson.type
                    )}`}
                  >
                    {typeIcon(currentLesson.type)}
                  </span>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {currentLesson.title}
                    </h2>
                    <p className="text-sm text-gray-400">
                      {currentLesson.type === "video"
                        ? "Video Lesson"
                        : currentLesson.type === "quiz"
                        ? "Knowledge Check"
                        : "Reading"}{" "}
                      · {currentLesson.duration}
                    </p>
                  </div>
                </div>

                {currentLesson.type === "video" && (
                  <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center mb-6">
                    <div className="text-center text-white/60">
                      <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-3">
                        <span className="text-2xl">▶</span>
                      </div>
                      <p className="text-sm">Video Player</p>
                      <p className="text-xs text-white/40 mt-1">
                        {currentLesson.duration}
                      </p>
                    </div>
                  </div>
                )}

                {currentLesson.type === "quiz" && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-6">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 text-lg font-bold">
                        ?
                      </span>
                      <div>
                        <h3 className="font-semibold text-amber-800">
                          Knowledge Check
                        </h3>
                        <p className="text-sm text-amber-600">
                          Interactive quiz · {currentLesson.duration}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-amber-700">
                      {currentLesson.content}
                    </p>
                  </div>
                )}

                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-600 leading-relaxed">
                    {currentLesson.content}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
                  <button
                    onClick={() => toggleComplete(currentLesson.id)}
                    className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      completedLessons.has(currentLesson.id)
                        ? "bg-teal-100 text-teal-700 hover:bg-teal-200"
                        : "bg-teal-600 text-white hover:bg-teal-700"
                    }`}
                  >
                    {completedLessons.has(currentLesson.id)
                      ? "✓ Completed"
                      : "Mark as Complete"}
                  </button>
                  {(() => {
                    const idx = allLessons.findIndex(
                      (l) => l.id === currentLesson.id
                    );
                    const next = allLessons[idx + 1];
                    if (!next) return null;
                    return (
                      <button
                        onClick={() => {
                          toggleComplete(currentLesson.id);
                          setActiveLesson(next.id);
                        }}
                        className="text-sm text-teal-600 hover:text-teal-700 font-medium"
                      >
                        Next: {next.title} →
                      </button>
                    );
                  })()}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
                <div className="text-5xl mb-4">{course.thumbnail}</div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  Ready to start learning?
                </h2>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                  Select a lesson from the sidebar to begin. You can track your
                  progress and mark lessons as complete as you go.
                </p>
                <button
                  onClick={() => setActiveLesson(allLessons[0]?.id)}
                  className="px-6 py-3 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors"
                >
                  Start First Lesson
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
