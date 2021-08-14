const { validationResult, param, query, body } = require('express-validator');
const validator = require('validator');

const RawData = require('../models/rawdata');
const phoneValidator = require('../utils/phone');

exports.handleValidation = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
        return res.status(422).json({
            status: false,
            message: 'Validation error',
            errors: errors.array(),
        });
    next();
};

exports.checkFileUpload = (req, res, next) => {
    if (!req.file)
        return res.status(422).json({ status: true, message: 'File not found' });

    next();
};

exports.validateExcel = (data) => {
    const { header, value } = data;

    switch (header.toLowerCase()) {
        case 'name':
            if (validator.isEmpty(value)) return 'Name is empty';

            break;

        case 'email':
            if (!validator.isEmail(value)) return 'Email is invalid';
            break;

        case 'phone':
            if (!phoneValidator(value)) return 'Phone is invalid';
            break;

        case 'gender':
            if (value.toLowerCase() !== 'male' && value.toLowerCase() !== 'female')
                return 'Gender is invalid';

            break;

        case 'nid':
            if (
                !validator.isLength(value, { min: 16, max: 16 }) ||
                !validator.isNumeric(value)
            )
                return 'NID is invalid. Must be 16 numeric characters';

            break;

        default:
            break;
    }
};

exports.checkGetData = [
    param('id', 'File id is required')
        .notEmpty()
        .bail()
        .isString()
        .bail()
        .trim()
        .custom(async (value) => {
            const data = await RawData.findOne({ where: { name: value } });
            if (!data) return Promise.reject('File not found');

            return true;
        }),
    query('limit', 'Limit is invalid')
        .optional({ checkFalsy: true, nullable: true })
        .bail()
        .isInt()
        .bail()
        .toInt(),
    query('page', 'Page is invalid')
        .optional({ checkFalsy: true, nullable: true })
        .bail()
        .isInt()
        .bail()
        .toInt(),
];

exports.checkCommitData = [
    body('id', 'File Id is required')
        .notEmpty()
        .bail()
        .isString()
        .bail()
        .trim()
        .custom(async (value) => {
            const data = await RawData.findOne({ where: { name: value } });
            if (!data) return Promise.reject('File not found');

            return true;
        }),
    body('action', 'Action is required')
        .notEmpty()
        .bail()
        .isString()
        .bail()
        .trim()
        .toLowerCase()
        .isIn(['yes', 'no']),
];
