import "reflect-metadata"
import { DataSource } from "typeorm"
import { Book } from "./entity/Book"
import { User } from "./entity/User"
import { Author } from "./entity/Author"

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    database: "libraryshop_asnqph",
    synchronize: true,
    logging: true,
    entities: [User, Book, Author],
    migrations: [],
    subscribers: [],
})
