const request = require("supertest");
const app = require("../app");

describe("Auth API", () => {
  it("should register a new user", async () => {
    const res = await request(app).post("/api/auth/signup").send({
      email: "test@example.com",
      password: "password123",
    });

    console.log(res.body);
    console.log(res.statusCode);

    expect(res.statusCode).toBe(201);

    // expect(res.body).toHaveProperty("token");
  });
});

it("should not allow duplicate email registration", async () => {
  await request(app).post("/api/auth/signup").send({
    email: "duplicate@example.com",
    password: "password123",
  });
  const res = await request(app).post("/api/auth/signup").send({
    email: "duplicate@example.com",
    password: "password456",
  });
  expect(res.statusCode).toBe(409);
  expect(res.body).toHaveProperty("message", "Email already in use");
  //expect(res.body.error).toBe("Email already in use");
});

it("should reject invalid password", async () => {
  await request(app)
    .post("/api/auth/signup")
    .send({ email: "wrongpass@example.com", password: "password123" });
  const res = await request(app)
    .post("/api/auth/login")
    .send({ email: "wrongpass@example.com", password: "wrongpass" });
  expect(res.statusCode).toBe(401);
  expect(res.body.message).toBe("Invalid email or password");
});

it("should reject non-existent email", async () => {
  const res = await request(app)
    .post("/api/auth/login")
    .send({ email: "nouser@example.com", password: "password123" });
  expect(res.statusCode).toBe(401);
  expect(res.body.message).toBe("Invalid email or password");
});

it("should reject request without token", async () => {
  const res = await request(app).get("/api/tasks");
  expect(res.statusCode).toBe(401);
});

it("should prevent normal user from accessing admin route", async () => {
  await request(app)
    .post("/api/auth/signup")
    .send({ email: "user@example.com", password: "password123" });
  const res = await request(app)
    .post("/api/auth/login")
    .send({ email: "user@example.com", password: "password123" });

  const token = res.body.accessToken;
  console.log(token);

  const adminRes = await request(app)
    .get("/api/tasks/admin-only-route")
    .set("Authorization", `Bearer ${token}`);
  console.log("admin response", adminRes.body);
  expect(adminRes.statusCode).toBe(403);
});
