import { mongooseConnect } from "@/lib/mongoose";
import { Admin } from "@/models/Admin";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  try {
    await mongooseConnect();

    if (req.method === "POST") {
      const { username, email, password } = req.body;

      if (!username || !email || !password) {
        return res
          .status(400)
          .json({ error: "Username, email, and password are required" });
      }

      const existingAdmin = await Admin.findOne({ email });
      if (existingAdmin) {
        return res
          .status(409)
          .json({ error: "Admin with this email already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newAdmin = new Admin({
        username,
        email,
        hashedPassword,
      });

      await newAdmin.save();

      return res.status(201).json({ message: "Admin added successfully" });
    }

    if (req.method === "GET") {
      const admins = await Admin.find();
      return res.status(200).json(admins);
    }

    if (req.method === "PUT") {
      const { email, newPassword } = req.body;
      if (!email || !newPassword) {
        return res
          .status(400)
          .json({ error: "Email and newPassword are required" });
      }

      try {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const admin = await Admin.findOneAndUpdate(
          { email },
          { $set: { hashedPassword: hashedPassword } },
          { new: true }
        );
        if (!admin) return res.status(404).json({ error: "Admin not found" });

        return res
          .status(200)
          .json({ message: "Password updated successfully" });
      } catch (error) {
        console.error("Error updating password:", error);
        return res.status(500).json({ error: "Internal Server Error" });
      }
    }

    if (req.method === "DELETE") {
      const { email } = req.query;
      if (!email) return res.status(400).json({ error: "Email is required" });

      const admin = await Admin.findOneAndDelete({ email });
      if (!admin) return res.status(404).json({ error: "Admin not found" });

      return res.status(200).json({ message: "Admin deleted successfully" });
    }

    return res.status(405).json({ error: "Method Not Allowed" });
  } catch (error) {
    console.error("Error in API route:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
