import Assessment from '../models/Assessment.js';
import Course from '../models/Course.js';
import Resource from '../models/Resource.js';
import { initialAssessments, initialCourses, initialResources } from '../data/initialContent.js';

export async function seedAppData() {
  const coursesCount = await Course.countDocuments();
  const resourcesCount = await Resource.countDocuments();
  const assessmentsCount = await Assessment.countDocuments();

  if (coursesCount === 0) {
    await Course.insertMany(initialCourses);
    console.log(`Seeded ${initialCourses.length} starter course(s).`);
  }

  if (resourcesCount === 0) {
    await Resource.insertMany(initialResources);
    console.log(`Seeded ${initialResources.length} starter resource(s).`);
  }

  if (assessmentsCount === 0) {
    const courses = await Course.find();
    const nextAssessments = initialAssessments
      .map((assessment) => {
        const course = courses.find((item) => item.title === assessment.courseTitle);

        if (!course) {
          return null;
        }

        const matchingModule = (course.modules || []).find(
          (item) => item.title === assessment.moduleTitle,
        );

        if (!matchingModule) {
          return null;
        }

        return {
          title: assessment.title,
          description: assessment.description,
          type: assessment.type,
          course: course._id,
          moduleId: matchingModule._id.toString(),
          fileUrl: assessment.fileUrl,
          fileName: assessment.fileName,
          createdByName: assessment.createdByName,
          questions: assessment.questions,
        };
      })
      .filter(Boolean);

    if (nextAssessments.length) {
      await Assessment.insertMany(nextAssessments);
      console.log(`Seeded ${nextAssessments.length} starter assessment(s).`);
    }
  }
}
