import multiparty from "multiparty";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import fs from "fs";
import mime from "mime-types";
import { mongooseConnect } from "@/lib/mongoose";

const bucketName = "fyp-admin-storage";

export default async function handle(req, res) {
  await mongooseConnect();

  const form = new multiparty.Form();
  const { fields, files } = await new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });

  console.log("length:", files.file.length);

  const client = new S3Client({
    region: "ap-southeast-2",
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    },
  });

  const links = [];
  const filesArray = Array.isArray(files.file) ? files.file : [files.file];
  for (const file of filesArray) {
    const ext = file.originalFilename.split(".").pop();
    const newFilename = Date.now() + "." + ext;

    try {
      await client.send(
        new PutObjectCommand({
          Bucket: bucketName,
          Key: newFilename,
          Body: fs.readFileSync(file.path),
          ContentType: mime.lookup(file.path),
        })
      );

      const link = `https://${bucketName}.s3.ap-southeast-2.amazonaws.com/${newFilename}`;
      links.push(link);
    } catch (error) {
      console.error("Error uploading file to S3:", error);
      return res.status(500).json({ error: "Error uploading file to S3" });
    }
  }

  return res.json({ links });
}

export const config = {
  api: { bodyParser: false },
};
