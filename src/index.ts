import { expressMiddleware } from "@apollo/server/express4";
import createApolloGraphqlServer from "./graphql";
import express from "express";

async function init() {
  const app = express();
  const PORT = Number(process.env.PORT) || 8000;

  app.use(express.json());

  // create Graphql server

  app.get("/", (req, res) => {
    res.json({ message: "server is running" });
  });

  const gqlServer = await createApolloGraphqlServer();
  app.use("/graphql", expressMiddleware(gqlServer));

  app.listen(PORT, () => {
    console.log(`server is listening at ${PORT}`);
  });
}

init();
