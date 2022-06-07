export interface JoinChannelData {
    channel_name: string,
    channel_owner_user_id: number,
    channel_is_private: boolean
}

export interface UserData{
    channel_id: number,
    sender_id: number,
    nickname: string
}

export interface ChannelData{
    channel_id: number,
    sender_id: number
}

export interface ChannelDetailsData{
    id: number,
    name: string,
    is_private: boolean,
    channel_owner_user_id: number
}

export interface ChannelMemberData{
    user_id: number,
    user_nickname: string,
    user_status: string,
}

export interface MessageData{
    channel_id: number,
    user_creator_id: number,
    text: string,
}

export interface ChannelMessageBoundary{
    channelId: number,
    userId: number,
    endingIndex: number
}