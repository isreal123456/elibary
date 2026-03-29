import Assessment from '../models/Assessment.js';
import Course from '../models/Course.js';
import Submission from '../models/Submission.js';
import { parseJsonObject } from '../utils/requestUtils.js';
import { buildUploadedFileUrl } from '../utils/uploadUtils.js';

function serializeSubmission(submissionDocument) {
  const submission =
    typeof submissionDocument.toObject === 'function'
      ? submissionDocument.toObject()
      : submissionDocument;

  return {
    id: submission._id.toString(),
    assessmentId:
      typeof submission.assessment === 'object'
        ? submission.assessment._id.toString()
        : submission.assessment.toString(),
    studentId:
      submission.student && typeof submission.student === 'object'
        ? submission.student._id.toString()
        : submission.student
          ? submission.student.toString()
          : null,
    studentName: submission.studentName,
    answers: submission.answers || {},
    uploadedFileName: submission.uploadedFileName,
    uploadedFileUrl: submission.uploadedFileUrl,
    score: submission.score,
    total: submission.total,
    percentage: submission.percentage,
    status: submission.status,
    submittedAt: submission.submittedAt,
    assessmentTitle:
      typeof submission.assessment === 'object' ? submission.assessment.title : undefined,
  };
}

export async function getVisibleSubmissions(req, res) {
  try {
    let submissions = [];

    if (req.user.role === 'admin') {
      submissions = await Submission.find()
        .populate('assessment', 'title course')
        .sort({ submittedAt: -1 });
    } else if (req.user.role === 'instructor') {
      const ownedCourses = await Course.find({
        $or: [{ instructor: req.user._id }, { instructorName: req.user.name }],
      }).select('_id');

      const courseIds = ownedCourses.map((course) => course._id);
      const ownedAssessments = await Assessment.find({ course: { $in: courseIds } }).select('_id');
      const assessmentIds = ownedAssessments.map((assessment) => assessment._id);

      submissions = await Submission.find({ assessment: { $in: assessmentIds } })
        .populate('assessment', 'title course')
        .sort({ submittedAt: -1 });
    } else {
      submissions = await Submission.find({ student: req.user._id })
        .populate('assessment', 'title course')
        .sort({ submittedAt: -1 });
    }

    res.status(200).json({
      submissions: submissions.map(serializeSubmission),
    });
  } catch (error) {
    res.status(500).json({ message: 'Unable to fetch submissions right now.' });
  }
}

export async function createOrUpdateSubmission(req, res) {
  try {
    if (req.user.role !== 'student') {
      res.status(403).json({ message: 'Only students can submit assessments.' });
      return;
    }

    const assessment = await Assessment.findById(req.params.id);

    if (!assessment) {
      res.status(404).json({ message: 'Assessment not found.' });
      return;
    }

    const answers = parseJsonObject(req.body.answers);
    const uploadedFileName = req.file?.originalname?.trim() || req.body.uploadedFileName?.trim() || '';
    const uploadedFileUrl = buildUploadedFileUrl(req, req.file);
    const total = assessment.questions.length;
    const score = assessment.questions.reduce((currentScore, question) => {
      if (!question.correctAnswer) {
        return currentScore;
      }

      return answers[question._id.toString()] === question.correctAnswer
        ? currentScore + 1
        : currentScore;
    }, 0);

    const nextSubmissionData = {
      answers,
      uploadedFileName,
      uploadedFileUrl,
      score,
      total,
      percentage: total ? Math.round((score / total) * 100) : 0,
      status: 'Completed',
      submittedAt: new Date(),
      studentName: req.user.name,
    };

    let submission = await Submission.findOne({
      assessment: assessment._id,
      student: req.user._id,
    });

    if (submission) {
      Object.assign(submission, nextSubmissionData);
      await submission.save();
    } else {
      submission = await Submission.create({
        assessment: assessment._id,
        student: req.user._id,
        ...nextSubmissionData,
      });
    }

    const hydratedSubmission = await Submission.findById(submission._id).populate(
      'assessment',
      'title course',
    );

    res.status(201).json({
      message: 'Assessment submitted successfully.',
      submission: serializeSubmission(hydratedSubmission),
    });
  } catch (error) {
    res.status(500).json({ message: 'Unable to submit assessment right now.' });
  }
}
