import { courses } from "@/lib/data";
import CourseViewer from "@/components/CourseViewer";

export function generateStaticParams() {
  return courses.map((c) => ({ id: c.id }));
}

export default function CoursePage() {
  return <CourseViewer />;
}
