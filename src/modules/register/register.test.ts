import { describe, expect, test } from "@jest/globals";
import { request } from "graphql-request";
import { AppDataSource } from "../../data-source";
import { User } from "../../entity/User";
import { creatTypeormConn } from "../../utils/createTypeormconn";
import { startServer } from "../../startServer";
import { AddressInfo } from "net";
import { appendFile } from "fs";
import {
  duplicateEmail,
  emailNotLongEnough,
  invalidEmail,
  passwordNotLongEnough,
} from "./errorMessages";

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

const mutation = (e: string, p: string) => `
mutation{
  register(email: "${e}" , password:"${p}"){
    path
    message
  }
}
`;

describe("Registration part", () => {
  // registration of a user
  it("Testing duplicate emails", async () => {
    const response = await request(getHost(), mutation(email, password));
    expect(response).toEqual({ register: null });
    const users = await User.find({ where: { email } });
    expect(users).toHaveLength(1);
    const user = users[0];
    expect(user.email).toEqual(email);
    expect(user.password).not.toEqual(password);

    // test for duplicate emails
    const response1: any = await request(getHost(), mutation(email, password));
    expect(await response1.register).toHaveLength(1);
    expect(response1.register[0]).toEqual({
      path: "email",
      message: duplicateEmail,
    });
  });

  it("check bad email", async () => {
    // catch bad email

    const response2: any = await request(getHost(), mutation("ba", password));
    expect(response2).toEqual({
      register: [
        {
          path: "email",
          message: emailNotLongEnough,
        },
        {
          path: "email",
          message: invalidEmail,
        },
      ],
    });
  });

  it("Catch bad password", async () => {
    // catch bad password
    const response3: any = await request(getHost(), mutation(email, "ad"));
    expect(response3).toEqual({
      register: [
        {
          path: "password",
          message: passwordNotLongEnough,
        },
      ],
    });
  });

  it("Catch bad password and email", async () => {
    // catch bad password and email
    const response4: any = await request(getHost(), mutation("df", "ad"));
    expect(response4).toEqual({
      register: [
        {
          path: "email",
          message: emailNotLongEnough,
        },
        {
          path: "email",
          message: invalidEmail,
        },
        {
          path: "password",
          message: passwordNotLongEnough,
        },
      ],
    });
  });
});
