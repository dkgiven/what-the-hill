import errorHandler from "errorhandler";

import wthApp from "./app";

/**
 * Error Handler. Provides full stack - remove for production
 */
wthApp.use(errorHandler());

/**
 * Starts the Express server.
 */
const server = wthApp.listen(wthApp.get("port"), () => {
  console.log(
    `App is running at http://localhost:${ wthApp.get("port")} in ${wthApp.get("env")} mode`,
  );
  console.log("Press CTRL-C to stop\n");
});

export default server;
