import Course from '../models/Course.js';
import { canManageCourse, getModuleFromCourse, serializeCourse } from '../utils/courseUtils.js';
import { parseJsonArray } from '../utils/requestUtils.js';
import { buildUploadedFileUrl } from '../utils/uploadUtils.js';

function normalizeLessons(lessons) {
  if (Array.isArray(lessons)) {
    return lessons.map((lesson) => String(lesson).trim()).filter(Boolean);
  }

  return [];
}

function getNormalizedLessons(rawLessons) {
  return normalizeLessons(rawLessons).length
    ? normalizeLessons(rawLessons)
    : normalizeLessons(parseJsonArray(rawLessons));
}

export async function getCourses(req, res) {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });

    res.status(200).json({
      courses: courses.map(serializeCourse),
    });
  } catch (error) {
    res.status(500).json({ message: 'Unable to fetch courses right now.' });
  }
}

export async function getCourseById(req, res) {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      res.status(404).json({ message: 'Course not found.' });
      return;
    }

    res.status(200).json({ course: serializeCourse(course) });
  } catch (error) {
    res.status(500).json({ message: 'Unable to fetch this course right now.' });
  }
}

export async function createCourse(req, res) {
  try {
    const title = req.body.title?.trim();
    const description = req.body.description?.trim();
    const category = req.body.category?.trim() || 'General';
    const thumbnail =
      req.body.thumbnail?.trim() ||
      'https://placehold.co/800x500/e2e8f0/334155?text=New+Course';

    if (!title || !description) {
      res.status(400).json({ message: 'Course title and description are required.' });
      return;
    }

    const course = await Course.create({
      title,
      description,
      category,
      thumbnail,
      instructor: req.user.role === 'instructor' ? req.user._id : null,
      instructorName: req.user.name,
      featured: false,
      modules: [],
    });

    res.status(201).json({
      message: 'Course created successfully.',
      course: serializeCourse(course),
    });
  } catch (error) {
    res.status(500).json({ message: 'Unable to create course right now.' });
  }
}

export async function updateCourse(req, res) {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      res.status(404).json({ message: 'Course not found.' });
      return;
    }

    if (!canManageCourse(course, req.user)) {
      res.status(403).json({ message: 'You do not have permission to update this course.' });
      return;
    }

    const title = req.body.title?.trim();
    const description = req.body.description?.trim();

    if (!title || !description) {
      res.status(400).json({ message: 'Course title and description are required.' });
      return;
    }

    course.title = title;
    course.description = description;
    course.category = req.body.category?.trim() || course.category;
    course.thumbnail =
      req.body.thumbnail?.trim() ||
      course.thumbnail ||
      'https://placehold.co/800x500/e2e8f0/334155?text=Course';

    await course.save();

    res.status(200).json({
      message: 'Course updated successfully.',
      course: serializeCourse(course),
    });
  } catch (error) {
    res.status(500).json({ message: 'Unable to update course right now.' });
  }
}

export async function addModuleToCourse(req, res) {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      res.status(404).json({ message: 'Course not found.' });
      return;
    }

    if (!canManageCourse(course, req.user)) {
      res.status(403).json({ message: 'You do not have permission to update this course.' });
      return;
    }

    const title = req.body.title?.trim();
    const videoUrl = req.body.videoUrl?.trim();

    if (!title || !videoUrl) {
      res.status(400).json({ message: 'Module title and video URL are required.' });
      return;
    }

    course.modules.push({
      title,
      description: req.body.description?.trim() || '',
      videoUrl,
      pdfUrl: req.body.pdfUrl?.trim() || buildUploadedFileUrl(req, req.file) || '',
      lessons: getNormalizedLessons(req.body.lessons),
    });

    await course.save();

    const updatedCourse = serializeCourse(course);
    const module = updatedCourse.modules[updatedCourse.modules.length - 1];

    res.status(201).json({
      message: 'Module added successfully.',
      course: updatedCourse,
      module,
    });
  } catch (error) {
    res.status(500).json({ message: 'Unable to add module right now.' });
  }
}

export async function updateModuleInCourse(req, res) {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      res.status(404).json({ message: 'Course not found.' });
      return;
    }

    if (!canManageCourse(course, req.user)) {
      res.status(403).json({ message: 'You do not have permission to update this course.' });
      return;
    }

    const module = getModuleFromCourse(course, req.params.moduleId);

    if (!module) {
      res.status(404).json({ message: 'Module not found.' });
      return;
    }

    const title = req.body.title?.trim();
    const videoUrl = req.body.videoUrl?.trim();

    if (!title || !videoUrl) {
      res.status(400).json({ message: 'Module title and video URL are required.' });
      return;
    }

    module.title = title;
    module.description = req.body.description?.trim() || '';
    module.videoUrl = videoUrl;
    module.pdfUrl = req.body.pdfUrl?.trim() || buildUploadedFileUrl(req, req.file) || module.pdfUrl || '';
    module.lessons = getNormalizedLessons(req.body.lessons);

    await course.save();

    const updatedCourse = serializeCourse(course);
    const updatedModule = updatedCourse.modules.find(
      (courseModule) => courseModule.id === req.params.moduleId,
    );

    res.status(200).json({
      message: 'Module updated successfully.',
      course: updatedCourse,
      module: updatedModule,
    });
  } catch (error) {
    res.status(500).json({ message: 'Unable to update module right now.' });
  }
}
