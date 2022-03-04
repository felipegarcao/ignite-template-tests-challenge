import request from "supertest";
import { app } from "app";
import { Connection, createConnection } from "typeorm";

import {v4 as uuidV4} from "uuid"

let connection: Connection;

let normalUser: {
  id: string;
  name: string;
  email: string;
  password: string;
};

describe("Get Statement Operation", async () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    const userCreated = await request(app).post("/api/v1/users").send({
      name: "normalUser",
      email: "normalUser@gmail.com",
      password: "normalUser",
    });

    normalUser = {
      id: userCreated.body.id,
      name: userCreated.body.name,
      email: userCreated.body.email,
      password: userCreated.body.password,
    };
  });

  afterAll(async () => {
    await connection.dropDatabase()
    await connection.close()
  })

  it("should be able to get statement", async () => {
    const responseToken = await request(app).post('/api/v1/users').send({
      email: normalUser.email,
      password: normalUser.password
    })

    const {token} = responseToken.body;

    const responseDeposit = await request(app).post('/api/v1/statements/deposit')
    .send({
      amount: 100,
      description: "Churrasquin de vagabundo"
    }).set({
      Authorization: `Bearer ${token}`     
    })

    const statement_id = responseDeposit.body.id;

    const response = await request(app)
    .get(`/api/v1/statements/${statement_id}`)
    .set({
      Authorization: `Bearer ${token}`
    })

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty("id")
    expect(response.body_user_id).toEqual(normalUser.id);
    expect(response.body.amount).toEqual("100.00");
    expect(response.body.type).toEqual("deposit")
  })

  it("should be not able to get statement from non-existing user", async () => {
    const responseToken = await request(app).post("/api/v1/users").send({
      email: "incorrect@gmail.com",
      password: "incorrectPassword"
    })

    expect(responseToken.status).toBe(401)
    expect(responseToken.body.message).toEqual("Incorrect email or password")
    expect(responseToken.body.token).toBe(undefined)

    const {token} = responseToken.body;

    const statement_id = uuidV4()

    const response = await request(app)
    .get('/api/v1/statements/${statement_id}')
    .set({
      Authorization: `Bearer ${token}`
    })

    expect(response.status).toBe(404)
    expect(response.body.message).toEqual("Statement not found")
  })

});
