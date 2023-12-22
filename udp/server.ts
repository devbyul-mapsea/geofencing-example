import { createSocket } from "dgram";
import fs from "fs";
import AisDecoder from "ais-stream-decoder";

interface IClient {
  address: string;
  port: number;
  family: "IPv4" | "IPv6";
  size: number;
  reciveTime: Date;
}
const aisDecoder = new AisDecoder();

const server = createSocket("udp4");
let clients: IClient[] = [];
server.on("error", (err) => {
  console.error(`server error:\n${err.stack}`);
  server.close();
});

server.on("message", (msg, rinfo) => {
  const clientExists = clients.some(
    (client: IClient) =>
      client.port === rinfo.port && client.address === rinfo.address
  );

  if (!clientExists) {
    clients.push({ ...rinfo, reciveTime: new Date() });
  }

  // console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
});

server.on("listening", () => {
  const address = server.address();
  console.log(`server listening ${address.address}:${address.port}`);
});

const broadcastMessage = (message: Buffer) => {
  clients.forEach((client) => {
    const { port, address } = client;

    const errorCallBack = (error: Error | null, bytes: number): void => {
      if (error) {
        console.error(error);
      } else {
        console.log(`Message sent to ${client.address}:${client.port}`);
      }
    };

    server.send(message, port, address, errorCallBack);
    // console.log(`${address}:${port} send : ${message}`);
  });
};

aisDecoder.on("error", (error) => {
  console.log("aisDecoder error : ", error);
});
aisDecoder.on("data", (decodedMessage) => {
  const message = Buffer.from(decodedMessage);

  broadcastMessage(message);
});

const PORT = 40000; // The port the server is broadcasting to
const HOST = "0.0.0.0"; // Bind to all interfaces
server.bind(PORT, HOST);
// Prints: server listening 0.0.0.0:41234

setInterval(() => {
  const raw_data = fs.readFileSync("./raw_datas/nmea-sample");
  const utf_data = raw_data.toString("utf-8");
  const split_data = utf_data.split("\r\n");

  split_data.forEach((value, index) => {
    if (index === split_data.length - 1) {
      return;
    }
    aisDecoder.write(value);
  });
});

setInterval(() => {
  const now = new Date();
  clients.forEach((value, i) => {
    const { address, port, reciveTime } = value;

    const diffMSec = now.getTime() - reciveTime.getTime();
    const diffMin = diffMSec / (60 * 1000);

    if (diffMSec >= 10) {
      clients.splice(i - 1, 1);
      console.log(`DISCONNECTION ${address}:${port}`);
    }
  });
}, 1000);
