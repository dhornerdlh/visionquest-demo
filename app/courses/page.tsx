"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import { courses as hardcodedCourses, categories as defaultCategories } from "@/lib/data";
import { getAllCourses, deleteCustomCourse } from "@/lib/courseStorage";
import type { Course } from "@/lib/data";

export default function CoursesPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [allCourses, setAllCourses] = useState<Course[]>(hardcodedCourses);

  useEffect(() => {
    setAllCourses(getAllCourses());
  }, []);

  const categories = [...new Set(allCourses.map((c) => c.category))];

  const filtered = allCourses.filter((c) => {
    const matchesSearch =
      !search ||
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "All" || c.category === category;
    return matchesSearch && matchesCategory;
  });

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm("Delete this course?")) {
      deleteCustomCourse(id);
      setAllCourses(getAllCourses());
    }
  };

  const getCourseHref = (course: Course) =>
    course.isCustom ? `/courses/view?id=${course.id}` : `/courses/${course.id}`;

  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Course Catalog</h1>
            <p className="text-gray-600 mt-1">
              {filtered.length} course{filtered.length !== 1 ? "s" : ""}{" "}
              available
            </p>
          </div>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Search courses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent w-64"
            />
            <Link
              href="/courses/create"
              className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors whitespace-nowrap"
            >
              + Create Course
            </Link>
          </div>
        </div>

        {/* Category filters */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {["All", ...categories].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                category === cat
                  ? "bg-teal-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Course grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((course) => (
            <Link
              key={course.id}
              href={getCourseHref(course)}
              className="group bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-teal-300 transition-all overflow-hidden relative"
            >
              <div className="h-36 bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center relative">
                <span className="text-5xl">{course.thumbnail}</span>
                {course.isCustom && (
                  <button
                    onClick={(e) => handleDelete(course.id, e)}
                    className="absolute top-2 right-2 w-7 h-7 bg-black/30 hover:bg-red-500 rounded-full flex items-center justify-center text-white text-xs transition-colors"
                    title="Delete course"
                  >
                    ✕
                  </button>
                )}
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-block px-2 py-0.5 text-xs font-medium bg-teal-50 text-teal-700 rounded-full">
                    {course.category}
                  </span>
                  <span className="inline-block px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                    {course.level}
                  </span>
                  {course.isCustom && (
                    <span className="inline-block px-2 py-0.5 text-xs font-medium bg-purple-100 text-purple-700 rounded-full">
                      Custom
                    </span>
                  )}
                </div>
                <h3 className="font-semibold text-gray-900 group-hover:text-teal-700 transition-colors">
                  {course.title}
                </h3>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                  {course.description}
                </p>
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span>{course.duration}</span>
                    <span>{course.lessons} lessons</span>
                  </div>
                  <span className="text-xs font-medium text-teal-600 group-hover:text-teal-700">
                    Start →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg">
              No courses found matching your criteria.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
