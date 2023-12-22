import { createSocket } from "dgram";

const client = createSocket("udp4");

const SERVER_PORT = 40000;
const SERVER_HOST = "127.0.0.1";

const PORT = 40001; // The port the server is broadcasting to
const HOST = "0.0.0.0"; // Bind to all interfaces

const connection = Buffer.from("CONNECTION");
const disconnection = Buffer.from("DISCONNECTION");

client.on("error", (err) => {
  console.error(`client error:\n${err.stack}`);
  client.send(disconnection, SERVER_PORT, SERVER_HOST);
  console.log(`${SERVER_HOST}:${SERVER_PORT} server ${disconnection}`);
  client.close();
});

client.on("message", (msg: string, rinfo) => {
  if (msg.split(" ")[0] === "DISCONNECTION") {
    throw new Error();
  }
  console.log(`client got: ${msg} from ${rinfo.address}:${rinfo.port}`);
});

client.on("listening", () => {
  const address = client.address();
  console.log(`client listening ${address.address}:${address.port}`);
  connection_server_hanlder();
});

const connection_server_hanlder = () => {
  client.send(connection, SERVER_PORT, SERVER_HOST);
  console.log(`${SERVER_HOST}:${SERVER_PORT} server ${connection}`);
};

client.bind(PORT, HOST);
