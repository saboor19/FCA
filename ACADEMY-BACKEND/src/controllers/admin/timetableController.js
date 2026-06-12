const Timetable =
require("../../models/Timetable");


//-------------CREATE TIMETABLE SLOT-------------
exports.createTimetable =
async(req,res) => {

  try{
    // CHECK FOR CONFLICTS

const existingConflict =
  await Timetable.findOne({

    dayOfWeek:req.body.dayOfWeek,

    $or:[

      // SAME TEACHER
      {
        teacher:req.body.teacher
      },

      // SAME BATCH
      {
        batch:req.body.batch
      },

      // SAME ROOM
      {
        roomNumber:req.body.roomNumber
      }

    ],

    // TIME OVERLAP CHECK

    startTime:{
      $lt:req.body.endTime
    },

    endTime:{
      $gt:req.body.startTime
    }

  });

if(existingConflict){

  return res.status(400).json({

    success:false,

    message:"Timetable conflict detected"

  });

}

    const timetable =
      await Timetable.create(
        req.body
      );

    res.status(201).json({
      success:true,
      message:"Timetable slot created",
      data:timetable
    });

  }catch(error){

    res.status(500).json({
      success:false,
      message:error.message
    });

  }

};

//-------------BULK CREATE TIMETABLE-------------
exports.createBulkTimetable =
async(req,res) => {

  try{

    const {

      batch,
      course,
      teacher,
      dayOfWeek,
      mode,
      slots

    } = req.body;

    // VALIDATE SLOTS

    if(
      !slots ||
      !Array.isArray(slots) ||
      slots.length === 0
    ){

      return res.status(400).json({

        success:false,

        message:
          "No timetable slots provided"

      });

    }

    // =====================================
    // FRONTEND MAY VALIDATE,
    // BUT BACKEND MUST VALIDATE TOO
    // =====================================

    // CHECK INTERNAL SLOT OVERLAPS

    for(let i=0;i<slots.length;i++){

      for(let j=i+1;j<slots.length;j++){

        const a = slots[i];
        const b = slots[j];

        const overlap =

          a.startTime < b.endTime
          &&
          a.endTime > b.startTime;

        if(overlap){

          return res.status(400).json({

            success:false,

            message:
              `Conflict between ${a.subject} and ${b.subject}`

          });

        }

      }

    }

    // =====================================
    // CHECK DATABASE CONFLICTS
    // =====================================

    for(const slot of slots){

      const existingConflict =
        await Timetable.findOne({

          dayOfWeek,

          $or:[

            {
              teacher
            },

            {
              batch
            },

            {
              roomNumber:
                slot.roomNumber
            }

          ],

          startTime:{
            $lt:slot.endTime
          },

          endTime:{
            $gt:slot.startTime
          }

        });

      if(existingConflict){

        return res.status(400).json({

          success:false,

          message:
            `Database conflict detected for ${slot.subject}`

        });

      }

    }

    // =====================================
    // PREPARE DOCUMENTS
    // =====================================

    const timetableDocuments =
      slots.map((slot) => ({

        batch,
        course,
        teacher,
        dayOfWeek,

        subject:
          slot.subject,

        startTime:
          slot.startTime,

        endTime:
          slot.endTime,

        roomNumber:
          slot.roomNumber || "",

        meetingLink:
          slot.meetingLink || "",

        mode:
          slot.mode || mode || "OFFLINE"

      }));

    // =====================================
    // INSERT MANY
    // =====================================

    const createdTimetables =
      await Timetable.insertMany(
        timetableDocuments
      );

    res.status(201).json({

      success:true,

      message:
        "Timetable created successfully",

      count:
        createdTimetables.length,

      data:
        createdTimetables

    });

  }catch(error){

    res.status(500).json({

      success:false,

      message:error.message

    });

  }

};

//-------------GET ALL TIMETABLES-------------
exports.getTimetables =
async(req,res) => {

  try{

    const timetables =
      await Timetable.find()

      .populate(
        "batch",
        "name"
      )

      .populate(
        "course",
        "title"
      )

      .populate({
        path:"teacher",
        populate:{
          path:"userId",
          select:"fullName"
        }
      })

      .sort({
        dayOfWeek:1,
        startTime:1
      });

    res.status(200).json({
      success:true,
      count:timetables.length,
      data:timetables
    });

  }catch(error){

    res.status(500).json({
      success:false,
      message:error.message
    });

  }

};


//-------------GET SINGLE TIMETABLE-------------
exports.getTimetable =
async(req,res) => {

  try{

    const timetable =
      await Timetable.findById(
        req.params.id
      )

      .populate(
        "batch",
        "name"
      )

      .populate(
        "course",
        "title"
      )

      .populate({
        path:"teacher",
        populate:{
          path:"userId",
          select:"fullName email"
        }
      });

    if(!timetable){

      return res.status(404).json({
        success:false,
        message:"Timetable not found"
      });

    }

    res.status(200).json({
      success:true,
      data:timetable
    });

  }catch(error){

    res.status(500).json({
      success:false,
      message:error.message
    });

  }

};


//-------------UPDATE TIMETABLE-------------
exports.updateTimetable =
async(req,res) => {

  try{

    const timetable =
      await Timetable.findByIdAndUpdate(

        req.params.id,

        req.body,

        {
          new:true,
          runValidators:true
        }

      );

    if(!timetable){

      return res.status(404).json({
        success:false,
        message:"Timetable not found"
      });

    }

    res.status(200).json({
      success:true,
      message:"Timetable updated",
      data:timetable
    });

  }catch(error){

    res.status(500).json({
      success:false,
      message:error.message
    });

  }

};


//-------------DELETE TIMETABLE-------------
exports.deleteTimetable =
async(req,res) => {

  try{

    const timetable =
      await Timetable.findById(
        req.params.id
      );

    if(!timetable){

      return res.status(404).json({
        success:false,
        message:"Timetable not found"
      });

    }

    await timetable.deleteOne();

    res.status(200).json({
      success:true,
      message:"Timetable deleted"
    });

  }catch(error){

    res.status(500).json({
      success:false,
      message:error.message
    });

  }

};