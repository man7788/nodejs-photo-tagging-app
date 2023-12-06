const index = require("./index");
const Token = require("../models/token");

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
  it.only("should repsonse with jwt token", async () => {
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
