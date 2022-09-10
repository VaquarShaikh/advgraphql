export const resolvers = {
  Query: {
    hello: (_: any, { name }: GQL.IHelloOnQueryArguments) =>
      `Hello from Yoga! ${name}`,
  },
};
