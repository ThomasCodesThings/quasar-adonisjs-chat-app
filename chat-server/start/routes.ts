/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
  return { hello: 'world' }
})

Route.group(() => {
  Route.post('register', 'AuthController.register')
  Route.post('login', 'AuthController.login')
  Route.post('logout', 'AuthController.logout').middleware('auth')
  Route.get('me', 'AuthController.me').middleware('auth')
}).prefix('auth')

Route.group(() => {
  Route.post(':id/status', 'UsersController.updateStatus').middleware('auth')
  Route.post(':id/typing', 'UsersController.updateTyping').middleware('auth')
  Route.get(':id/channels', 'UsersController.getChannels').middleware('auth')
}).prefix('user')

Route.group(() => {
  Route.post('join', 'ChannelsController.join')
  Route.post('invite', 'ChannelsController.invite').middleware('auth')
  Route.post('revoke', 'ChannelsController.revoke').middleware('auth')
  Route.post('kick', 'ChannelsController.kick').middleware('auth')
  Route.post('quit', 'ChannelsController.quit').middleware('auth')
  Route.post('cancel', 'ChannelsController.cancel').middleware('auth')
  Route.post('accept', 'ChannelsController.accept').middleware('auth')
  Route.get(':id/members', 'ChannelsController.getMembers')
  Route.post(':id/add', 'MessagesController.addMessage').middleware('auth')
  Route.get(':id/messages/:userID/:endingIndex', 'MessagesController.getMessages')
}).prefix('channel')


import Ws from '@ioc:Ruby184/Socket.IO/Ws'



// this is dynamic namespace, in controller methods we can use params.name
Ws.namespace('channels/:name')
  // .middleware('channel') // check if user can join given channel
  .on('loadMessages', 'MessageController.loadMessages')
  .on('addMessage', 'MessageController.addMessage')
//route to change user status based on user id in params
