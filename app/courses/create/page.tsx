"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import type { Course, Module, Lesson } from "@/lib/data";
import { saveCustomCourse, generateCourseId } from "@/lib/courseStorage";

const CATEGORIES = [
  "Compliance",
  "Professional Development",
  "Skills Training",
  "Onboarding",
  "Technical",
  "Custom",
];

const EMOJIS = [
  "📚",
  "🎯",
  "🛡️",
  "🔒",
  "⭐",
  "📋",
  "🤝",
  "💡",
  "🔧",
  "📊",
  "🎓",
  "🚀",
  "💻",
  "🏗️",
  "📝",
  "🔬",
  "🎨",
  "📈",
  "⚡",
  "🌐",
];

type LessonType = "text" | "video" | "quiz" | "link";

interface LessonDraft {
  title: string;
  type: LessonType;
  duration: string;
  content: string;
  url: string;
}

interface ModuleDraft {
  title: string;
  lessons: LessonDraft[];
}

function newLesson(): LessonDraft {
  return { title: "", type: "text", duration: "5 min", content: "", url: "" };
}

function newModule(): ModuleDraft {
  return { title: "", lessons: [newLesson()] };
}

export default function CreateCoursePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Skills Training");
  const [customCategory, setCustomCategory] = useState("");
  const [level, setLevel] = useState<"Beginner" | "Intermediate" | "Advanced">(
    "Beginner"
  );
  const [thumbnail, setThumbnail] = useState("📚");
  const [modules, setModules] = useState<ModuleDraft[]>([newModule()]);
  const [saving, setSaving] = useState(false);

  const updateModule = (idx: number, field: string, value: string) => {
    setModules((prev) =>
      prev.map((m, i) => (i === idx ? { ...m, [field]: value } : m))
    );
  };

  const removeModule = (idx: number) => {
    setModules((prev) => prev.filter((_, i) => i !== idx));
  };

  const updateLesson = (
    mIdx: number,
    lIdx: number,
    field: string,
    value: string
  ) => {
    setModules((prev) =>
      prev.map((m, mi) =>
        mi === mIdx
          ? {
              ...m,
              lessons: m.lessons.map((l, li) =>
                li === lIdx ? { ...l, [field]: value } : l
              ),
            }
          : m
      )
    );
  };

  const addLesson = (mIdx: number) => {
    setModules((prev) =>
      prev.map((m, i) =>
        i === mIdx ? { ...m, lessons: [...m.lessons, newLesson()] } : m
      )
    );
  };

  const removeLesson = (mIdx: number, lIdx: number) => {
    setModules((prev) =>
      prev.map((m, mi) =>
        mi === mIdx
          ? { ...m, lessons: m.lessons.filter((_, li) => li !== lIdx) }
          : m
      )
    );
  };

  const handleSave = () => {
    if (!title.trim()) return;
    setSaving(true);

    const courseId = generateCourseId(title);
    const finalCategory =
      category === "Custom" ? customCategory || "Custom" : category;

    const totalLessons = modules.reduce(
      (sum, m) => sum + m.lessons.length,
      0
    );

    const course: Course = {
      id: courseId,
      title: title.trim(),
      description: description.trim(),
      category: finalCategory,
      thumbnail,
      duration: `${totalLessons * 5} min`,
      lessons: totalLessons,
      level,
      isCustom: true,
      createdAt: new Date().toISOString(),
      modules: modules
        .filter((m) => m.title.trim())
        .map((m, mIdx) => ({
          id: `${courseId}-m${mIdx}`,
          title: m.title.trim(),
          lessons: m.lessons
            .filter((l) => l.title.trim())
            .map(
              (l, lIdx): Lesson => ({
                id: `${courseId}-m${mIdx}-l${lIdx}`,
                title: l.title.trim(),
                type: l.type,
                duration: l.duration || "5 min",
                content: l.content.trim(),
                ...(l.url.trim() ? { url: l.url.trim() } : {}),
              })
            ),
        }))
        .filter((m) => m.lessons.length > 0),
    };

    saveCustomCourse(course);
    router.push("/courses");
  };

  const isValid =
    title.trim() &&
    modules.some(
      (m) => m.title.trim() && m.lessons.some((l) => l.title.trim())
    );

  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/courses" className="hover:text-teal-600">
            Courses
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">Create Course</span>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Create a New Course
        </h1>
        <p className="text-gray-500 mb-8">
          Build a training course with modules, lessons, and external resources.
        </p>

        {/* Course Info */}
        <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Course Details
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., New Employee Orientation"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of what learners will gain..."
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
              >
                {CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
              {category === "Custom" && (
                <input
                  type="text"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  placeholder="Enter category name"
                  className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Level
              </label>
              <select
                value={level}
                onChange={(e) =>
                  setLevel(
                    e.target.value as "Beginner" | "Intermediate" | "Advanced"
                  )
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
              >
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Thumbnail
              </label>
              <div className="flex flex-wrap gap-2">
                {EMOJIS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setThumbnail(emoji)}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl transition-all ${
                      thumbnail === emoji
                        ? "bg-teal-100 ring-2 ring-teal-500"
                        : "bg-gray-50 hover:bg-gray-100"
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Modules & Lessons */}
        <section className="space-y-4 mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Modules & Lessons
            </h2>
            <button
              type="button"
              onClick={() => setModules((prev) => [...prev, newModule()])}
              className="px-4 py-2 text-sm font-medium text-teal-600 bg-teal-50 rounded-lg hover:bg-teal-100 transition-colors"
            >
              + Add Module
            </button>
          </div>

          {modules.map((mod, mIdx) => (
            <div
              key={mIdx}
              className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
            >
              {/* Module header */}
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center gap-3">
                <span className="text-sm font-medium text-gray-400">
                  Module {mIdx + 1}
                </span>
                <input
                  type="text"
                  value={mod.title}
                  onChange={(e) =>
                    updateModule(mIdx, "title", e.target.value)
                  }
                  placeholder="Module title..."
                  className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
                {modules.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeModule(mIdx)}
                    className="text-sm text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                )}
              </div>

              {/* Lessons */}
              <div className="p-6 space-y-4">
                {mod.lessons.map((lesson, lIdx) => (
                  <div
                    key={lIdx}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs text-gray-400 font-medium">
                        Lesson {lIdx + 1}
                      </span>
                      {mod.lessons.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeLesson(mIdx, lIdx)}
                          className="ml-auto text-xs text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <div className="grid sm:grid-cols-3 gap-3 mb-3">
                      <input
                        type="text"
                        value={lesson.title}
                        onChange={(e) =>
                          updateLesson(mIdx, lIdx, "title", e.target.value)
                        }
                        placeholder="Lesson title"
                        className="sm:col-span-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      />
                      <select
                        value={lesson.type}
                        onChange={(e) =>
                          updateLesson(mIdx, lIdx, "type", e.target.value)
                        }
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                      >
                        <option value="text">📄 Text / Reading</option>
                        <option value="video">▶️ Video</option>
                        <option value="quiz">❓ Quiz</option>
                        <option value="link">🔗 External Link</option>
                      </select>
                      <input
                        type="text"
                        value={lesson.duration}
                        onChange={(e) =>
                          updateLesson(mIdx, lIdx, "duration", e.target.value)
                        }
                        placeholder="Duration (e.g., 10 min)"
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      />
                    </div>

                    {/* Type-specific fields */}
                    {lesson.type === "link" && (
                      <div className="space-y-2">
                        <input
                          type="url"
                          value={lesson.url}
                          onChange={(e) =>
                            updateLesson(mIdx, lIdx, "url", e.target.value)
                          }
                          placeholder="https://example.com/training"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        />
                        <textarea
                          value={lesson.content}
                          onChange={(e) =>
                            updateLesson(mIdx, lIdx, "content", e.target.value)
                          }
                          placeholder="Description of the external training (optional)"
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                        />
                      </div>
                    )}

                    {lesson.type === "video" && (
                      <div className="space-y-2">
                        <input
                          type="url"
                          value={lesson.url}
                          onChange={(e) =>
                            updateLesson(mIdx, lIdx, "url", e.target.value)
                          }
                          placeholder="YouTube or Vimeo URL (optional)"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        />
                        <textarea
                          value={lesson.content}
                          onChange={(e) =>
                            updateLesson(mIdx, lIdx, "content", e.target.value)
                          }
                          placeholder="Video description or transcript..."
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                        />
                      </div>
                    )}

                    {lesson.type === "text" && (
                      <textarea
                        value={lesson.content}
                        onChange={(e) =>
                          updateLesson(mIdx, lIdx, "content", e.target.value)
                        }
                        placeholder="Lesson content — paste or type your training material here..."
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                      />
                    )}

                    {lesson.type === "quiz" && (
                      <textarea
                        value={lesson.content}
                        onChange={(e) =>
                          updateLesson(mIdx, lIdx, "content", e.target.value)
                        }
                        placeholder="Quiz description and questions..."
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                      />
                    )}
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => addLesson(mIdx)}
                  className="text-sm text-teal-600 hover:text-teal-700 font-medium"
                >
                  + Add Lesson
                </button>
              </div>
            </div>
          ))}
        </section>

        {/* Info note */}
        <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-teal-800">
            <span className="font-medium">💡 Demo Note:</span> In the full
            product, you can upload SCORM packages, PDFs, video files, and
            PowerPoint presentations directly to each lesson.
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <Link
            href="/courses"
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            ← Cancel
          </Link>
          <button
            type="button"
            onClick={handleSave}
            disabled={!isValid || saving}
            className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              isValid && !saving
                ? "bg-teal-600 text-white hover:bg-teal-700"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            {saving ? "Saving..." : "Save Course"}
          </button>
        </div>
      </main>
    </div>
  );
}
