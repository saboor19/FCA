const Joi = require("joi");

const {
ACTIVITY_TYPE
} = require("../constants/salesConstants");

exports.createLeadActivitySchema =
Joi.object({

type:Joi.string()
.valid(...ACTIVITY_TYPE)
.required(),

title:Joi.string()
.trim()
.required(),

description:Joi.string()
.allow("")
.optional(),

outcome:Joi.string()
.allow("")
.optional(),

scheduledAt:Joi.date()
.optional(),

completedAt:Joi.date()
.optional(),

metadata:Joi.object()
.optional()

});