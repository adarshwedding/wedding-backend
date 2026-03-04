import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

export default async function handler(req, res) {

  const folder = req.query.folder;

  if (!folder) {
    return res.status(400).json({ error: "Folder is required" });
  }

  try {

    const result = await cloudinary.search
      .expression(`folder="${folder}"`)
      .sort_by("created_at", "desc")
      .max_results(100)
      .execute();

    const urls = result.resources.map(r => r.secure_url);

    res.status(200).json(urls);

  } catch (error) {
    res.status(500).json({ error: "Failed to fetch images" });
  }
}
