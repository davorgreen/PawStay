import User from "../models/User.js";

//update
export const updateUser = async (req, res, next) => {
    try {
        const { email, username } = req.body;
        const userId = req.params.id;

        const currentUser = await User.findById(userId)
        if (!currentUser) {
            return res.status(400).json({ message: 'User not found.' })
        }

        if (email && email !== currentUser.email) {
            const existingEmail = await User.findOne({ email });
            if (existingEmail && existingEmail._id.toString() !== userId) {
                return res.status(400).json({ message: 'Email is already in use!' });
            }
        }

        if (username && username !== currentUser.username) {
            const existingUsernameUser = await User.findOne({ username });
            if (existingUsernameUser && existingUsernameUser._id.toString() !== userId) {
                return res.status(400).json({ message: 'Username is already in use.' });
            }
        }
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: req.body },
            { new: true }
        );
        res.status(200).json(updatedUser);
    } catch (err) {
        next(err);
    }
}

//delete
export const deleteUser = async (req, res, next) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json("User has been deleted.");
    } catch (err) {
        next(err);
    }
}

//getUser
export const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        res.status(200).json(user);
    } catch (err) {
        next(err);
    }
}

//getUsers
export const getUsers = async (req, res, next) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (err) {
        next(err);
    }
}
