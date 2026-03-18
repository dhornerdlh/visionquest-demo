"use client";
import { useState } from "react";
import type { QuizQuestion } from "@/lib/data";

interface QuizPlayerProps {
  questions: QuizQuestion[];
  passingScore?: number;
  onPass?: () => void;
}

type Phase = "taking" | "results";

export default function QuizPlayer({
  questions,
  passingScore = 70,
  onPass,
}: QuizPlayerProps) {
  const [phase, setPhase] = useState<Phase>("taking");
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [checked, setChecked] = useState(false);
  const [results, setResults] = useState<boolean[]>([]);

  const question = questions[currentIdx];
  const isMulti = question?.type === "multi-select";
  const total = questions.length;
  const correctCount = results.filter(Boolean).length;
  const scorePercent = total > 0 ? Math.round((correctCount / total) * 100) : 0;
  const passed = scorePercent >= passingScore;

  const toggleOption = (optionId: string) => {
    if (checked) return;
    setSelected((prev) => {
      const next = new Set(prev);
      if (isMulti) {
        if (next.has(optionId)) next.delete(optionId);
        else next.add(optionId);
      } else {
        next.clear();
        next.add(optionId);
      }
      return next;
    });
  };

  const checkAnswer = () => {
    const correct = question.correctAnswerIds;
    const isCorrect =
      selected.size === correct.length &&
      correct.every((id) => selected.has(id));
    setResults((prev) => [...prev, isCorrect]);
    setChecked(true);
  };

  const nextQuestion = () => {
    if (currentIdx + 1 >= total) {
      setPhase("results");
      // Check if passed and trigger callback
      const finalCorrect = results.filter(Boolean).length;
      const finalPercent = Math.round(((finalCorrect) / total) * 100);
      // results already includes current, so check with the final count
      if (finalPercent >= passingScore && onPass) {
        onPass();
      }
    } else {
      setCurrentIdx((prev) => prev + 1);
      setSelected(new Set());
      setChecked(false);
    }
  };

  // Also check pass on results render (since last result is added before transition)
  const handleRetake = () => {
    setPhase("taking");
    setCurrentIdx(0);
    setSelected(new Set());
    setChecked(false);
    setResults([]);
  };

  const getOptionStyle = (optionId: string) => {
    if (!checked) {
      return selected.has(optionId)
        ? "border-teal-500 bg-teal-50 ring-2 ring-teal-500"
        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50";
    }
    const isCorrect = question.correctAnswerIds.includes(optionId);
    const wasSelected = selected.has(optionId);
    if (isCorrect) return "border-green-500 bg-green-50 ring-2 ring-green-500";
    if (wasSelected && !isCorrect)
      return "border-red-500 bg-red-50 ring-2 ring-red-500";
    return "border-gray-200 opacity-60";
  };

  // Results screen
  if (phase === "results") {
    return (
      <div className="space-y-6">
        {/* Score header */}
        <div
          className={`rounded-xl p-8 text-center ${
            passed
              ? "bg-green-50 border-2 border-green-200"
              : "bg-red-50 border-2 border-red-200"
          }`}
        >
          <div className="text-4xl mb-3">{passed ? "🎉" : "📝"}</div>
          <h3
            className={`text-2xl font-bold mb-1 ${
              passed ? "text-green-800" : "text-red-800"
            }`}
          >
            {passed ? "Quiz Passed!" : "Not Quite — Try Again"}
          </h3>
          <p
            className={`text-lg font-medium ${
              passed ? "text-green-700" : "text-red-700"
            }`}
          >
            Score: {correctCount}/{total} ({scorePercent}%)
          </p>
          <p
            className={`text-sm mt-1 ${
              passed ? "text-green-600" : "text-red-600"
            }`}
          >
            {passed
              ? "Great job! You've met the passing threshold."
              : `You need ${passingScore}% to pass. Review the material and try again.`}
          </p>
          {/* Score bar */}
          <div className="mt-4 max-w-xs mx-auto">
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  passed ? "bg-green-500" : "bg-red-500"
                }`}
                style={{ width: `${scorePercent}%` }}
              />
            </div>
            <div className="flex justify-between text-xs mt-1 text-gray-400">
              <span>0%</span>
              <span>Passing: {passingScore}%</span>
              <span>100%</span>
            </div>
          </div>
        </div>

        {/* Question results list */}
        <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
          {questions.map((q, idx) => (
            <div key={q.id} className="px-5 py-3 flex items-start gap-3">
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                  results[idx]
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {results[idx] ? "✓" : "✕"}
              </span>
              <div>
                <p className="text-sm text-gray-700">{q.text}</p>
                {!results[idx] && q.explanation && (
                  <p className="text-xs text-gray-500 mt-1">
                    {q.explanation}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={handleRetake}
            className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              passed
                ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                : "bg-teal-600 text-white hover:bg-teal-700"
            }`}
          >
            Retake Quiz
          </button>
          {passed && (
            <span className="text-sm text-green-600 font-medium">
              ✓ Lesson marked complete
            </span>
          )}
        </div>
      </div>
    );
  }

  // Taking quiz
  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">
          Question {currentIdx + 1} of {total}
        </span>
        <span className="text-sm text-gray-400">
          {results.filter(Boolean).length} correct so far
        </span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-teal-500 rounded-full transition-all duration-300"
          style={{ width: `${((currentIdx + (checked ? 1 : 0)) / total) * 100}%` }}
        />
      </div>

      {/* Question */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          {question.text}
        </h3>
        {isMulti && (
          <p className="text-xs text-gray-400 mb-3">Select all that apply</p>
        )}
      </div>

      {/* Options */}
      <div className="space-y-3">
        {question.options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => toggleOption(opt.id)}
            disabled={checked}
            className={`w-full text-left px-5 py-3.5 rounded-lg border-2 transition-all flex items-center gap-3 ${getOptionStyle(
              opt.id
            )}`}
          >
            <span
              className={`w-5 h-5 rounded-${
                isMulti ? "sm" : "full"
              } border-2 flex items-center justify-center shrink-0 ${
                checked && question.correctAnswerIds.includes(opt.id)
                  ? "border-green-500 bg-green-500 text-white"
                  : checked && selected.has(opt.id)
                  ? "border-red-500 bg-red-500 text-white"
                  : selected.has(opt.id)
                  ? "border-teal-500 bg-teal-500 text-white"
                  : "border-gray-300"
              }`}
            >
              {checked && question.correctAnswerIds.includes(opt.id) && (
                <span className="text-xs">✓</span>
              )}
              {checked &&
                selected.has(opt.id) &&
                !question.correctAnswerIds.includes(opt.id) && (
                  <span className="text-xs">✕</span>
                )}
              {!checked && selected.has(opt.id) && (
                <span className="text-xs">•</span>
              )}
            </span>
            <span className="text-sm text-gray-700">{opt.text}</span>
          </button>
        ))}
      </div>

      {/* Feedback */}
      {checked && (
        <div
          className={`rounded-lg p-4 ${
            results[results.length - 1]
              ? "bg-green-50 border border-green-200"
              : "bg-red-50 border border-red-200"
          }`}
        >
          <p
            className={`text-sm font-semibold ${
              results[results.length - 1]
                ? "text-green-800"
                : "text-red-800"
            }`}
          >
            {results[results.length - 1] ? "✅ Correct!" : "❌ Incorrect"}
          </p>
          {question.explanation && (
            <p
              className={`text-sm mt-1 ${
                results[results.length - 1]
                  ? "text-green-700"
                  : "text-red-700"
              }`}
            >
              {question.explanation}
            </p>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end">
        {!checked ? (
          <button
            onClick={checkAnswer}
            disabled={selected.size === 0}
            className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              selected.size > 0
                ? "bg-teal-600 text-white hover:bg-teal-700"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            Check Answer
          </button>
        ) : (
          <button
            onClick={nextQuestion}
            className="px-6 py-2.5 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors"
          >
            {currentIdx + 1 >= total ? "See Results" : "Next Question →"}
          </button>
        )}
      </div>
    </div>
  );
}
