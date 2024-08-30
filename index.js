import { ServiceBroker } from "moleculer";
import HTTPserver from "moleculer-web";

const brokerNode = new ServiceBroker({
  nodeID: "node-1",
  transporter: "NATS",
});

brokerNode.createService({
  name: "gateway",
  mixins: [HTTPserver],
  settings: {
    routes: [
      {
        aliases: {
          "GET /products": "product.listProducts",
          "GET /listall": "product.showAll",
          "POST /addproducts": "product.addNew",
        },
      },
    ],
  },
});

const brokerNode2 = new ServiceBroker({
  nodeID: "node-2",
  transporter: "NATS",
});

brokerNode2.createService({
  name: "product",
  actions: {
    listProducts(ctx) {
      return "Hello World";
    },
    showAll(ctx) {
      return ctx;
    },
    addNew(ctx) {
      return ctx;
    },
  },
});

Promise.all([brokerNode.start(), brokerNode2.start()]);
