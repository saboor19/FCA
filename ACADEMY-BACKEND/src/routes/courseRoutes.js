const express = require("express");


// -----------------------validation 
const validate = require("../middlewares/validateMiddleware");
const { createCourseValidation ,updateCourseValidation} = require("../validations/courseValidation");


//-------------controller imports----------
const { createCourse, getAllCourses,getSingleCourse,
    updateCourse,deleteCourse
} = require("../controllers/courseController");

const { protect, authorizeRoles } = require("../middlewares/authMiddleware");

const router = express.Router();



//---------------------------------ALL COURSE FETCH
router.get("/", getAllCourses);

//-----------------------------SINGLE COURSE FETCH WITH ID
router.get("/:id",getSingleCourse);

// -----------------------------------UPDATE COURSE (ID)
router.put("/:id",protect,authorizeRoles("ADMIN"),validate(updateCourseValidation),updateCourse);

//------------------------------------DELETE COURSE (ID)
router.delete("/:id",protect,authorizeRoles("ADMIN"),deleteCourse);

// ------------------------------------ADMIN ONLY
router.post( "/create", protect, authorizeRoles("ADMIN"), validate(createCourseValidation), createCourse);




module.exports = router;