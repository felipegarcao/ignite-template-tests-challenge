import { CreateUserUseCase } from "./CreateUserUseCase";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";

let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("Create User", () => {
  beforeEach(() => {
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    inMemoryUsersRepository = new InMemoryUsersRepository();
  });

  it("should be able to create a new user", async () => {
    const user = {
      name: "name user",
      email: "email user",
      password: "password user",
    };

    const createdUser = await createUserUseCase.execute({
      name: user.name,
      email: user.email,
      password: user.password,
    });

    expect(createdUser).toHaveProperty("id");
    expect(createdUser).toBe(201)
  });

  it("should not be able to create new user with name exists", () => {
    expect(async () => {

      await createUserUseCase.execute({
        name: "luis felipe",
        email: "felipe@gmail.com",
        password: "senha2"
      });

      await createUserUseCase.execute({
        name: "luis felipe 2",
        email: "felipe@gmail.com",
        password: "senha2"
      });
    }).rejects.toBeInstanceOf(CreateUserError);
  });
});
