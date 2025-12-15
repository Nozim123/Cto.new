import { io } from 'socket.io-client'

let socket

const getSocketUrl = () => {
  if (process.env.NODE_ENV === 'production') return undefined
  return 'http://localhost:5000'
}

export const getSocket = () => {
  if (socket) return socket

  socket = io(getSocketUrl(), {
    transports: ['websocket']
  })

  return socket
}
