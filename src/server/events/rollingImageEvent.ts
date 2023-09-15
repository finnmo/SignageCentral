import pusher from '../../pages/api/pusher';

export default function triggerRollingImageEvent() {
    pusher.trigger('my-channel', 'hello', {
      message: 'Server startup event',
    });
}
