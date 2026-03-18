"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import { courses as hardcodedCourses } from "@/lib/data";
import { getAllCourses } from "@/lib/courseStorage";
import type { Course } from "@/lib/data";

export default function Dashboard() {
  const [allCourses, setAllCourses] = useState<Course[]>(hardcodedCourses);

  useEffect(() => {
    setAllCourses(getAllCourses());
  }, []);

  const totalLessons = allCourses.reduce((sum, c) => sum + c.lessons, 0);
  const categoryCount = new Set(allCourses.map((c) => c.category)).size;

  const stats = [
    { label: "Available Courses", value: allCourses.length, icon: "📚" },
    { label: "Total Lessons", value: totalLessons, icon: "📖" },
    { label: "Categories", value: categoryCount, icon: "🏷️" },
    { label: "Avg Duration", value: "48 min", icon: "⏱️" },
  ];

  const getCourseHref = (course: Course) =>
    course.isCustom ? `/courses/view?id=${course.id}` : `/courses/${course.id}`;

  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome to VisionQuest
          </h1>
          <p className="mt-2 text-gray-600">
            Your learning management platform. Browse courses and start building
            new skills today.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm"
            >
              <div className="text-2xl mb-2">{stat.icon}</div>
              <div className="text-2xl font-bold text-gray-900">
                {stat.value}
              </div>
              <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Featured Courses</h2>
          <Link
            href="/courses"
            className="text-sm font-medium text-teal-600 hover:text-teal-700"
          >
            View all courses →
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {allCourses.slice(0, 3).map((course) => (
            <Link
              key={course.id}
              href={getCourseHref(course)}
              className="group bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-teal-300 transition-all overflow-hidden"
            >
              <div className="h-36 bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center">
                <span className="text-5xl">{course.thumbnail}</span>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-block px-2 py-0.5 text-xs font-medium bg-teal-50 text-teal-700 rounded-full">
                    {course.category}
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
                <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
                  <span>{course.duration}</span>
                  <span>{course.lessons} lessons</span>
                  <span>{course.level}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
