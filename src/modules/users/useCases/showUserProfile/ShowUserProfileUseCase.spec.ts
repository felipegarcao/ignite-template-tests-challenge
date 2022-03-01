import { User } from "@modules/users/entities/User";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";


let showUserProfileUseCase: ShowUserProfileUseCase;
let usersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("show user profile", () => {
  beforeAll(() => {
    usersRepository =  new InMemoryUsersRepository()
    showUserProfileUseCase = new ShowUserProfileUseCase(usersRepository);
    createUserUseCase = new CreateUserUseCase(usersRepository)
  })

  it("should be able to show profile user", async () => {
    const user = await usersRepository.create({
      email: "felipe-mara2003@hotmail.com",
      name: "Luis Felipe",
      password: "senha"
    })

    const users = await showUserProfileUseCase.execute(user.id as string);

    expect(users).toBeInstanceOf(User)
    expect(users).toHaveProperty("id")

  });

  it("should not be able show profile user when user not exists", () => {
    expect(async () => {
      await showUserProfileUseCase.execute('Invalid id')
    }).rejects.toBeInstanceOf(ShowUserProfileError)
  })
})