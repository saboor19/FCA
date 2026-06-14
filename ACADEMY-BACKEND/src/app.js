const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");

// const testRoutes= require("./routes/testRoutes")


//------------ protected ROUTE IMPORTS----------------
const authRoutes = require("./routes/authRoutes");
const courseRoutes = require("./routes/admin/courseRoutes");
const studentRoutes = require("./routes/admin/studentRoutes");
const batchRoutes = require("./routes/admin/batchRoutes")
const enrollmentRoutes = require("./routes/admin/enrollmentRoutes")
const attendanceRoutes = require("./routes/admin/attendanceRoutes");
const adminTeacherRoutes = require("./routes/admin/teacherRoutes")
const noticeRoutes = require("./routes/admin/noticeRoutes")
const teacherRoutes = require("./routes/teacher/batchRoutes")
const feeRoutes = require("./routes/admin/feeRoutes");
const financeRoutes=require("./routes/admin/financeRoutes")



//-----------------public route imports------------------
const publicCourseRoutes = require("./routes/courseRoutes");


//------------ERROR HANDLER---------
const errorHandler = require("./middlewares/errorMiddleware");


const app = express();

app.use(helmet());
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());


const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});

app.use(limiter);



//----------------API'S--------------------------------
// app.use("/api/test", testRoutes);

//------HOME---------------
app.get("/", (req, res) => {res.json({message: "Academy API Running" });});

//-------------AUTH ROUTES---------------
app.use("/api/auth", authRoutes);


//---------------public routes----------------
app.use("/api/courses", publicCourseRoutes);


//---------------- admin routes
app.use("/api/admin/courses", courseRoutes);
app.use( "/api/admin/students", studentRoutes );
app.use( "/api/batches",batchRoutes );
app.use("/api/enrollments",enrollmentRoutes);
app.use( "/api/admin/attendance", attendanceRoutes);
app.use("/api/teachers/",adminTeacherRoutes)
app.use( "/api/admin/notices", require("./routes/admin/noticeRoutes") );
app.use( "/api/admin/timetables", require("./routes/admin/timetableRoutes"));
app.use( "/api/admin/fees", feeRoutes );
app.use("/api/admin/finance",financeRoutes);

//----------------TEACHER ROUTES------------
app.use( "/api/teacher/batches", require("./routes/teacher/batchRoutes"));
app.use( "/api/teacher/timetable", require("./routes/teacher/timetableRoutes"));
app.use( "/api/teacher/attendance", require("./routes/teacher/attendanceRoutes"));
app.use( "/api/teacher/students", require("./routes/teacher/studentRoutes"));
app.use( "/api/teacher/notices", require("./routes/teacher/noticeRoutes") );
//----error middleware 
app.use(errorHandler);


module.exports = app;