const { validationResult, body } = require('express-validator');

const User = require('../models/user');

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

exports.checkSignUp = [
    body('username', 'Username is required')
        .notEmpty()
        .bail()
        .isString()
        .bail()
        .trim()
        .escape()
        .custom(async (value) => {
            const user = await User.findOne({ where: { username: value } });
            if (user) return Promise.reject('Username found');

            return true;
        }),
    body('password', 'Password is required')
        .notEmpty()
        .bail()
        .isString()
        .bail()
        .trim()
        .isLength({ min: 5 })
        .withMessage('Password must be at least 5 characters'),
];

exports.checkSignIn = [
    body('username', 'Username is required')
        .notEmpty()
        .bail()
        .isString()
        .bail()
        .trim()
        .escape(),
    body('password', 'Password is required')
        .notEmpty()
        .bail()
        .isString()
        .bail()
        .trim()
        .isLength({ min: 5 })
        .withMessage('Password must be at least 5 characters'),
];
