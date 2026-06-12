const Joi = require("joi");


// Create Course Validation
const createCourseValidation = Joi.object({

  title: Joi.string()
    .min(3)
    .max(100)
    .required(),

  description: Joi.string()
    .min(10)
    .required(),

  duration: Joi.string()
    .required(),

  level: Joi.string()
    .valid(
      "BEGINNER",
      "INTERMEDIATE",
      "ADVANCED"
    )
    .required(),

  price: Joi.number()
    .min(0)
    .required(),

    modules: Joi.array().items(

  Joi.object({

    title:Joi.string()
      .required(),

    code:Joi.string()
      .allow(""),

    description:Joi.string()
      .allow(""),

    duration:Joi.string()
      .allow(""),

    order:Joi.number()

  })

).default([])

});


// ---------------------Update Course Validation
const updateCourseValidation = Joi.object({

  title: Joi.string()
    .min(3)
    .max(100),

  description: Joi.string()
    .min(10),

  duration: Joi.string(),

  level: Joi.string()
    .valid(
      "BEGINNER",
      "INTERMEDIATE",
      "ADVANCED"
    ),

  price: Joi.number()
    .min(0),

  // ---------------- MODULES ----------------

  modules: Joi.array().items(

    Joi.object({

      _id:Joi.string().optional(),

      title:Joi.string()
        .required(),

      code:Joi.string()
        .allow(""),

      description:Joi.string()
        .allow(""),

      duration:Joi.string()
        .allow(""),

      order:Joi.number()

    })

  )

});

module.exports = {
  createCourseValidation,
  updateCourseValidation
};