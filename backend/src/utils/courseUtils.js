export function serializeCourse(courseDocument) {
  const course =
    typeof courseDocument.toObject === 'function'
      ? courseDocument.toObject()
      : courseDocument;

  return {
    id: course._id.toString(),
    title: course.title,
    description: course.description,
    category: course.category,
    thumbnail: course.thumbnail,
    featured: Boolean(course.featured),
    instructor: course.instructorName,
    instructorId: course.instructor ? course.instructor.toString() : null,
    modules: (course.modules || []).map((module) => ({
      id: module._id.toString(),
      title: module.title,
      description: module.description,
      videoUrl: module.videoUrl,
      pdfUrl: module.pdfUrl,
      lessons: module.lessons || [],
    })),
    createdAt: course.createdAt,
    updatedAt: course.updatedAt,
  };
}

export function canManageCourse(course, user) {
  if (!course || !user) {
    return false;
  }

  if (user.role === 'admin') {
    return true;
  }

  const instructorId = course.instructor ? course.instructor.toString() : '';

  if (instructorId && instructorId === user._id.toString()) {
    return true;
  }

  return Boolean(course.instructorName && course.instructorName === user.name);
}

export function getModuleFromCourse(course, moduleId) {
  return (course.modules || []).find((module) => module._id.toString() === moduleId);
}
