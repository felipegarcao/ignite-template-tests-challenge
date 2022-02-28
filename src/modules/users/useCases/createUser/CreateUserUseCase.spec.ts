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
  });

  it("should not be able to create new user with name exists", () => {
    expect(async () => {
      const user = {
        name: "name user",
        email: "email user",
        password: "password user",
      };

      await createUserUseCase.execute({
        name: user.name,
        email: user.email,
        password: user.password,
      });

      await createUserUseCase.execute({
        name: user.name,
        email: user.email,
        password: user.password,
      });
    }).rejects.toBeInstanceOf(CreateUserError);
  });
});
