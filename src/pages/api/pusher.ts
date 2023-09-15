
import * as express from 'express'
const Pusher = require("pusher");

const pusher = new Pusher({
  appId: "1664796",
  key: "78f4b7bfbca901f54507",
  secret: "86a351da9d6fea9148af",
  cluster: "ap4",
  useTLS: true
});

module.exports = (req: express.Request, res: express.Response) => {
    const data = req.body;
    pusher.trigger('my-channel', 'hello', data, () => {
      res.status(200).end('sent event successfully');
    });
  };


export default pusher;