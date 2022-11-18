import { Connection, createConnection } from "typeorm";

import request from 'supertest'
import { app } from "app";


let connection: Connection;
describe("Authenticate User", () => {

  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations()
  })

  afterAll(async () => {
    await connection.dropDatabase()
    await connection.close()
  })

  it("Should be able authenticate user existent", async () => {
    await request(app).post("api/v1/users").send({
      email: "felipe@gmail.com",
      name: "name",
      password: "password"
    })

    const response = await request.post("api/v1/users").send({
      email: "felipe@gmail.com",
      password: "password"
    })

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
    expect(response.body).toHaveProperty("id");
  })

  it("Should be able authenticate user non-existent", async () => {

    const response = await request.post("api/v1/users").send({
      email: "felipe@gmail.com",
      password: "password"
    })

    expect(response.status).toBe(400)
    expect(response.body).toEqual({message: "Incorrect email or password"})
  })

})