import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";

import express from "express";

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
  `,
    resolvers: {
      Query: {
        hello: () => `hello I am graphql server`,
        say: (_, { name }: { name: String }) => `hello ${name}, how are you`,
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
