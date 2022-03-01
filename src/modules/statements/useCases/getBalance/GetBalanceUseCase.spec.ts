import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { IStatementsRepository } from "@modules/statements/repositories/IStatementsRepository";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "@modules/users/useCases/createUser/CreateUserUseCase";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let getBalanceUseCase: GetBalanceUseCase;
let statementsRepository: InMemoryStatementsRepository;
let usersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase

describe("Get Balance", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    statementsRepository = new InMemoryStatementsRepository();
    getBalanceUseCase = new GetBalanceUseCase(
      statementsRepository,
      usersRepository
    );
    createUserUseCase = new CreateUserUseCase(usersRepository)
  });

  it("should be able get balance to user ", async () => {
    const user = await createUserUseCase.execute({
      email: "user@example.com",
      name: "user",
      password: "password"
    })

    const response = await getBalanceUseCase.execute({user_id: user.id!})

    expect(response).toHaveProperty("statement")
    expect(response).toHaveProperty("balance")
  })
});
