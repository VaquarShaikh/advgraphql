// import sum from "./sum";
import { describe, expect, test } from "@jest/globals";
import { startServer } from "..";
import { request } from "graphql-request";
import { host } from "./constants";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";

const email = "abc@bob.com";
const password = "abcd1234";

const mutation = `
mutation{
  register(email: "${email}" , password:"${password}")
}
`;

test("Registration part", async () => {
  const response = await request(host, mutation);
  expect(response).toEqual({ register: true });
  await AppDataSource.initialize();
  const users = await User.find({ where: { email } });
  expect(users).toHaveLength(1);
  const user = users[0];
  expect(user.email).toEqual(email);
  expect(user.password).not.toEqual(password);
});

// use a test database
// whatever you do , just fucking drop the data/
// the server must start within the test file
