const express = require("express");
const cors = require("cors");
const path = require("path");
const morgan = require("morgan");

const app = express();

const PORT = process.env.PORT || 3000;
const PANTRY_ID = process.env.PANTRY_ID;

const PANTRY_API_BASE_URL = `https://getpantry.cloud/apiv1/pantry/${PANTRY_ID}/basket`;

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/:basketName", async (req, res) => {
  const { basketName } = req.params;
  try {
    const response = await fetch(`${PANTRY_API_BASE_URL}/${basketName}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});
