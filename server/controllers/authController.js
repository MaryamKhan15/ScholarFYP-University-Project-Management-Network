const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'super_secret_fyp_jwt_key_2026_xyz987', {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, department, rollNo, designation, bio, skills } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists with this email' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || 'student',
      department: department || 'Computer Science',
      rollNo: rollNo || '',
      designation: designation || '',
      bio: bio || '',
      skills: Array.isArray(skills) ? skills : (skills || '').split(',').map((s) => s.trim()).filter(Boolean),
    });

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        rollNo: user.rollNo,
        designation: user.designation,
        skills: user.skills,
        activeProjectId: user.activeProjectId,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    res.json({
      success: true,
      message: 'Login successful',
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        rollNo: user.rollNo,
        designation: user.designation,
        skills: user.skills,
        activeProjectId: user.activeProjectId,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all supervisors
// @route   GET /api/auth/supervisors
// @access  Private
const getSupervisors = async (req, res) => {
  try {
    const supervisors = await User.find({ role: 'supervisor' }).select('name email department designation skills');
    res.json({ success: true, data: supervisors });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const { name, department, rollNo, designation, bio, skills } = req.body;
    if (name) user.name = name;
    if (department) user.department = department;
    if (rollNo !== undefined) user.rollNo = rollNo;
    if (designation !== undefined) user.designation = designation;
    if (bio !== undefined) user.bio = bio;
    if (skills) user.skills = Array.isArray(skills) ? skills : skills.split(',').map((s) => s.trim()).filter(Boolean);

    await user.save();
    res.json({ success: true, message: 'Profile updated successfully', user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  getSupervisors,
  updateProfile,
};
