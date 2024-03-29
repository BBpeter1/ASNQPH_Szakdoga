import { AppDataSource } from "./data-source"
import express from "express";
import { getRoutes } from "./routes";
import { handleAuthorizationError, handleRoleMismatchError } from "./protect-routes";

AppDataSource.initialize().then(async () => {

    const app = express();

    app.use(express.json());

    app.use('/api', getRoutes(), handleAuthorizationError, handleRoleMismatchError);

    app.listen(3000, () => {
        console.log('Listening on port 3000 ...');
    });

}).catch(error => console.log(error))
