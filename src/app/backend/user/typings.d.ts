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

  type v1LoginPayLoad = {
    address?: string;
    signature?: string;
    origin_message?: string;
  };

  type v1LoginResponse = {
    jwt?: string;
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
}
