import { Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/User'
import { AuthRequest } from '../middleware/auth'

const generateToken = (userId: string): string => {
    return jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: '7d' })
}

export const register = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        const user = new User({ name, email, password });
        await user.save();

        const token = generateToken(user._id.toString());

        const { password: pwd, ...userResponse } = user.toObject();

        return res.status(201).json({
            success: true,
            token,
            user: userResponse
        });
    } catch (error) {
        next(error);
        return;  // <--- add this return here
    }
    return;  // <--- fallback return to satisfy TS
};


export const login = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        user.lastActivity = new Date();
        await user.save();

        const token = generateToken(user._id.toString());

        const { password: pwd, ...userResponse } = user.toObject();

        return res.json({
            success: true,
            token,
            user: userResponse
        });
    } catch (error) {
        next(error);
        return;  // <--- add return here
    }
    return;  // <--- fallback return
};

export const getProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const user = await User.findById(req.user!._id).select('-password')
        res.json(user)
    } catch (error) {
        next(error)
    }
}

export const updateProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { name, email, currentLanguage } = req.body

        const user = await User.findByIdAndUpdate(
            req.user!._id,
            { name, email, currentLanguage },
            { new: true, runValidators: true }
        ).select('-password')

        res.json(user)
    } catch (error) {
        next(error)
    }
}

export const changePassword = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { currentPassword, newPassword } = req.body;

        const user = await User.findById(req.user!._id).select('+password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isCurrentPasswordValid = await user.comparePassword(currentPassword);
        if (!isCurrentPasswordValid) {
            return res.status(400).json({ message: 'Current password is incorrect' });
        }

        user.password = newPassword;
        await user.save();

        return res.json({ message: 'Password updated successfully' });
    } catch (error) {
        next(error);
        return;  // <--- add return here
    }
    return;  // <--- fallback return
};