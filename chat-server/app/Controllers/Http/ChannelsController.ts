import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Channel from 'App/Models/Channel'
import User from 'App/Models/User'
import ChannelUser from 'App/Models/ChannelUser'
import UserKick from 'App/Models/UserKick'

export default class ChannelsController {
    async join({ request, response, params}: HttpContextContract) {
        var channel = await Channel.query().where('name', request.input('channel_name')).where('channel_owner_user_id', request.input('channel_owner_user_id')).first()
        if (!channel) {
            const channel2 = await Channel.query().where('name', request.input('channel_name')).first()
            if(channel2) {
                await ChannelUser.create({
                    user_id: request.input('channel_owner_user_id'),
                    channel_id: channel2.id,
                })
                return channel2
            }
            channel = new Channel()
            channel.name = request.input('channel_name')
            channel.isPrivate = request.input('channel_is_private')
            channel.channel_owner_user_id = request.input('channel_owner_user_id')
            await channel.save()
            await ChannelUser.create({
                user_id: request.input('channel_owner_user_id'),
                channel_id: channel.id,
            })
           
            return channel;

            return response.status(404).send({
                error: 'Channel not found',
            })
        }
        
        return response.status(404).send({
            error: 'Cannot create same channel twice',
        })
    }

        //channel.users.push(request.input('user_id'))
        //await channel.save()
        //return channel

    async invite({ request, response, params}: HttpContextContract) {
        const channel = await Channel.findOrFail(request.input('channel_id'))
        if (!channel) {
            return response.status(404).send({
                error: 'Channel not found',
            })
        }
        const user = await User.query().where('nickname', request.input('nickname')).first()
        if (!user) {
            return response.status(404).send({
                error: 'User not found',
            })
        }
        var channelUser = await ChannelUser.query().where('user_id', user.id).where('channel_id', channel.id).where('is_invited', true).first()
        if(channelUser) {
            return response.status(404).send({
                error: 'User is already invited',
            })
        }
        channelUser = await ChannelUser.query().where('user_id', user.id).where('channel_id', channel.id).first()
        if (channel.isPrivate) {
            if (channel.channel_owner_user_id === request.input('sender_id')) {
                if(channelUser && channelUser.isBanned) {
                    channelUser.isInvited = true
                    channelUser.voteKickCount = 0
                    channelUser.isBanned = false

                    await UserKick.query().where('user_kicked_id', user.id).where('channel_id', channel.id).delete()
                    await channelUser.save()
                    return channel
                }
                    await ChannelUser.create({
                        user_id: user.id,
                        channel_id: channel.id,
                        isInvited: true,
                    })
                    return channel  
            }
            return response.status(404).send({
                error: 'You are not the owner of this channel',
            })
        }
        // channel is not private here
        if (channel.channel_owner_user_id === request.input('sender_id')) {
            if(channelUser && channelUser.isBanned) {
                channelUser.isInvited = true
                channelUser.voteKickCount = 0
                channelUser.isBanned = false
                await UserKick.query().where('user_kicked_id', user.id).where('channel_id', channel.id).delete()
                await channelUser.save()
                return channel
            }
        }
        await ChannelUser.create({
            user_id: user.id,
            channel_id: channel.id,
            isInvited: true,
        })
        return channel
    }
    
    async revoke({ request, response, params}: HttpContextContract) {
        const channel = await Channel.findOrFail(request.input('channel_id'))
        if (!channel) {
            return response.status(404).send({
                error: 'Channel not found',
            })
        }
        const user = await User.query().where('nickname', request.input('nickname')).first()
        if (!user) {
            return response.status(404).send({
                error: 'User not found',
            })
        }
        if (channel.isPrivate) {
            if (channel.channel_owner_user_id === request.input('sender_id')) {
                const channelUser = await ChannelUser.query().where('user_id', user.id).where('channel_id', channel.id).first()
                channelUser?.delete()
            }
            return response.status(404).send({
                error: 'You are not the owner of this channel',
            })
        }
        // channel is not private here
        return response.status(404).send({
            error: 'This channel is not private',
        })
        
    }

    async kick({ request, response, params}: HttpContextContract) {
        const channel = await Channel.findOrFail(request.input('channel_id'))
        if (!channel) {
            return response.status(404).send({
                error: 'Channel not found',
            })
        }
        const user = await User.query().where('nickname', request.input('nickname')).first()
        if (!user) {
            return response.status(404).send({
                error: 'User not found',
            })
        }
        if (channel.isPrivate) {
            return response.status(404).send({
                error: 'Cannot kick from a private channel',
            })
        }
        const channelUser = await ChannelUser.query().where('user_id', user.id).where('channel_id', channel.id).first()
        if(!channelUser) {
            return response.status(404).send({
                error: 'Cannot kick non existing user',
            })
        }
        const senderUser = await User.findOrFail(request.input('sender_id'))
        if (!senderUser) {
            return response.status(404).send({
                error: 'Sender user not found',
            })
        }
        const userKick = await UserKick.query().where('user_sender_id', senderUser.id).where('user_kicked_id', user.id).where('channel_id', channel.id).first()
        if(userKick) {
            return response.status(404).send({
                error: 'You have already kicked this user',
            })
        }
        if(channel.channel_owner_user_id === senderUser.id) {
            channelUser.voteKickCount = 3
        }else{
            channelUser.voteKickCount += 1
        }
        await UserKick.create({
            userSenderId: senderUser.id,
            userKickedId: user.id,
            channelId: channel.id,
        })
        await channelUser.save()
        if(channelUser.voteKickCount === 3) {
            channelUser.isBanned = true
        }
        await channelUser.save()
        return channel
    }
    
    async quit({ request, response, params}: HttpContextContract) {
        const channel = await Channel.findOrFail(request.input('channel_id'))
        if (!channel) {
            return response.status(404).send({
                error: 'Channel not found',
            })
        }
        const user = await User.findOrFail(request.input('sender_id'))
        if (!user) {
            return response.status(404).send({
                error: 'User not found',
            })
        }
        if (channel.channel_owner_user_id !== user.id) {
            // channel is private here
            return response.status(404).send({
                error: 'You are not the owner of this channel',
            })
        }
        channel.delete()
        await ChannelUser.query().where('channel_id', channel.id).delete()
        await UserKick.query().where('channel_id', channel.id).delete()
        
        // channel is not private here
    }

    async cancel({ request, response, params}: HttpContextContract) {
        const channel = await Channel.findOrFail(request.input('channel_id'))
        if (!channel) {
            return response.status(404).send({
                error: 'Channel not found',
            })
        }
        const user = await User.findOrFail(request.input('sender_id'))
        if (!user) {
            return response.status(404).send({
                error: 'User not found',
            })
        }
        const channelUser = await ChannelUser.query().where('user_id', user.id).where('channel_id', channel.id).first()
        if(!channelUser) {
            return response.status(404).send({
                error: 'Cannot cancel non existing user',
            })
        }
        if(channel.channel_owner_user_id !== user.id) {
            channelUser.delete()
            return channel
        }
        channel.delete()
        await ChannelUser.query().where('channel_id', channel.id).delete()
        await UserKick.query().where('channel_id', channel.id).delete()
    }

    async accept({ request, response, params}: HttpContextContract) {
        const channel = await Channel.findOrFail(request.input('channel_id'))
        if (!channel) {
            return response.status(404).send({
                error: 'Channel not found',
            })
        }
        const user = await User.findOrFail(request.input('sender_id'))
        if (!user) {
            return response.status(404).send({
                error: 'User not found',
            })
        }
        const channelUser = await ChannelUser.query().where('user_id', user.id).where('channel_id', channel.id).first()
        if(!channelUser) {
            return response.status(404).send({
                error: 'Cannot accept from non existing user',
            })
        }
        channelUser.isInvited = false
        channelUser.save()
        return channel
    }

    async getMembers({ response, params }: HttpContextContract) {
        const channel = await Channel.findOrFail(params.id)
        if (!channel) {
            return response.status(404).send({
                error: 'Channel not found',
            })
        }
        const channelUsers = await ChannelUser.query().where('channel_id', channel.id)
        if (!channelUsers) {
            return response.status(404).send({
                error: 'No members in this channel',
            })
        }
        const users = await User.query().whereIn('id', channelUsers.map(cu => cu.user_id))
        return users
    }
}
