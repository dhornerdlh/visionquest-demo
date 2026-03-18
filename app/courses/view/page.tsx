"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import CourseViewer from "@/components/CourseViewer";
import { getCourseById } from "@/lib/courseStorage";

function ViewContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  if (!id) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <p className="text-gray-400 text-lg">No course ID specified.</p>
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

  const course = getCourseById(id);

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

  return <CourseViewer course={course} />;
}

export default function ViewCoursePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen">
          <Header />
          <div className="max-w-7xl mx-auto px-4 py-16 text-center">
            <p className="text-gray-400">Loading course...</p>
          </div>
        </div>
      }
    >
      <ViewContent />
    </Suspense>
  );
}
