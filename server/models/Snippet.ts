import mongoose from "mongoose";

const snippetSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
    min: 3,
    max: 255,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  detail: {
    type: String,
    required: true,
    min: 3,
    max: 255,
  },
  label: {
    type: String,
  },
  code: {
    type: String,
    required: true,
  },
});

snippetSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject.__v;
    delete returnedObject._id;
  },
});

const Snippet = mongoose.model("Snippet", snippetSchema);

export default Snippet;
