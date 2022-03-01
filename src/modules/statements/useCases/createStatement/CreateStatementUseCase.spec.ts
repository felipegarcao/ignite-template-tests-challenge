import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "@modules/users/useCases/createUser/CreateUserUseCase";
import { CreateStatementUseCase } from "./CreateStatementUseCase";
import { ICreateStatementDTO } from "./ICreateStatementDTO";

let createStatementUseCase: CreateStatementUseCase;
let usersRepository: InMemoryUsersRepository;
let statementsRepository: InMemoryStatementsRepository;
let createUserUseCase: CreateUserUseCase;

describe("create Statement", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    statementsRepository = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(
      usersRepository,
      statementsRepository
    );
    createUserUseCase = new CreateUserUseCase(usersRepository)
  });

  it("Should be able possible to make a deposit",async () => {

    const user = await createUserUseCase.execute({
      name: "user test",
      email: "user@example.com",
      password: "password"
    })

    const statement = {
      user_id: user.id,
      type: "deposit",
      amount: 100,
      description: "description"
    } as ICreateStatementDTO

    const response = await createStatementUseCase.execute(statement)

    expect(response).toHaveProperty("id")

  })
});
