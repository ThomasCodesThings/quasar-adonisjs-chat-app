import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import Channel from 'App/Models/Channel'
import ChannelUser from 'App/Models/ChannelUser'

export default class UsersController {
    //change user status
    async updateStatus({ request, response, params}: HttpContextContract) {
        const user = await User.findOrFail(params.id)
        if (!user) {
            return response.status(404).send({
                error: 'User not found',
            })
        }
        user.status = request.input('status')
        await user.save()
        return user
    }

    async updateTyping({ request, response, params}: HttpContextContract) {
        const user = await User.findOrFail(params.id)
        if (!user) {
            return response.status(404).send({
                error: 'User not found',
            })
        }
        user.currentMessage = request.input('message')
        await user.save()
        return user
    }

    async getChannels({ request, response, params}: HttpContextContract) {
        this.updateChannels()
        const user = await User.find(params.id)
        if (!user) {
            return response.status(404).send({
                error: 'User not found',
            })
        }
        const channels = await ChannelUser.query().where('user_id', user.id).orderBy('is_invited', 'desc')
        if (!channels) {
            return response.status(404).send({
                error: 'Channel not found',
            })
        }
        const channelList : Object[] = []
        for (let i = 0; i < channels.length; i++) {
            var channel = await Channel.query().where('id', channels[i].channel_id).first()
            if(channel) {
                const channelUser = await ChannelUser.query().where('channel_id', channel.id).where('user_id', user.id).first()
                var channelDetails = {
                    id: channel.id,
                    name: channel.name,
                    isPrivate: channel.isPrivate,
                    channelOwnerUserId: channel.channel_owner_user_id,
                    isInvited: channels[i].isInvited,
                }
                if(!channelUser?.isBanned) {
                    channelList.push(channelDetails)
                }
            }
        }
        return channelList
    }

    // UNRELATED!!

    async updateChannels(){/*
        const temp = new Channel()
        const channels = await Channel.all()
        for(let i = 0; i < channels.length; i++) {
            let diffTime = Math.abs((temp.createdAt - channels[i].updatedAt));
            var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
            if(temp.createdAt.diff(channels[i].updatedAt).as('days') > 30) {
                await Channel.query().where('id', channels[i].id).delete()
                console.log("Removed old channel")
            }
        }*/
     }
    
}

