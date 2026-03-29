import { generateToken } from '../utils/generateToken.js';
import User, { USER_ROLES } from '../models/User.js';

function serializeUser(user) {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

export async function registerUser(req, res) {
  try {
    const name = req.body.name?.trim();
    const email = req.body.email?.trim().toLowerCase();
    const password = req.body.password?.trim();
    const role = req.body.role?.trim().toLowerCase();

    if (!name || !email || !password || !role) {
      res.status(400).json({ message: 'Name, email, password, and role are required.' });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ message: 'Password must be at least 6 characters long.' });
      return;
    }

    if (!USER_ROLES.includes(role)) {
      res.status(400).json({ message: 'Please choose a valid role.' });
      return;
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      res.status(409).json({ message: 'An account with this email already exists.' });
      return;
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
    });

    res.status(201).json({
      token: generateToken(user._id.toString()),
      user: serializeUser(user),
    });
  } catch (error) {
    res.status(500).json({ message: 'Unable to register right now.' });
  }
}

export async function loginUser(req, res) {
  try {
    const email = req.body.email?.trim().toLowerCase();
    const password = req.body.password?.trim();

    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required.' });
      return;
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.matchPassword(password))) {
      res.status(401).json({ message: 'Invalid email or password.' });
      return;
    }

    res.status(200).json({
      token: generateToken(user._id.toString()),
      user: serializeUser(user),
    });
  } catch (error) {
    res.status(500).json({ message: 'Unable to log in right now.' });
  }
}

export async function getCurrentUser(req, res) {
  res.status(200).json({ user: serializeUser(req.user) });
}
