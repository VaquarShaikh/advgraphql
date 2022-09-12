import { createServer } from "@graphql-yoga/node";
import { AppDataSource } from "./data-source";
import { loadSchemaSync } from "@graphql-tools/load";
import { join } from "path";
import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";
import { addResolversToSchema } from "@graphql-tools/schema";
import { resolvers } from "./resolvers";

export const startServer = async () => {
  const typeDefs = loadSchemaSync(join(__dirname, "schema.graphql"), {
    loaders: [new GraphQLFileLoader()],
  });

  const server = createServer({
    schema: {
      typeDefs,
      resolvers,
    },
  });

  await AppDataSource.initialize();
  await server.start();
};
