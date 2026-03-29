import { createSingleFileUpload } from '../utils/uploadUtils.js';

export const uploadModulePdf = createSingleFileUpload({
  folderName: 'modules',
  allowedExtensions: ['.pdf'],
  fieldName: 'pdfFile',
});

export const uploadAssessmentAttachment = createSingleFileUpload({
  folderName: 'assessments',
  allowedExtensions: ['.pdf'],
  fieldName: 'attachmentFile',
});

export const uploadSubmissionFile = createSingleFileUpload({
  folderName: 'submissions',
  allowedExtensions: ['.pdf', '.doc', '.docx', '.txt'],
  fieldName: 'submissionFile',
});
