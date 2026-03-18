import { courses as hardcodedCourses, type Course } from "./data";

const STORAGE_KEY = "vq-custom-courses";

export function getCustomCourses(): Course[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCustomCourse(course: Course): void {
  if (typeof window === "undefined") return;
  try {
    const existing = getCustomCourses();
    const idx = existing.findIndex((c) => c.id === course.id);
    if (idx >= 0) {
      existing[idx] = course;
    } else {
      existing.push(course);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
  } catch {
    // localStorage full or unavailable
  }
}

export function deleteCustomCourse(id: string): void {
  if (typeof window === "undefined") return;
  try {
    const existing = getCustomCourses().filter((c) => c.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
  } catch {
    // ignore
  }
}

export function getAllCourses(): Course[] {
  return [...hardcodedCourses, ...getCustomCourses()];
}

export function getCourseById(id: string): Course | undefined {
  return (
    hardcodedCourses.find((c) => c.id === id) ??
    getCustomCourses().find((c) => c.id === id)
  );
}

export function generateCourseId(title: string): string {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 30);
  const suffix = Math.random().toString(36).slice(2, 6);
  return `${slug || "course"}-${suffix}`;
}
