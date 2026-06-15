const Batch = require("../../models/Batch");



const validateTeacherAssignment =
async({
  teacherId,
  batchId,
  moduleId
}) => {

  // FIND BATCH
  const batch =
    await Batch.findById(batchId)
    .populate("course");



  if(!batch){

    throw new Error(
      "Batch not found"
    );

  }



  // CHECK MODULE EXISTS
  const moduleExists =
    batch.course.modules.id(
      moduleId
    );



  if(!moduleExists){

    throw new Error(
      "Module not found in course"
    );

  }



  // CHECK TEACHER ASSIGNMENT
  const teacherAssignment =
    batch.teacherAssignments.find(
      (assignment) => {

        const isTeacher =
          assignment.teacher.toString()
          === teacherId.toString();



        const hasModule =
          assignment.modules.some(
            (module) =>
              module.toString()
              === moduleId.toString()
          );



        return (
          isTeacher &&
          hasModule
        );

      }
    );



  if(!teacherAssignment){

    throw new Error(
      "Teacher is not assigned to this module"
    );

  }



  return {
    batch,
    module:moduleExists
  };

};



module.exports =
validateTeacherAssignment;