import { json } from "stream/consumers";
import { ConnectionOptionsReader } from "typeorm";
import { AppDataSource, testDataSource } from "../data-source";

export const creatTypeormConn = async () => {
  process.env.NODE_ENV === "test"
    ? await testDataSource.initialize()
    : await AppDataSource.initialize();
};
