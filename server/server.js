const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();
const app = express();

// Use environment variable for CORS origin
const corsOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",")
  : ["http://localhost:3000", "https://globetrotter-client-one.vercel.app"];

app.use(
  cors({
    origin: corsOrigins,
  })
);
app.use(express.json());
app.use(morgan("dev"));

const destinations = JSON.parse(
  fs.readFileSync(path.join(__dirname, "data", "destination.json"), "utf8")
);

let users = {};

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Globetrotter API is running!" });
});

app.get("/api/destinations/random", (req, res) => {
  const randomIndex = Math.floor(Math.random() * destinations.length);
  const destination = destinations[randomIndex];
  const { fun_fact, ...destinationClues } = destination;
  const allDestinationCities = destinations.map((d) => d.city);
  const options = getRandomOptions(allDestinationCities, destination.city, 4);
  res.json({
    id: randomIndex,
    ...destinationClues,
    options,
  });
});

app.post("/api/destinations/verify", (req, res) => {
  const { id, answer } = req.body;
  if (id === undefined || answer === undefined) {
    return res.status(400).json({ error: "Missing id or answer" });
  }
  const destination = destinations[id];
  const isCorrect = destination.city.toLowerCase() === answer.toLowerCase();
  res.json({
    correct: isCorrect,
    destination: destination,
  });
});

app.post("/api/users/score", (req, res) => {
  const { username, score } = req.body;
  if (!username || !score) {
    return res.status(400).json({ error: "Missing username or score" });
  }
  if (!users[username]) {
    users[username] = {
      id: uuidv4(),
      username,
      score,
      createdAt: new Date(),
    };
  } else {
    users[username].score = score;
    users[username].updatedAt = new Date();
  }
  res.json({ success: true, user: users[username] });
});

app.get("/api/users/score/:username", (req, res) => {
  const { username } = req.params;
  if (!users[username]) {
    return res.status(404).json({ error: "User not found" });
  }
  res.json({ user: users[username] });
});

function getRandomOptions(allOptions, correctAnswer, count) {
  let options = [correctAnswer];
  const filteredOptions = allOptions.filter(
    (option) => option !== correctAnswer
  );
  while (options.length < count && filteredOptions.length > 0) {
    const randomIndex = Math.floor(Math.random() * filteredOptions.length);
    options.push(filteredOptions.splice(randomIndex, 1)[0]);
  }
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }
  return options;
}

// Log routes for debugging
app.use((req, res, next) => {
  if (!req.app._router) {
    console.log("Router not initialized yet");
  } else {
    req.app._router.stack.forEach((r) => {
      if (r.route && r.route.path) {
        console.log(`Route: ${r.route.path}`);
      }
    });
  }
  next();
});

// Use environment variable for PORT
const PORT = process.env.PORT || 3001;

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../client/build", "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
