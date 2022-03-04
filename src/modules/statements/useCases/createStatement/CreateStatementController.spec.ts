import { app } from "app";
import request from "supertest";
import { Connection, createConnection } from "typeorm";

let connection: Connection;

let normalUser: {
  id: string;
  name: string;
  email: string;
  password: string;
};

describe("Create Statement", async () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    const userCreated = await request(app).post("api/v1/users").send({
      name: "Luis Felipe",
      email: "luis@gmail.com",
      password: "password",
    });

    normalUser = {
      id: userCreated.body.id,
      name: userCreated.body.name,
      password: userCreated.body.password,
      email: userCreated.body.email,
    };
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to deposit", async () => {
    const responseToken = await request.post("/api/v1/sessions").send({
      email: normalUser.email,
      password: normalUser.password,
    });

    const { token } = responseToken.body;

    const response = await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: 100,
        description: "100COnto",
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.user_id).toEqual(normalUser.id);
    expect(response.body.amount).toBe(100);
    expect(response.body.type).toEqual("deposit");
  });

  it("should be able to withdraw", async () => {
    const responseToken = await request(app).post("/api/v1/users").send({
      email: normalUser.email,
      password: normalUser.password,
    });

    const { token } = responseToken.body;

    const response = await request(app)
      .post("/api/v1/statements/withdraw")
      .send({
        amount: 100,
        description: "100Conto",
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.normalUser.user_id).toEqual(normalUser.id);
    expect(response.body.amount).toEqual(100);
    expect(response.body.type).toEqual("withdraw");
  });

  it("should not be able to deposit/withdraw with non-existing user", async () => {
    const responseToken = await request(app).post("/api/v1/users").send({
      email: "incorrectUser@gmail.com",
      password: "IncorrectPassword",
    });

    expect(responseToken.status).toBe(401);
    expect(responseToken.body.message).toEqual("Incorrect email or password");
    expect(responseToken.body.token).toEqual(undefined);

    const { token } = responseToken.body;

    const response = await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: 100,
        description: "100Conto",
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(401);
    expect(response.body.message).toEqual("JWT invalid token!");
  });

  it("should not be able to withdraw without money", async () => {
    const responseToken = await request(app).post("/api/v1/users").send({
      email: normalUser.email,
      password: normalUser.password,
    });

    const { token } = responseToken.body;

    const response = await request(app)
      .post("/api/v1/statements/withdraw")
      .send({
        amount: 100,
        description: "100Conto",
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toEqual("Insufficient funds");
  });
});
