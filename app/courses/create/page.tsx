"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import type { Course, Module, Lesson, QuizQuestion } from "@/lib/data";
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
type QuestionType = "multiple-choice" | "true-false" | "multi-select";

interface OptionDraft {
  id: string;
  text: string;
}

interface QuestionDraft {
  id: string;
  text: string;
  type: QuestionType;
  options: OptionDraft[];
  correctIds: string[];
  explanation: string;
}

interface LessonDraft {
  title: string;
  type: LessonType;
  duration: string;
  content: string;
  url: string;
  questions: QuestionDraft[];
  passingScore: number;
}

interface ModuleDraft {
  title: string;
  lessons: LessonDraft[];
}

let optCounter = 0;
function nextOptId() {
  return `opt-${++optCounter}`;
}

function newQuestion(): QuestionDraft {
  const a = nextOptId();
  const b = nextOptId();
  const c = nextOptId();
  const d = nextOptId();
  return {
    id: `q-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
    text: "",
    type: "multiple-choice",
    options: [
      { id: a, text: "" },
      { id: b, text: "" },
      { id: c, text: "" },
      { id: d, text: "" },
    ],
    correctIds: [],
    explanation: "",
  };
}

function newTrueFalse(): QuestionDraft {
  return {
    id: `q-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
    text: "",
    type: "true-false",
    options: [
      { id: "t", text: "True" },
      { id: "f", text: "False" },
    ],
    correctIds: [],
    explanation: "",
  };
}

function newLesson(): LessonDraft {
  return { title: "", type: "text", duration: "5 min", content: "", url: "", questions: [], passingScore: 70 };
}

function newModule(): ModuleDraft {
  return { title: "", lessons: [newLesson()] };
}

function QuizBuilder({
  lesson,
  onChange,
}: {
  lesson: LessonDraft;
  onChange: (l: LessonDraft) => void;
}) {
  const addQuestion = (type: QuestionType) => {
    const q = type === "true-false" ? newTrueFalse() : { ...newQuestion(), type };
    onChange({ ...lesson, questions: [...lesson.questions, q] });
  };

  const updateQuestion = (idx: number, field: string, value: unknown) => {
    onChange({
      ...lesson,
      questions: lesson.questions.map((q, i) =>
        i === idx ? { ...q, [field]: value } : q
      ),
    });
  };

  const removeQuestion = (idx: number) => {
    onChange({
      ...lesson,
      questions: lesson.questions.filter((_, i) => i !== idx),
    });
  };

  const updateOption = (qIdx: number, oIdx: number, text: string) => {
    const q = lesson.questions[qIdx];
    const newOptions = q.options.map((o, i) => (i === oIdx ? { ...o, text } : o));
    updateQuestion(qIdx, "options", newOptions);
  };

  const addOption = (qIdx: number) => {
    const q = lesson.questions[qIdx];
    updateQuestion(qIdx, "options", [
      ...q.options,
      { id: nextOptId(), text: "" },
    ]);
  };

  const removeOption = (qIdx: number, oIdx: number) => {
    const q = lesson.questions[qIdx];
    const removed = q.options[oIdx];
    updateQuestion(qIdx, "options", q.options.filter((_, i) => i !== oIdx));
    if (q.correctIds.includes(removed.id)) {
      updateQuestion(
        qIdx,
        "correctIds",
        q.correctIds.filter((id) => id !== removed.id)
      );
    }
  };

  const toggleCorrect = (qIdx: number, optId: string) => {
    const q = lesson.questions[qIdx];
    const isMulti = q.type === "multi-select";
    let newCorrect: string[];
    if (isMulti) {
      newCorrect = q.correctIds.includes(optId)
        ? q.correctIds.filter((id) => id !== optId)
        : [...q.correctIds, optId];
    } else {
      newCorrect = [optId];
    }
    updateQuestion(qIdx, "correctIds", newCorrect);
  };

  const changeQuestionType = (qIdx: number, newType: QuestionType) => {
    const q = lesson.questions[qIdx];
    if (newType === "true-false") {
      updateQuestion(qIdx, "type", newType);
      updateQuestion(qIdx, "options", [
        { id: "t", text: "True" },
        { id: "f", text: "False" },
      ]);
      updateQuestion(qIdx, "correctIds", []);
    } else {
      if (q.type === "true-false") {
        // switching from T/F to MC/MS — reset options
        const a = nextOptId(), b = nextOptId(), c = nextOptId(), d = nextOptId();
        updateQuestion(qIdx, "options", [
          { id: a, text: "" },
          { id: b, text: "" },
          { id: c, text: "" },
          { id: d, text: "" },
        ]);
        updateQuestion(qIdx, "correctIds", []);
      }
      updateQuestion(qIdx, "type", newType);
    }
  };

  return (
    <div className="space-y-3">
      <textarea
        value={lesson.content}
        onChange={(e) => onChange({ ...lesson, content: e.target.value })}
        placeholder="Quiz description (shown before the quiz starts)..."
        rows={2}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
      />
      <div className="flex items-center gap-3">
        <label className="text-xs text-gray-500 font-medium">
          Passing Score:
        </label>
        <input
          type="number"
          min={0}
          max={100}
          value={lesson.passingScore}
          onChange={(e) =>
            onChange({ ...lesson, passingScore: Number(e.target.value) })
          }
          className="w-20 px-2 py-1 border border-gray-300 rounded text-sm text-center"
        />
        <span className="text-xs text-gray-400">%</span>
      </div>

      {lesson.questions.map((q, qIdx) => (
        <div
          key={q.id}
          className="border border-amber-200 bg-amber-50/50 rounded-lg p-4 space-y-3"
        >
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-amber-600">
              Q{qIdx + 1}
            </span>
            <select
              value={q.type}
              onChange={(e) =>
                changeQuestionType(qIdx, e.target.value as QuestionType)
              }
              className="px-2 py-1 border border-gray-300 rounded text-xs bg-white"
            >
              <option value="multiple-choice">Multiple Choice</option>
              <option value="true-false">True / False</option>
              <option value="multi-select">Multi-Select</option>
            </select>
            <button
              type="button"
              onClick={() => removeQuestion(qIdx)}
              className="ml-auto text-xs text-red-500 hover:text-red-700"
            >
              Remove
            </button>
          </div>
          <input
            type="text"
            value={q.text}
            onChange={(e) => updateQuestion(qIdx, "text", e.target.value)}
            placeholder="Enter your question..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
          <div className="space-y-2">
            <label className="text-xs text-gray-500">
              Options{" "}
              <span className="text-gray-400">
                ({q.type === "multi-select"
                  ? "check all correct"
                  : "select the correct answer"})
              </span>
            </label>
            {q.options.map((opt, oIdx) => (
              <div key={opt.id} className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => toggleCorrect(qIdx, opt.id)}
                  className={`w-5 h-5 rounded-${
                    q.type === "multi-select" ? "sm" : "full"
                  } border-2 flex items-center justify-center shrink-0 transition-colors ${
                    q.correctIds.includes(opt.id)
                      ? "border-green-500 bg-green-500 text-white"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                  title="Mark as correct"
                >
                  {q.correctIds.includes(opt.id) && (
                    <span className="text-xs">✓</span>
                  )}
                </button>
                {q.type === "true-false" ? (
                  <span className="text-sm text-gray-700 flex-1">{opt.text}</span>
                ) : (
                  <input
                    type="text"
                    value={opt.text}
                    onChange={(e) => updateOption(qIdx, oIdx, e.target.value)}
                    placeholder={`Option ${oIdx + 1}`}
                    className="flex-1 px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                )}
                {q.type !== "true-false" && q.options.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removeOption(qIdx, oIdx)}
                    className="text-xs text-gray-400 hover:text-red-500"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            {q.type !== "true-false" && (
              <button
                type="button"
                onClick={() => addOption(qIdx)}
                className="text-xs text-teal-600 hover:text-teal-700"
              >
                + Add Option
              </button>
            )}
          </div>
          <textarea
            value={q.explanation}
            onChange={(e) => updateQuestion(qIdx, "explanation", e.target.value)}
            placeholder="Explanation shown after answering (optional)"
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
          />
        </div>
      ))}

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => addQuestion("multiple-choice")}
          className="text-xs px-3 py-1.5 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 font-medium"
        >
          + Multiple Choice
        </button>
        <button
          type="button"
          onClick={() => addQuestion("true-false")}
          className="text-xs px-3 py-1.5 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 font-medium"
        >
          + True / False
        </button>
        <button
          type="button"
          onClick={() => addQuestion("multi-select")}
          className="text-xs px-3 py-1.5 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 font-medium"
        >
          + Multi-Select
        </button>
      </div>
    </div>
  );
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
                ...(l.type === "quiz" && l.questions.length > 0
                  ? {
                      passingScore: l.passingScore,
                      questions: l.questions
                        .filter((q) => q.text.trim() && q.correctIds.length > 0)
                        .map(
                          (q): QuizQuestion => ({
                            id: q.id,
                            text: q.text.trim(),
                            type: q.type,
                            options: q.options
                              .filter((o) => o.text.trim())
                              .map((o) => ({ id: o.id, text: o.text.trim() })),
                            correctAnswerIds: q.correctIds,
                            ...(q.explanation.trim()
                              ? { explanation: q.explanation.trim() }
                              : {}),
                          })
                        ),
                    }
                  : {}),
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
                      <QuizBuilder
                        lesson={lesson}
                        onChange={(updated) => {
                          setModules((prev) =>
                            prev.map((m, mi) =>
                              mi === mIdx
                                ? {
                                    ...m,
                                    lessons: m.lessons.map((l, li) =>
                                      li === lIdx ? updated : l
                                    ),
                                  }
                                : m
                            )
                          );
                        }}
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
