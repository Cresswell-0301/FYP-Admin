import { mongooseConnect } from "@/lib/mongoose";
import { Slide } from "@/models/Slide";

export default async function handler(req, res) {
  const { method } = req;
  await mongooseConnect();

  if (method === 'GET') {
    try {
      const slides = await Slide.find();
      res.json(slides);
    } catch (error) {
      console.error("Error fetching slides:", error);
      res.status(500).json({ error: "Error fetching slides" });
    }
  }

  if (method === 'POST') {
    const slides = req.body;
    try {
      const createdSlide = await Slide.create({ slides });
      res.json(createdSlide);
      console.log(createdSlide);
    } catch (error) {
      console.error("Error creating slide:", error);
      res.status(500).json({ error: "Error creating slide" });
    }
  }

  if (method === 'PUT') {
    const slides = req.body;
    try {
      await Slide.deleteMany({}); 
      const createdSlides = await Slide.create({ slides });
      res.json(createdSlides);
      console.log(createdSlides);
    } catch (error) {
      console.error("Error updating slides:", error);
      res.status(500).json({ error: "Error updating slides" });
    }
  }

  if (method === 'DELETE') {
    try {
      if (req.query?.id) {
        await Slide.deleteOne({ _id: req.query?.id });
        res.json(true);
      } else {
        res.status(400).json({ error: "Slide ID not provided" });
      }
    } catch (error) {
      console.error("Error deleting slide:", error);
      res.status(500).json({ error: "Error deleting slide" });
    }
  }
}
