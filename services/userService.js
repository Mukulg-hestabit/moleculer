import { ServiceBroker } from "moleculer";
import { insertUserToTable, deleteUser } from "../controler/userControler.js";

const userServiceBroker = new ServiceBroker({
  nodeID: "user-node", //broker name
  transporter: "NATS", //using transporter to communicate betweeen brokers
});

userServiceBroker.createService({
  name: "user", // service name
  actions: {
    async createUser(ctx) {
      // create user here
      const createUser = await insertUserToTable(ctx.params);
      console.log(createUser);
      return { msg: "User Created Sucessfully" };
    },
    async deleteUserService(ctx) {
      deleteUser(ctx.params.id);
      return { msg: "User Deleted Sucessfully" };
    },
  },
});
export default userServiceBroker;
