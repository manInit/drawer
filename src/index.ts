import cors from 'cors';
import express, { Request, Response } from 'express';
import http from 'http';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3001',
    methods: ['GET', 'POST'],
  },
});

app.use(cors());
app.use(express.static('public'));

const rooms: string[] = [];

app.get('/', (req: Request, res: Response) => {
  res.sendFile('/public/index.html');
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});

io.on('connection', (socket) => {
  socket.emit(
    'init-connect',
    JSON.stringify({
      rooms,
    })
  );

  socket.on('draw', (msg) => {
    const idRoom = JSON.parse(msg).id;
    socket.broadcast.to(idRoom).emit('draw', msg);
  });
  socket.on('finish', (msg) => {
    const idRoom = JSON.parse(msg).id;
    socket.broadcast.to(idRoom).emit('finish');
  });
  socket.on('mouse-move', (msg) => {
    const idRoom = JSON.parse(msg).id;
    socket.broadcast.to(idRoom).emit('mouse-move', msg);
  });
  socket.on('new-room', () => {
    const roomId = (+new Date()).toString(16);
    rooms.push(roomId);
    socket.broadcast.emit(
      'new-rooms',
      JSON.stringify({
        rooms,
      })
    );

    socket.join(roomId);
    socket.emit(
      'id-room',
      JSON.stringify({
        id: roomId,
      })
    );
  });
  socket.on('join-room', (msg) => {
    const data = JSON.parse(msg);
    const roomId = data.id;
    const userName = data.userName;
    socket.join(roomId);
    socket.broadcast.to(roomId).emit(
      'user-connect',
      JSON.stringify({
        userName,
      })
    );
    socket.emit(
      'id-room',
      JSON.stringify({
        id: roomId,
      })
    );
  });
});
