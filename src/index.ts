import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";

import express from "express";
import { prismaClient } from "./lib/db";

async function init() {
  const app = express();
  const PORT = Number(process.env.PORT) || 8000;

  app.use(express.json());

  // create Graphql server
  const gqlServer = new ApolloServer({
    typeDefs: `
    type Query{
        hello:String
        say(name:String):String
    }
    type Mutation {
      createUser(firstName: String!, lastName: String!, email: String!, password: String!):Boolean
    }
  `,
    resolvers: {
      Query: {
        hello: () => `hello I am graphql server`,
        say: (_, { name }: { name: String }) => `hello ${name}, how are you`,
      },
      Mutation: {
        createUser: async (
          _,
          {
            firstName,
            lastName,
            email,
            password,
          }: {
            firstName: string;
            lastName: string;
            email: string;
            password: string;
          }
        ) => {
          await prismaClient.user.create({
            data: {
              firstName,
              lastName,
              email,
              password,
              salt: "random_salt",
            },
          });
          return true;
        },
      },
    },
  });

  // start the gqlServer
  await gqlServer.start();

  app.get("/", (req, res) => {
    res.json({ message: "server is running" });
  });

  app.use("/graphql", expressMiddleware(gqlServer));

  app.listen(PORT, () => {
    console.log(`server is listening at ${PORT}`);
  });
}

init();
