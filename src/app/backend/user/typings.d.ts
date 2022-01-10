declare namespace API {
  type TelegramDMDMChat = {
    id?: number;
    first_name?: string;
    username?: string;
    type?: string;
  };

  type TelegramDMDMFrom = {
    id?: number;
    is_bot?: boolean;
    first_name?: string;
    username?: string;
    language_code?: string;
  };

  type v1ConnectDiscordPayLoad = {
    code?: string;
    redirect_uri?: string;
  };

  type v1ConnectDiscordResponse = true;

  type v1ConnectTelegramPayLoad = true;

  type v1ConnectTelegramResponse = {
    code?: string;
  };

  type v1ConnectTwitterPayLoad = {
    twitter?: string;
  };

  type v1DisconnectSocialPayLoad = v1SocialType;

  type v1DisconnectSocialResponse = true;

  type v1DiscordInfo = {
    id?: string;
    username?: string;
    discriminator?: string;
    avatar?: string;
  };

  type v1GenVerifyCodePayLoad = true;

  type v1GenVerifyCodeResponse = {
    verify_code?: string;
  };

  type v1GetOpenerGameRoundInfoResponse = {
    info?: v1OpenerGameRoundInfo;
    opener_record?: v1OpenerRecord;
  };

  type v1LoginPayLoad = {
    address?: string;
    signature?: string;
    origin_message?: string;
  };

  type v1LoginResponse = {
    jwt?: string;
  };

  type v1OpenerGameMintRecordPayLoad = {
    mintAddress?: string;
    x?: string;
    y?: string;
    verify_code?: string;
  };

  type v1OpenerGameMintRecordResponse = {
    mintAddress?: string;
    x?: string;
    y?: string;
    invited_userid?: string;
  };

  type v1OpenerGameOpenerRecordListResponse = {
    total_count?: number;
    after_token_id?: number;
    before_token_id?: number;
    opener_records?: v1OpenerRecord[];
  };

  type v1OpenerGameRoundInfo = {
    round_number?: number;
    builder_token_amount?: string;
    eth_amount?: string;
    start_timestamp?: number;
    end_timestamp?: number;
    has_winner?: boolean;
    winner_token_id?: number;
  };

  type v1OpenerRecord = {
    mint_address?: string;
    mint_user_name?: string;
    token_id?: number;
    x?: string;
    y?: string;
    block_number?: number;
    block_timestamp?: number;
    invited_address?: string;
    invited_user_name?: string;
    next_token_block_timestamp?: number;
  };

  type v1PutProfilePayLoad = {
    name?: string;
    address?: string;
  };

  type v1SocialType = 'TWITTER' | 'DISCORD' | 'TELEGRAM';

  type v1TelegramBotDMWebhooksPayLoad = {
    update_id?: number;
    message?: v1TelegramDM;
  };

  type v1TelegramBotDMWebhooksResponse = true;

  type v1TelegramDM = {
    message_id?: number;
    from?: TelegramDMDMFrom;
    chat?: TelegramDMDMChat;
    date?: number;
    text?: string;
  };

  type v1TelegramInfo = {
    id?: number;
    first_name?: string;
    username?: string;
    language_code?: string;
  };

  type v1UserProfile = {
    id?: string;
    address?: string;
    name?: string;
    twitter?: string;
    telegram?: v1TelegramInfo;
    discord?: v1DiscordInfo;
  };

  type UserOpenerGameOpenerRecordListParams = {
    pageSize?: number;
    afterTokenId?: number;
    beforeTokenId?: number;
  };
}
