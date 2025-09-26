const request = require("supertest");
const app = require("../app");

describe("Authentication", () => {
  it("POST /api/auth/register-user -> 400 (missing data)", async () => {
    const res = await request(app)
      .post("/api/auth/register-user")
      .send({});
    expect(res.statusCode).toBe(400);
  });

  it("POST /api/auth/login -> 400 (missing data)", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({});
    expect(res.statusCode).toBe(400);
  });
});
