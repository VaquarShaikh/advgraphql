import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";
import { loadSchemaSync } from "@graphql-tools/load";
import { createServer } from "@graphql-yoga/node";
import path, { join } from "path";
import { creatTypeormConn } from "./utils/createTypeormconn";
import "reflect-metadata";
import { AddressInfo } from "net";
import * as fs from "fs";
import { makeExecutableSchema } from "graphql-tools";
import { GraphQLSchema } from "graphql";
import { mergeSchemas } from "@graphql-tools/schema";
const { mergeResolvers } = require("@graphql-tools/merge");
const { loadFilesSync } = require("@graphql-tools/load-files");

export const startServer = async () => {
  const schemas: GraphQLSchema[] = [];
  const folders = fs.readdirSync(path.join(__dirname, "./modules"));

  const resolverFiles = loadFilesSync(
    path.join(__dirname, `./modules/**/resolvers.ts`)
  );

  // console.log("resolverFiles : ", resolverFiles);

  const typeDefs = loadSchemaSync("./**/*.graphql", {
    loaders: [new GraphQLFileLoader()],
  });

  const resolvers = mergeResolvers(resolverFiles);

  // console.log("typeDefs : ", typeDefs);
  // console.log("resolvers : ", resolvers);

  // console.log("folders : ", folders);

  // folders.forEach((folder) => {
  //   const resolvers = require(`./modules/${folder}/resolvers`);
  //   const typeDefs = loadSchemaSync(join(__dirname, "schema.graphql"), {
  //     loaders: [new GraphQLFileLoader()],
  //   });
  //   console.log("resolvers : ", resolvers);
  //   schemas.push(makeExecutableSchema({ typeDefs, resolvers }));
  // });

  const schema = makeExecutableSchema({ typeDefs, resolvers });

  const server = createServer({
    schema: mergeSchemas({ schemas: [typeDefs], resolvers }),
    port: process.env.NODE_ENV === "test" ? 0 : 4000,
  });

  // await AppDataSource.initialize();
  await creatTypeormConn();
  const app = await server.start();

  const { port } = app.address() as AddressInfo;
  console.log("The value of the port is (STARTSERVER): ", `${port}`);

  return app;
};
