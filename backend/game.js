const users = {};
const io = require('socket.io')(server, { cors: { origin: '*' } });

io.on('connection', socket => {
    socket.on('join', ({ username }) => {
        users[socket.id] = username;
        io.emit('updatePlayers', users);
    });

    socket.on('startGame', opponentId => {
        io.to(opponentId).emit('gameStart', { opponent: users[socket.id] });
    });

    socket.on('rollDice', () => {
        const roll = Math.floor(Math.random() * 6) + 1;
        socket.emit('diceRoll', roll);
        socket.broadcast.emit('opponentRoll', roll);
    });

    socket.on('disconnect', () => {
        delete users[socket.id];
        io.emit('updatePlayers', users);
    });
});
