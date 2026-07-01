const Joi = require("joi");

const {
    ACTIVITY_TYPE,
    LEAD_STATUS,
    LEAD_PRIORITY,
    LEAD_SOURCE,
    TASK_STATUS,
    TASK_PRIORITY
} = require("../../constants/salesConstants");

exports.createLeadActivitySchema =
    Joi.object({

        type: Joi.string()
            .valid(ACTIVITY_TYPE)
            .required(),

        title: Joi.string()
            .trim()
            .required(),

        description: Joi.string()
            .allow("")
            .optional(),

        outcome: Joi.string()
            .allow("")
            .optional(),

        scheduledAt: Joi.date()
            .optional(),

        completedAt: Joi.date()
            .optional(),

        metadata: Joi.object()
            .optional()

    }).min(1);

exports.updateLeadActivitySchema =
    Joi.object({

        type: Joi.string()
            .valid(ACTIVITY_TYPE),

        title: Joi.string()
            .trim(),

        description: Joi.string()
            .allow(""),

        outcome: Joi.string()
            .allow(""),

        scheduledAt: Joi.date(),

        completedAt: Joi.date(),

        metadata: Joi.object(),

        isVisible: Joi.boolean()

    }).min(1);

exports.createLeadTaskSchema = Joi.object({

    title: Joi.string()
        .trim()
        .required(),

    description: Joi.string()
        .allow("")
        .default(""),

    priority: Joi.string()
        .valid(...TASK_PRIORITY)
        .default("MEDIUM"),

    assignedTo: Joi.string()
        .required(),

    dueDate: Joi.date()
        .required(),

    remarks: Joi.string()
        .allow("")
});

exports.updateLeadTaskSchema = Joi.object({

    title: Joi.string()
        .trim(),

    description: Joi.string()
        .allow(""),

    priority: Joi.string()
        .valid(...TASK_PRIORITY),

    status: Joi.string()
        .valid(...TASK_STATUS),

    assignedTo: Joi.string(),

    dueDate: Joi.date(),

    completedAt: Joi.date(),

    remarks: Joi.string()
        .allow("")
});