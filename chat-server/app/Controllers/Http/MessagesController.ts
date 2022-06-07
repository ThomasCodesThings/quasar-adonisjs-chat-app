import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Channel from 'App/Models/Channel'
import User from 'App/Models/User'
import Message from 'App/Models/Message'

export default class MessagesController {
    async addMessage({ request, response, params}: HttpContextContract) {
        const channel = await Channel.findOrFail(params.id)
        if (!channel) {
            return response.status(404).send({
                error: 'Channel not found',
            })
        }
        // check the difference between time now and channel.updatedAt
        const timeDifference = Math.abs(new Date().getTime() - new Date(channel.updatedAt.toString()).getTime())
        const timeDifferenceInDays = Math.ceil(timeDifference / (1000 * 60 * 60 * 24))
        if (timeDifferenceInDays > 30) {
            await channel.delete()
            return response.status(404).send({
                error: 'Channel is not active',
            })
        }
        const user = await User.query().where('id', request.input('user_creator_id')).first()
        if (!user) {
            return response.status(404).send({
                error: 'User not found',
            })
        }
        const message = await Message.create({
            channelId: channel.id,
            userCreatorId: user.id,
            text: request.input('text'),
        })   
        user.currentMessage = ''
        await user.save()
        channel.updatedAt = message.createdAt
        await channel.save()
        return response.status(200).send({
            message: 'Message added',
        })
    }

    async getMessages({ request, response, params}: HttpContextContract) {
        const channel = await Channel.findOrFail(params.id)
        if (!channel) {
            return response.status(404).send({
                error: 'Channel not found',
            })
        }
        const messages = await Message.query().where('channel_id', channel.id).orderBy('created_at', 'desc').limit(params.endingIndex)
        if(!messages) {
            return response.status(404).send({
                error: 'No messages found',
            })
        }
        const senderUser = await User.query().where('id', params.userID).first()
        const messagesArray : Object[] = []
        for (let i = 0; i < messages.length; i++) {
            const user = await User.query().where('id', messages[i].userCreatorId).first()
            if (user) {
                messagesArray.push({
                    id: messages[i].id,
                    userNickname: user.nickname,
                    text: messages[i].text,
                    createdAt: messages[i].createdAt,
                    isTagged: messages[i].text.split(' ').includes('@' + senderUser?.nickname) ? true : false,
                })
            }
        }
        return messagesArray
    }
}
