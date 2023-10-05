import "reflect-metadata"
import { DataSource } from "typeorm"
import { Book } from "./entity/Book"
import { User } from "./entity/User"
import { Category } from "./entity/Category"

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    database: "infriend2023_webshop_k16",
    synchronize: true,
    logging: true,
    entities: [User, Book, Category],
    migrations: [],
    subscribers: [],
})
