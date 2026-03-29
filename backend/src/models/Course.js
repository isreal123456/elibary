import mongoose from 'mongoose';

const moduleSchema = new mongoose.Schema(
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
    videoUrl: {
      type: String,
      default: '',
      trim: true,
    },
    pdfUrl: {
      type: String,
      default: '',
      trim: true,
    },
    lessons: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      default: 'General',
      trim: true,
    },
    thumbnail: {
      type: String,
      default: 'https://placehold.co/800x500/e2e8f0/334155?text=Course',
      trim: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    instructorName: {
      type: String,
      required: true,
      trim: true,
    },
    modules: {
      type: [moduleSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

const Course = mongoose.models.Course || mongoose.model('Course', courseSchema);

export default Course;
