const User = require('../models/user');

const { hashPassword, comparePassword } = require('../utils/bcrypt');
const { signToken } = require('../utils/jwt');

exports.postSignUp = async (req, res) => {
    const { username, password } = req.body;

    const user = await User.create({
        username: username,
        password: hashPassword(password),
    });

    const token = signToken({
        id: user.id,
        fname: user.username,
    });

    user.password = undefined;

    return res.status(201).json({
        status: true,
        message: 'User signed up',
        type: 'Bearer',
        token: token,
        data: user,
    });
};

exports.postSignIn = async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({ where: { username: username } });
    if (!user || !comparePassword(password, user.password))
        return res.status(401).json({
            status: false,
            message: 'Username or password incorrect',
        });

    const token = signToken({
        id: user.id,
        fname: user.username,
    });

    return res.status(200).json({
        status: true,
        message: 'User signed in',
        type: 'Bearer',
        token: token,
    });
};
