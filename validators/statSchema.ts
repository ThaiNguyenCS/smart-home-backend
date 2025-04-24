import Joi from "joi";

export const getStatSchema = Joi.object({
    realEstateId: Joi.string().required(),
    startDate: Joi.date().iso(),
    endDate: Joi.date().iso(),
})