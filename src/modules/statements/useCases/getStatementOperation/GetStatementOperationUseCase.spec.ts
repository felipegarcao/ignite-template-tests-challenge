import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "@modules/users/useCases/createUser/CreateUserUseCase";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { ICreateStatementDTO } from "../createStatement/ICreateStatementDTO";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let usersRepository: InMemoryUsersRepository;
let statementsRepository: InMemoryStatementsRepository;
let createUserUseCase: CreateUserUseCase;
let createStatement: CreateStatementUseCase;
let getStatementOperationUseCase: GetStatementOperationUseCase;

describe("Get Statement Operations", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepository);
    statementsRepository = new InMemoryStatementsRepository();
    createStatement = new CreateStatementUseCase(
      usersRepository,
      statementsRepository
    );
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      usersRepository,
      statementsRepository
    );
  });

  it ("Should be able to get Operation",async () => {
    const user = await createUserUseCase.execute({
      email: "felix@gmail.com",
      name: "name",
      password: "password"
    })

    const operation = {
      user_id: user.id,
      type: "deposit",
      description: "description",
      amount: 1000
    } as ICreateStatementDTO

    const statement = await createStatement.execute(operation)

    const response = await getStatementOperationUseCase.execute({
      user_id: user.id!,
      statement_id: statement.id!
    })


    expect(response).toHaveProperty("id");
    expect(response.user_id).toEqual(statement.user_id)
  })
});
