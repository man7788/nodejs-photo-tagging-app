const index = require("./index");
const score = require("./score");
const Score = require("../models/score");

const { connectDB, dropDB, dropCollections } = require("../setuptestdb");

const request = require("supertest");
const express = require("express");
const app = express();

beforeAll(async () => {
  await connectDB();
});

afterAll(async () => {
  await dropDB();
});

afterEach(async () => {
  await dropCollections();
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/", index);
app.use("/score", score);

describe("Score", () => {
  it("should repsonse with highscore", async () => {
    await Score.insertMany([
      {
        name: "test1",
        time: 3,
      },
      {
        name: "test2",
        time: 3,
      },
      {
        name: "test3",
        time: 3,
      },
      {
        name: "test4",
        time: 3,
      },
      {
        name: "test5",
        time: 3,
      },
    ]);

    const response = await request(app).get("/highscore");

    expect(response.header["content-type"]).toMatch(/application\/json/);
    expect(response.body).toHaveLength(5);
    expect(response.status).toEqual(200);
  });

  it("should create a new highscore", async () => {
    const score = {
      name: "moron",
      time: 360,
    };

    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiZGl1IiwiaWF0IjoxNjk4OTc0MzI0fQ.75SWzFkblslFGeUHThGlCc1nXJKz-XR2-HIY6i-XmzE";
    const response = await request(app)
      .post("/score/create")
      .set("Content-type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send(score);

    expect(response.header["content-type"]).toMatch(/application\/json/);
    expect(response.body._id).toBeDefined();
    expect(response.body.name).toBe("moron");
    expect(response.body.time).toBe(360);
    expect(response.status).toEqual(201);
  });
});
