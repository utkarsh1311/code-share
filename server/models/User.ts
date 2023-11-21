import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    min: 3,
    max: 255,
  },
  username: {
    type: String,
    required: true,
    min: 3,
    max: 255,
  },
  passwordHash: {
    type: String,
    required: true,
    min: 8,
    max: 1024,
  },
  friends: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  snippets: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Snippet",
  },
});

userSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject.__v;
    delete returnedObject._id;
    delete returnedObject.passwordHash;
  },
});

const User = mongoose.model("User", userSchema);

export default User;
