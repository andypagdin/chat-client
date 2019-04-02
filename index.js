const app = require('express')()
const http = require('http').Server(app)
const io = require('socket.io')(http)

const port = process.env.PORT || 3000

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

io.on('connection', (socket) => {
  io.emit('connect')

  socket.on('join', (name) => {
    socket.nickname = name
    io.emit('user connect', name)
  })

  socket.on('chat message', (msg) => {
    io.emit('chat message', socket.nickname + ': ' + msg)
  })

  socket.on('disconnect', () => {
    io.emit('user disconnect', socket.nickname)
  })

  socket.on('user is typing', () => {
    socket.broadcast.emit('typing user', socket.nickname)
  })

  socket.on('user cancelled typing', () => {
    socket.broadcast.emit('typing user cancelled', socket.nickname)
  })
})

http.listen(port, () => {
  console.log(`Listening on *:${port}`)
})