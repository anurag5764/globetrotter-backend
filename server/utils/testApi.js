// server/utils/testApi.js
const axios = require("axios");

const API_URL = "http://localhost:3001/api";

// Test health endpoint
async function testHealth() {
  try {
    console.log("Testing health endpoint...");
    const response = await axios.get(`${API_URL}/health`);
    console.log("✅ Health endpoint response:", response.data);
    return true;
  } catch (error) {
    console.error("❌ Health endpoint error:", error.message);
    return false;
  }
}

// Test random destination endpoint
async function testRandomDestination() {
  try {
    console.log("Testing random destination endpoint...");
    const response = await axios.get(`${API_URL}/destinations/random`);
    console.log("✅ Random destination endpoint successful!");
    console.log("Sample clue:", response.data.clues[0]);
    console.log("Number of options:", response.data.options.length);
    return response.data;
  } catch (error) {
    console.error("❌ Random destination endpoint error:", error.message);
    return null;
  }
}

// Test verify answer endpoint
async function testVerifyAnswer(id, answer) {
  try {
    console.log(
      `Testing verify answer endpoint with id ${id} and answer "${answer}"...`
    );
    const response = await axios.post(`${API_URL}/destinations/verify`, {
      id,
      answer,
    });
    console.log("✅ Verify answer endpoint successful!");
    console.log("Correct:", response.data.correct);
    console.log("Destination name:", response.data.destination.city);
    return true;
  } catch (error) {
    console.error("❌ Verify answer endpoint error:", error.message);
    return false;
  }
}

// Test user score endpoints
async function testUserScore() {
  const testUser = {
    username: "testuser",
    score: { correct: 5, incorrect: 2, total: 7 },
  };

  try {
    console.log(
      `Testing user score endpoint for user "${testUser.username}"...`
    );

    // Save score
    const saveResponse = await axios.post(`${API_URL}/users/score`, testUser);
    console.log("✅ Save user score endpoint successful!");

    // Get score
    const getResponse = await axios.get(
      `${API_URL}/users/score/${testUser.username}`
    );
    console.log("✅ Get user score endpoint successful!");
    console.log("User score:", getResponse.data.user.score);

    return true;
  } catch (error) {
    console.error("❌ User score endpoint error:", error.message);
    return false;
  }
}

// Run all tests
async function runTests() {
  console.log("Running API tests...");

  const healthOk = await testHealth();
  if (!healthOk) return;

  const randomDestination = await testRandomDestination();
  if (!randomDestination) return;

  // Test with a random destination from the first call
  const id = randomDestination.id;
  const correctAnswer = (
    await axios.post(`${API_URL}/destinations/verify`, {
      id,
      answer: "placeholder",
    })
  ).data.destination.city;
  const wrongAnswer = "Definitely not a real place";

  await testVerifyAnswer(id, correctAnswer);
  await testVerifyAnswer(id, wrongAnswer);

  await testUserScore();

  console.log("✅ All tests completed!");
}

// Run tests
runTests().catch((error) => {
  console.error("❌ Unexpected error during tests:", error.message);
});
