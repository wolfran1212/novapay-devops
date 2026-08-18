const request = require("supertest");
const app = require("../src/app");

describe("NovaPay API", () => {
  test("GET / debe responder correctamente", async () => {
    const response = await request(app).get("/");

    expect(response.statusCode).toBe(200);
    expect(response.body.application).toBe("NovaPay API");
  });

  test("GET /test debe responder OK", async () => {
    const response = await request(app).get("/test");

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("OK");
  });
});
