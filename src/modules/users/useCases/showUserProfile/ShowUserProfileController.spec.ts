import {app} from 'app'
import { hash } from 'bcryptjs';
import { Connection, createConnection } from 'typeorm';
import {v4 as uuidV4} from 'uuid'

let connection: Connection;
describe("Show user profile Controller", () => {

  beforeAll(async () => {
    connection = await createConnection()
    await connection.runMigrations()

    const id = uuidV4()
    const password = hash("admin", 8)

    await connection.query(
      `INSERT INTO USERS(id, name, email, password, created_at, updated_at) VALUES
        value()
      `
    )
  })

})