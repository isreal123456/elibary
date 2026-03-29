import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema(
  {
    assessment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Assessment',
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    studentName: {
      type: String,
      required: true,
      trim: true,
    },
    answers: {
      type: Map,
      of: String,
      default: {},
    },
    uploadedFileName: {
      type: String,
      default: '',
      trim: true,
    },
    uploadedFileUrl: {
      type: String,
      default: '',
      trim: true,
    },
    score: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      default: 0,
    },
    percentage: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      default: 'Completed',
      trim: true,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

submissionSchema.index({ assessment: 1, student: 1 }, { unique: true, sparse: true });

const Submission =
  mongoose.models.Submission || mongoose.model('Submission', submissionSchema);

export default Submission;
