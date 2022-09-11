import { IResolvers } from "@graphql-tools/utils/typings/Interfaces";
import bcrypt from "bcryptjs";
import { User } from "./entity/User";

export const resolvers: IResolvers = {
  Query: {
    hello: (_, { name }) => `Hello from Yoga! ${name}`,
  },
  Mutation: {
    register: async (
      _,
      { email, password }: GQL.IRegisterOnMutationArguments
    ) => {
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await User.create({ email, password: hashedPassword });

      await user.save();

      return true;
    },
  },
};
