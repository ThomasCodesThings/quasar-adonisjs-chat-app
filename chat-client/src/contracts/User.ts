import { MessageData } from "./Channel"

export interface UserDetails {
    id: number
    status: string,
    currentChannelMessages: []
}

export interface ChannelDetails{
    id: number,
    name: string,
    is_private: boolean,
    channel_owner_user_id: number
}

export interface MessageDetails{
    id: number,
    message: string
}