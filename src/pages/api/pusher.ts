import Pusher from 'pusher';

const pusher = new Pusher({
  appId: "1664796",
  key: "78f4b7bfbca901f54507",
  secret: "86a351da9d6fea9148af",
  cluster: "ap4",
  useTLS: true
});

export default pusher;