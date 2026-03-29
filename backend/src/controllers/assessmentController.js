import Assessment from '../models/Assessment.js';
import Course from '../models/Course.js';
import { canManageCourse, getModuleFromCourse } from '../utils/courseUtils.js';
import { parseJsonArray } from '../utils/requestUtils.js';
import { buildUploadedFileUrl } from '../utils/uploadUtils.js';

function serializeAssessment(assessmentDocument) {
  const assessment =
    typeof assessmentDocument.toObject === 'function'
      ? assessmentDocument.toObject()
      : assessmentDocument;

  return {
    id: assessment._id.toString(),
    title: assessment.title,
    description: assessment.description,
    type: assessment.type,
    courseId: assessment.course.toString(),
    moduleId: assessment.moduleId,
    fileUrl: assessment.fileUrl,
    fileName: assessment.fileName,
    dueDate: assessment.dueDate ? new Date(assessment.dueDate).toISOString().slice(0, 10) : '',
    questions: (assessment.questions || []).map((question) => ({
      id: question._id.toString(),
      type: question.type,
      question: question.question,
      options: question.options || [],
      correctAnswer: question.correctAnswer || '',
    })),
    createdByName: assessment.createdByName,
    createdAt: assessment.createdAt,
    updatedAt: assessment.updatedAt,
  };
}

export async function getAssessments(req, res) {
  try {
    const filters = {};

    if (req.query.courseId) {
      filters.course = req.query.courseId;
    }

    if (req.query.moduleId) {
      filters.moduleId = req.query.moduleId;
    }

    const assessments = await Assessment.find(filters).sort({ createdAt: -1 });

    res.status(200).json({
      assessments: assessments.map(serializeAssessment),
    });
  } catch (error) {
    res.status(500).json({ message: 'Unable to fetch assessments right now.' });
  }
}

export async function createAssessment(req, res) {
  try {
    const title = req.body.title?.trim();
    const courseId = req.body.courseId?.trim();
    const moduleId = req.body.moduleId?.trim();

    if (!title || !courseId || !moduleId) {
      res.status(400).json({ message: 'Course, module, and assessment title are required.' });
      return;
    }

    const course = await Course.findById(courseId);

    if (!course) {
      res.status(404).json({ message: 'Course not found.' });
      return;
    }

    if (!canManageCourse(course, req.user)) {
      res.status(403).json({ message: 'You do not have permission to create assessments for this course.' });
      return;
    }

    const module = getModuleFromCourse(course, moduleId);

    if (!module) {
      res.status(404).json({ message: 'Module not found for this course.' });
      return;
    }

    const questionList = Array.isArray(req.body.questionList)
      ? req.body.questionList
      : parseJsonArray(req.body.questionList);
    const uploadedFileUrl = buildUploadedFileUrl(req, req.file);
    const providedFileUrl = req.body.fileUrl?.trim() || '';
    const selectedFileUrl = uploadedFileUrl || providedFileUrl;
    const selectedFileName = req.file?.originalname?.trim() || req.body.fileName?.trim() || '';

    const assessment = await Assessment.create({
      title,
      description: req.body.description?.trim() || '',
      type: req.body.type?.trim() || 'assignment',
      course: course._id,
      moduleId,
      fileUrl: selectedFileUrl,
      fileName: selectedFileName,
      dueDate: req.body.dueDate ? new Date(req.body.dueDate) : null,
      questions: questionList
        .map((question) =>
          typeof question === 'string'
            ? {
                type: 'text',
                question,
                options: [],
                correctAnswer: '',
              }
            : {
                type: question.type || 'text',
                question: question.question,
                options: Array.isArray(question.options)
                  ? question.options.map((option) => String(option).trim()).filter(Boolean)
                  : [],
                correctAnswer: question.correctAnswer || '',
              },
        )
        .filter((question) => question.question),
      createdBy: req.user._id,
      createdByName: req.user.name,
    });

    res.status(201).json({
      message: 'Assessment created successfully.',
      assessment: serializeAssessment(assessment),
    });
  } catch (error) {
    res.status(500).json({ message: 'Unable to create assessment right now.' });
  }
}
