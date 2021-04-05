import regeneratorRuntime from "regenerator-runtime";
const express = require("express");
const path = require("path");
import React from "react";
import ReactDOMServer from "react-dom/server";
import { StaticRouter } from "react-router";
import Html from "./js/components/main/HTML";
import App from "./js/components/main/App";
import store from "./js/redux/store/store";
import { Provider } from "react-redux";

const app = express();

app.use("/public",express.static(path.join('dist','public')));

app.get("*", async (req, res, next) => {
  let location = req.location;
  const appMarkup = ReactDOMServer.renderToString(
    <Provider store={store}>
      <StaticRouter location={location} context={{}}>
        <App />
      </StaticRouter>
    </Provider>
  );
  const html = ReactDOMServer.renderToStaticMarkup(
    <Html injection={appMarkup} />
  );

  res.send(`<!doctype html>${html}`);
});

app.listen(3000, () => console.log(`Listening on localhost:3000`));
