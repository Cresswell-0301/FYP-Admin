const { Schema, model, models } = require("mongoose");

const AdminSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  hashedPassword: { type: String, required: true },
});

export const Admin = models.Admin || model("Admin", AdminSchema);
