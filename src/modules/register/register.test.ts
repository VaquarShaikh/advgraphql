import { describe, expect, test } from "@jest/globals";
import { request } from "graphql-request";
import { AppDataSource } from "../../data-source";
import { User } from "../../entity/User";
import { creatTypeormConn } from "../../utils/createTypeormconn";
import { startServer } from "../../startServer";
import { AddressInfo } from "net";
import { appendFile } from "fs";

let getHost = () => "";

beforeAll(async () => {
  const app = await startServer();
  const { port } = app.address() as AddressInfo;
  getHost = () => `http://127.0.0.1:${port}/graphql`;
  console.log("The value of getHost is : ", getHost());
  console.log("The value of the port is : ", `${port}`);
});

const email = "abcd1234@bob.com";
const password = "abcd1234";

const mutation = `
mutation{
  register(email: "${email}" , password:"${password}"){
    path
    message
  }
}
`;

test("Registration part", async () => {
  const response = await request(getHost(), mutation);
  expect(response).toEqual({ register: null });
  const users = await User.find({ where: { email } });
  expect(users).toHaveLength(1);
  const user = users[0];
  expect(user.email).toEqual(email);
  expect(user.password).not.toEqual(password);
  const response1: any = await request(getHost(), mutation);
  expect(await response1.register).toHaveLength(1);
  expect(response1.register[0].path).toEqual("email");
});
