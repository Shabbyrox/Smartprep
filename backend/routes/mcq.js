import express from "express";
//import { supabase } from "../supabaseClient.js";

const router = express.Router();

router.get("/questions", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("demo_20")  // updated table name
      .select("*");    // remove limit to get all questions

    if (error) throw error;

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
