import Schema from "./schema";

export const User = Schema({
  fields: {
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    posts: Array,
  },
  required: ["email", "firstName"],
  unique: ["email"],
  collection: "User",
});
const user = new User({});
