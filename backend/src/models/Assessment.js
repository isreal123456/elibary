import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['mcq', 'text'],
      default: 'text',
    },
    question: {
      type: String,
      required: true,
      trim: true,
    },
    options: {
      type: [String],
      default: [],
    },
    correctAnswer: {
      type: String,
      default: '',
      trim: true,
    },
  },
  {
    timestamps: false,
  },
);

const assessmentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    type: {
      type: String,
      enum: ['assignment', 'quiz', 'exam'],
      default: 'assignment',
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    moduleId: {
      type: String,
      required: true,
      trim: true,
    },
    fileUrl: {
      type: String,
      default: '',
      trim: true,
    },
    fileName: {
      type: String,
      default: '',
      trim: true,
    },
    dueDate: {
      type: Date,
      default: null,
    },
    questions: {
      type: [questionSchema],
      default: [],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    createdByName: {
      type: String,
      default: '',
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

const Assessment =
  mongoose.models.Assessment || mongoose.model('Assessment', assessmentSchema);

export default Assessment;
