import { USER_ROLES } from '../models/User.js';
import User from '../models/User.js';

function serializeUser(user) {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export async function getUsers(req, res) {
  try {
    const users = await User.find().sort({ createdAt: -1 });

    res.status(200).json({
      users: users.map(serializeUser),
    });
  } catch (error) {
    res.status(500).json({ message: 'Unable to fetch users right now.' });
  }
}

export async function getUserById(req, res) {
  try {
    const requestedUser = await User.findById(req.params.id);

    if (!requestedUser) {
      res.status(404).json({ message: 'User not found.' });
      return;
    }

    const canViewUser =
      req.user.role === 'admin' || req.user._id.toString() === requestedUser._id.toString();

    if (!canViewUser) {
      res.status(403).json({ message: 'You do not have permission to view this user.' });
      return;
    }

    res.status(200).json({ user: serializeUser(requestedUser) });
  } catch (error) {
    res.status(500).json({ message: 'Unable to fetch this user right now.' });
  }
}

export async function updateUserRole(req, res) {
  try {
    const nextRole = req.body.role?.trim().toLowerCase();
    const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();

    if (!nextRole || !USER_ROLES.includes(nextRole)) {
      res.status(400).json({ message: 'Please provide a valid role.' });
      return;
    }

    if (req.user._id.toString() === req.params.id) {
      res.status(400).json({ message: 'You cannot change your own role.' });
      return;
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(404).json({ message: 'User not found.' });
      return;
    }

    if (adminEmail && user.email === adminEmail) {
      res.status(400).json({ message: 'The configured admin account role cannot be changed.' });
      return;
    }

    user.role = nextRole;
    await user.save();

    res.status(200).json({
      message: 'User role updated successfully.',
      user: serializeUser(user),
    });
  } catch (error) {
    res.status(500).json({ message: 'Unable to update user role right now.' });
  }
}
