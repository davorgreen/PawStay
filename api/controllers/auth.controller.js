import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import { createError } from '../utils/error.js';
import jwt, { decode } from 'jsonwebtoken';

export const register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (!emailRegex.test(email)) {
            return next(createError(400, 'Invalid email format'));
        }

        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return next(createError(400, 'A user with that email or username already exists.'))
        }

        const passwordRegex = /^[A-Z](?=.*\d)[A-Za-z0-9]{7,}$/;
        if (!passwordRegex.test(password)) {
            return next(createError(400, 'Password must be at least 8 characters long, start with an uppercase letter, and contain at least one number.'))
        }

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);

        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hash,
        });

        await newUser.save();
        res.status(201).send('User has been created.');
    } catch (err) {
        next(err);
    }
};

export const login = async (req, res, next) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (!user) return next(createError(404, 'User not found!'));

        const isPasswordCorrect = await bcrypt.compare(
            req.body.password,
            user.password
        );
        if (!isPasswordCorrect)
            return next(createError(400, 'Wrong password or username!'));

        const token = jwt.sign(
            { id: user._id, isAdmin: user.isAdmin },
            process.env.JWT,
            { expiresIn: '1h' }
        );

        const { password, isAdmin, ...otherDetails } = user._doc;
        res
            .cookie('access_token', token, {
                httpOnly: true,
                maxAge: 60 * 60 * 1000
            })
            .status(200)
            .json({ details: { ...otherDetails }, isAdmin });
    } catch (err) {
        next(err);
    }
};

export const logout = (req, res) => {
    res.clearCookie('access_token', {
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
    });
    res.status(200).json({ message: 'Logged out successfully' });
};


export const getUser = (req, res, next) => {
    const token = req.cookies.access_token;
    if (!token) return next(createError(401, 'Not authenticated'));

    jwt.verify(token, process.env.JWT, (err, decoded) => {
        if (err) return next(createError(403, 'Token is invalid'));
        const { id, isAdmin } = decoded;
        User.findById(id)
            .then(user => {
                if (!user) return next(createError(404, 'User not found'));
                const { password, ...userWithoutPassword } = user._doc;
                res.status(200).json({ user: userWithoutPassword, isAdmin });
            })
            .catch(err => {
                next(createError(500, 'Error fetching user'))
            })
    })
}