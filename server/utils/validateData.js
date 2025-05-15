// server/utils/validateData.js
const fs = require("fs");
const path = require("path");

// Load and validate destination data
try {
  console.log("Validating destination data...");
  const rawData = fs.readFileSync(
    path.join(__dirname, "..", "data", "destination.json"),
    "utf8"
  );
  const destinations = JSON.parse(rawData);

  if (!Array.isArray(destinations)) {
    throw new Error("Destination data must be an array");
  }

  console.log(`Found ${destinations.length} destinations`);

  // Sample validation checks
  const requiredFields = ["city", "country", "clues", "fun_fact", "trivia"];

  for (let i = 0; i < destinations.length; i++) {
    const destination = destinations[i];

    // Check required fields
    for (const field of requiredFields) {
      if (!destination[field]) {
        throw new Error(
          `Destination at index ${i} missing required field: ${field}`
        );
      }
    }

    // Check clues array
    if (!Array.isArray(destination.clues) || destination.clues.length === 0) {
      throw new Error(`Destination at index ${i} must have at least one clue`);
    }

    // Check funFacts array
    if (
      !Array.isArray(destination.fun_fact) ||
      destination.fun_fact.length === 0
    ) {
      throw new Error(
        `Destination at index ${i} must have at least one fun fact`
      );
    }
  }

  console.log("✅ Destination data validation successful!");
} catch (error) {
  console.error("❌ Error validating destination data:", error.message);
  process.exit(1);
}
