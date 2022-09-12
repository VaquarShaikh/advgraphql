// import sum from "./sum";
import { describe, expect, test } from "@jest/globals";
import { startServer } from "..";
import { request } from "graphql-request";
import { host } from "./constants";

const email = "bob@bob.com";
const password = "abcd1234";

const mutation = `
mutation{
  register(email: "${email}" , password:"${password}")
}
`;

test("adds 1 + 2 to 3", async () => {
  // expect(sum(1, 2)).toBe(3);
  const response = await request(host, mutation);
  expect(response).toEqual({ register: true });
});
