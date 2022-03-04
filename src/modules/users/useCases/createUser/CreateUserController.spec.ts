import { Connection } from "typeorm";
import createConnection from "../../../../database";
import request from "supertest";
import { app } from "app";

let connection: Connection;
describe("Create User Controllers", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to create a new user", async () => {
    const response = await request(app).post("api/v1/users").send({
      name: "Luis Felipe",
      email: "felipe@gmail.com",
      password: "password",
    });

    expect(response.status).toBe(201);
  });

  it("should not be able to create a new user with email exists", async () => {
    await request(app).post("api/v1/users").send({
      name: "Luis Felipe",
      email: "felipeteste@gmail.com",
      password: "123456",
    });

    const response = await request(app).post("api/v1/users").send({
      name: "Luis Felipe",
      email: "felipeteste@gmail.com",
      password: "123456",
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "User Already Exists" });
  });
});
