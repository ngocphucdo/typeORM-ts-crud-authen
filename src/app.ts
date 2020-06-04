import "reflect-metadata";
import { createConnection } from "typeorm";
import * as express from "express";
import * as helmet from "helmet";
import * as cors from "cors";
import { Request, Response } from "express";
import { User } from "./entity/User";
import routes from "./routes";

// Connect to DB then start the Server

createConnection()
  .then(async (connection) => {
    const app = express();

    // Middleware
    app.use(express.json());
    app.use(cors());
    app.use(helmet());

    // Routes
    app.use("/", routes);

    app.listen(4000, () => {
      console.log("Server running at port 4000");
    });
  })
  .catch((error) => console.log(error));
