const index = require("./index");
const Token = require("../models/token");
const Target = require("../models/target");
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

describe("JWT", () => {
  it("should repsonse with jwt token", async () => {
    const token = new Token({
      handler: "penguins",
      token: "test-token",
    });

    await token.save();

    const response = await request(app).post("/token").send({
      handler: "penguins",
    });

    expect(response.header["content-type"]).toMatch(/application\/json/);
    expect(response.body).toStrictEqual({ token: "test-token" });
    expect(response.status).toEqual(201);
  });
});

describe("Target", () => {
  it("should get all target names", async () => {
    await Target.insertMany([
      {
        name: "peter",
        style: {
          left: "100",
          top: "100",
        },
      },
      {
        name: "sam",
        style: {
          left: "100",
          top: "100",
        },
      },
      {
        name: "eric",
        style: {
          left: "100",
          top: "100",
        },
      },
    ]);

    const response = await request(app).get("/target/names");

    expect(response.header["content-type"]).toMatch(/application\/json/);
    expect(response.body).toStrictEqual([
      { name: "peter" },
      { name: "sam" },
      { name: "eric" },
    ]);
    expect(response.status).toEqual(200);
  });

  it("should repsonse with check target result", async () => {
    await Target.create({
      name: "peter",
      style: {
        left: "110px",
        top: "280px",
      },
    });

    const postData = {
      selection: "peter",
      position: { top: 281, left: 115 },
      range: { topRange: 65, leftRange: 50 },
    };

    const response = await request(app)
      .post("/target/check")
      .send(postData)
      .set("Content-Type", "application/json");
    expect(response.header["content-type"]).toMatch(/application\/json/);
    expect(response.body).toStrictEqual({
      result: true,
      position: { top: "280px", left: "110px" },
    });
    expect(response.status).toEqual(201);
  });

  it("should create a new target", async () => {
    const target = {
      name: "peter",
      left: "110px",
      top: "280px",
    };

    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiZGl1IiwiaWF0IjoxNjk4OTc0MzI0fQ.75SWzFkblslFGeUHThGlCc1nXJKz-XR2-HIY6i-XmzE";
    const response = await request(app)
      .post("/target/create")
      .set("Content-type", "application/json")
      .send(target)
      .set("Authorization", `Bearer ${token}`);

    expect(response.header["content-type"]).toMatch(/application\/json/);
    expect(response.body.name).toBe("peter");
    expect(response.body.style.left).toBe("110px");
    expect(response.body.style.top).toBe("280px");
    expect(response.status).toEqual(201);
  });
});

describe("Score", () => {
  it("should repsonse with highscore", async () => {
    await Score.insertMany([
      {
        name: "test1",
        time: "00:00:03",
      },
      {
        name: "test2",
        time: "00:00:03",
      },
      {
        name: "test3",
        time: "00:00:03",
      },
      {
        name: "test4",
        time: "00:00:03",
      },
      {
        name: "test5",
        time: "00:00:03",
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
      time: "00:31:31",
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
    expect(response.body.time).toBe("00:31:31");
    expect(response.status).toEqual(201);
  });
});
