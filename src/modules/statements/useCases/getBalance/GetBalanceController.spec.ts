import { Connection, createConnection } from "typeorm";

import request from 'supertest';
import { app } from "app";

let connection: Connection;

let normalUser: {
  id: string;
  name: string;
  password: string;
  email: string;
}

describe("Get Balance Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations()

    const userCreated = await request(app).post('/api/v1/users').send({
      name: "normalUser",
      email: "normalUser@gmail.com",
      password: "normalUser"
    })

    normalUser = {
      name: userCreated.body.name,
      id: userCreated.body.id,
      email: userCreated.body.email,
      password: "normalUser"
    }
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  })

  it ("should be able to get balance",async () => {
    const responseToken = await request(app).post("/api/v1/users").send({
      email: normalUser.email,
      password: normalUser.password
    })

    const {token} = responseToken.body;

    await request(app).post("/api/v1/statements/deposit")
    .send({
      amount: 100,
      description: "100Pila"
    })
    .set({
      Authorization: `Bearer ${token}`
    })

    await request(app).post("/api/v1/statements/withdraw")
    .send({
      amount: 50,
      description: "50Pila"
    })
    .set({
      Authorization: `Bearer ${token}`
    })

    const response = await request(app)
    .get("/api/v1/statements/balance")
    .set({
      Authorization: `Bearer ${token}`
    })


    expect(response.status).toBe(200);
    expect(response.body.statement[0]).toHaveProperty("id");
    expect(response.body.statement[1]).toHaveProperty("id");
    expect(response.body).toHaveProperty("balance")
    expect(response.body.balance).toBe(50)

  })

  it("should not be able to get balance from non-existing users", async () => {
    const responseToken = await request(app).post("/api/v1/users").send({
      email: "incorrect@gmail.com",
      password: "incorrectPassword"
    })

    expect(responseToken.status).toBe(401)
    expect(responseToken.body.message).toEqual("Incorrect email or password")
    expect(responseToken.body.token).toEqual(undefined)

    const {token} = responseToken.body;

    const response = await request(app).get('/api/v1/statements/balance')
    .set({
      Authorization: `Bearer ${token}`
    })

    expect(response.status).toBe(401);
    expect(response.body.message).toEqual("JWT invalid token!")
  })
});
