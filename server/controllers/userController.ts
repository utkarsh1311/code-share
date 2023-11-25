import User from "../models/User";
import { comparePassword, createJWT, hashPassword } from "../utils/auth";
import ErrorHandler from "../utils/customError";

export const getAllUsers = async (req, res, next) => {
  const allUsers = await User.find({}).populate("snippets", {});
  res.json(allUsers);
};

export const loginUser = async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return next(new ErrorHandler("Username and password required", 400));
  }

  const user = await User.findOne({ username });

  if (!user) {
    return next(new ErrorHandler("Invalid username or password", 400));
  }

  const passwordMatch = await comparePassword(password, user.passwordHash);

  if (!passwordMatch) {
    return next(new ErrorHandler("Invalid username or password", 400));
  }

  const userForToken = {
    id: user.id,
    username: user.username,
  };

  const token = createJWT(userForToken);

  res.status(200).send({ token, username: user.username });
};

export const registerUser = async (req, res, next) => {
  const { name, username, password } = req.body;

  if (!name || !username || !password) {
    return next(new ErrorHandler("Name, username and password required", 400));
  }

  const passwordHash = await hashPassword(password);

  const newUser = new User({
    name,
    username,
    passwordHash,
  });

  const savedUser = await newUser.save();
  res.status(201).json(savedUser);
};

export const getUserById = async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findById(id).populate("snippets", {});
  res.json(user);
};

export const sendFriendRequest = async (req, res, next) => {
  const { username } = req.body;
  const user = req.user;

  if (!username) {
    return next(new ErrorHandler("Username required", 400));
  }

  const friendToAdd = await User.findOne({ username });
  const userToAdd = await User.findOne({ username: user.username });

  if (!friendToAdd || !userToAdd) {
    return next(new ErrorHandler("User not found", 400));
  }

  if (friendToAdd.id === userToAdd.id) {
    return next(new ErrorHandler("Cannot add yourself", 400));
  }

  if (userToAdd.friends.includes(friendToAdd.id)) {
    return next(new ErrorHandler("Already friends", 400));
  }

  if (userToAdd.friendRequests.includes(friendToAdd.id)) {
    return next(new ErrorHandler("Already sent friend request", 400));
  }

  friendToAdd.friendRequests.push(userToAdd.id);
  await friendToAdd.save();
  res.status(200).json({ message: "Friend request sent successfully " });
};

export const acceptFriendRequest = async (req, res, next) => {
  const { username } = req.body;
  const user = req.user;

  if (!username) {
    return next(new ErrorHandler("Username required", 400));
  }

  const friendToAdd = await User.findOne({ username });
  const userToAdd = await User.findOne({ username: user.username });

  if (!friendToAdd || !userToAdd) {
    return next(new ErrorHandler("User not found", 400));
  }

  if (!userToAdd.friendRequests.includes(friendToAdd.id)) {
    return next(new ErrorHandler("No friend request found", 400));
  }

  if (friendToAdd.id === userToAdd.id) {
    return next(new ErrorHandler("Cannot add yourself", 400));
  }

  if (userToAdd.friends.includes(friendToAdd.id)) {
    return next(new ErrorHandler("Already friends", 400));
  }

  userToAdd.friends.push(friendToAdd.id);
  friendToAdd.friends.push(userToAdd.id);
  userToAdd.friendRequests = userToAdd.friendRequests.filter(
    (request) => request.id !== friendToAdd.id
  );

  // userToAdd.markModified("friendRequests");

  await userToAdd.save();
  await friendToAdd.save();
  res.status(200).json({ message: "Friend added successfully " });
};

export const getAllFriends = async (req, res, next) => {
  const user = req.user;
  const friends = await User.find({ username: user.username }).populate(
    "friends",
    {}
  );
  res.json(friends);
};
