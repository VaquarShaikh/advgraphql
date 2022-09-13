import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";
import { loadSchemaSync } from "@graphql-tools/load";
import { createServer } from "@graphql-yoga/node";
import { join } from "path";
import { resolvers } from "./resolvers";
import { creatTypeormConn } from "./utils/createTypeormconn";
import "reflect-metadata";
import { AddressInfo } from "net";

export const startServer = async () => {
  const typeDefs = loadSchemaSync(join(__dirname, "schema.graphql"), {
    loaders: [new GraphQLFileLoader()],
  });

  const server = createServer({
    schema: {
      typeDefs,
      resolvers,
    },
    port: process.env.NODE_ENV === "test" ? 0 : 4000,
  });

  // await AppDataSource.initialize();
  await creatTypeormConn();
  const app = await server.start();

  const { port } = app.address() as AddressInfo;
  console.log("The value of the port is (STARTSERVER): ", `${port}`);

  return app;
};
