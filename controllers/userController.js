

import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';




export const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: 'User already exists' });

    const user = await User.create({ username, email, password });
    const jwtToken = generateToken(user._id);

    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token: jwtToken
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    const isMatch = user && (await user.matchPassword(password));

    if (!isMatch) {
      return res.status(401).json({ message: 'Username or password do not match' });
    }

    const jwtToken = generateToken(user._id);
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token: jwtToken
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const getUserProfile = async (req, res) => {
  const user = req.user;
  res.json({
    _id: user._id,
    username: user.username,
    email: user.email
  });
};
