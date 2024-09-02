import { ServiceBroker } from "moleculer";
import HTTPserver from "moleculer-web";
import userServiceBroker from "./services/userService.js";

const brokerNode = new ServiceBroker({
  nodeID: "node-1", // id of ther broker
  transporter: "NATS", // transporter medium
});

// Service initialized to listen on api requests
brokerNode.createService({
  name: "gateway",
  mixins: [HTTPserver],
  settings: {
    routes: [
      {
        aliases: {
          "POST /new/user": "user.createUser",
          "DELETE /user/delete/:id": "user.deleteUserService",
        },
      },
    ],
  },
});

// Start all the services
Promise.all([userServiceBroker.start(), brokerNode.start()])
  .then(() => {
    console.log("All services are up and running");
  })
  .catch((error) => {
    {
      console.log("Error in starting services", error);
    }
  });
