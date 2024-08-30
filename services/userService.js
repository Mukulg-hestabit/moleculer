import { ServiceBroker } from "moleculer";
import { insertUserToTable } from "../controler/userControler.js";

const userServiceBroker = new ServiceBroker({
  nodeID: "user-node",
  transporter: "NATS",
});

userServiceBroker.createService({
  name: "user",
  actions: {
    async createUser(ctx) {
      // create user here
      const createUser=await insertUserToTable(ctx.params)
      console.log(createUser)
      return "User Created Sucessfully";
    },
  },
});
export default userServiceBroker;
