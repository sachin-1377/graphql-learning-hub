import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import bodyParser from "body-parser";
import cors from "cors";

import { USERS } from "./user.js";
import { TODOS } from "./todo.js";

async function startServer() {
  const app = express();

  const server = new ApolloServer({
    typeDefs: `
        type User {
            id: ID!
            name: String!
            username: String!
            email: String!
            phone: String!
            website: String!
        }

        type Todo {
            id: ID!
            title: String!
            completed: Boolean
            user: User
        }

        type Query {
            getTodos: [Todo]
            getAllUsers: [User]
            getUser(id: ID!): User
        }
    `,
    resolvers: {
      Todo: {
        user: (todo) => USERS.find((e) => e.id === todo.id),
      },
      Query: {
        getTodos: () => TODOS,
        getAllUsers: () => USERS,
        getUser: async (parent, { id }) => USERS.find((e) => e.id === id),
      },
    },
  });

  app.use(bodyParser.json());
  app.use(cors());

  await server.start();

  app.use("/graphql", expressMiddleware(server));

  app.get("/", (req, res) => {
    res.send("GraphQL Server is running. Visit /graphql to access the API.");
  });

  app.listen(8000, () => console.log("Server Started at PORT 8000"));
}

startServer();
