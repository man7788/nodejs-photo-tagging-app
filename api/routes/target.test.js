const index = require("./index");
const target = require("./target");
const Target = require("../models/target");

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
app.use("/target", target);

describe("Target", () => {
  it("should get all target names", async () => {
    await Target.insertMany([
      {
        name: "peter",
        style: {
          left: 100,
          top: 100,
        },
      },
      {
        name: "sam",
        style: {
          left: 100,
          top: 100,
        },
      },
      {
        name: "eric",
        style: {
          left: 100,
          top: 100,
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
        left: 110,
        top: 280,
      },
    });

    const postData = {
      selection: "peter",
      position: { top: 281, left: 115 },
      range: { topRange: 65, leftRange: 50 },
    };

    const postFailData = {
      selection: "peter",
      position: { top: 1, left: 1 },
      range: { topRange: 65, leftRange: 50 },
    };

    const response = await request(app)
      .post("/target/check")
      .send(postData)
      .set("Content-Type", "application/json");
    expect(response.header["content-type"]).toMatch(/application\/json/);
    expect(response.body).toStrictEqual({
      result: true,
      position: { top: 280, left: 110 },
    });
    expect(response.status).toEqual(201);

    const responseFail = await request(app)
      .post("/target/check")
      .send(postFailData)
      .set("Content-Type", "application/json");
    expect(responseFail.header["content-type"]).toMatch(/application\/json/);
    expect(responseFail.body).toStrictEqual({
      result: false,
    });
    expect(responseFail.status).toEqual(201);
  });

  it("should create a new target", async () => {
    const data = {
      name: "peter",
      top: 280,
      left: 110,
    };

    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiZGl1IiwiaWF0IjoxNjk4OTc0MzI0fQ.75SWzFkblslFGeUHThGlCc1nXJKz-XR2-HIY6i-XmzE";
    const response = await request(app)
      .post("/target/create")
      .set("Content-type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send(data);

    expect(response.header["content-type"]).toMatch(/application\/json/);
    expect(response.body.name).toBe("peter");
    expect(response.body.style.left).toBe(110);
    expect(response.body.style.top).toBe(280);
    expect(response.status).toEqual(201);
  });
});
