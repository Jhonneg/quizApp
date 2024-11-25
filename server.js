const express = require("express");
const cors = require("cors");
const path = require("path");
const morgan = require("morgan");
const axios = require("axios");

const app = express();

const PORT = process.env.PORT || 3000;
const PANTRY_ID = process.env.PANTRY_KEY;

const PANTRY_API_BASE_URL = `https://getpantry.cloud/apiv1/pantry/${PANTRY_ID}/basket`;

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use(express.static("public"));

app.get("/:basketName", async (req, res) => {
  const { basketName } = req.params;
  try {
    const response = await axios.get(`${PANTRY_API_BASE_URL}/${basketName}`);
    res.json(await response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/:basketName", async (req, res) => {
  const { basketName } = req.params;
  const newData = req.body;
  try {
    const response = await axios.post(
      `${PANTRY_API_BASE_URL}/${basketName}`,
      newData
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(error.message);
  }
});

app.put("/:basketName", async (req, res) => {
  const { basketName } = req.params;
  const newData = req.body;
  try {
    const response = await axios.put(
      `${PANTRY_API_BASE_URL}/${basketName}`,
      newData
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/:basketName", async (req, res) => {
  const { basketName } = req.params;
  const newData = req.body;
  try {
    const response = await axios.delete(
      `${PANTRY_API_BASE_URL}/${basketName}`,
      newData
    );
    res.json({ message: `Basket ${basketName} cleared sucessfuly.` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});
