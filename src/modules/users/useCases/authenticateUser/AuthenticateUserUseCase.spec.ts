import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "../createUser/CreateUserError";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";

let usersRepositoryInMemory: InMemoryUsersRepository;
let authenticatedUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;

describe("Authenticate User", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    authenticatedUserUseCase = new AuthenticateUserUseCase(
      usersRepositoryInMemory
    );
    createUserUseCase: new CreateUserUseCase(usersRepositoryInMemory)
  });

  it("should be able to Authenticate an user", async () => {
    const user: ICreateUserDTO = {
      name: "name",
      password: "password",
      email: "felipe-mara2003@hotmail.com"
    };

    await createUserUseCase.execute(user);

    const result = await authenticatedUserUseCase.execute({
      email: user.email,
      password: user.password
    })
    
    expect(result).toHaveProperty("token")
  });

  it("should not be able to authenticate with incorrect password", async () => {
    expect(async () => {
      const user: ICreateUserDTO = {
        name: "name fake",
        password: "password fake",
        email: "email-fake@hotmail.com"
      }

      await createUserUseCase.execute(user)

      await authenticatedUserUseCase.execute({
        email: user.email,
        password: "testedomalandros"
      })
    }).rejects.toBeInstanceOf(CreateUserError);
  })
});
