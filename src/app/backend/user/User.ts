// @ts-ignore
/* eslint-disable */
import request from '../../../lib/request';

/** 此处后端没有提供注释 PUT /user/v1/connect/discord */
export async function UserConnectDiscord(
  body: API.v1ConnectDiscordPayLoad,
  options?: { [key: string]: any },
) {
  return request<API.v1ConnectDiscordResponse>(
    `${process.env.NEXT_PUBLIC_BACKEND_URL + '/.netlify/functions'}/user/v1/connect/discord`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      data: body,
      ...(options || {}),
    },
  );
}

/** 此处后端没有提供注释 PUT /user/v1/connect/telegram */
export async function UserConnectTelegram(
  body: API.v1ConnectTelegramPayLoad,
  options?: { [key: string]: any },
) {
  return request<API.v1ConnectTelegramResponse>(
    `${process.env.NEXT_PUBLIC_BACKEND_URL + '/.netlify/functions'}/user/v1/connect/telegram`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      data: body,
      ...(options || {}),
    },
  );
}

/** 此处后端没有提供注释 PUT /user/v1/connect/twitter */
export async function UserConnectTwitter(
  body: API.v1ConnectTwitterPayLoad,
  options?: { [key: string]: any },
) {
  return request<API.v1UserProfile>(
    `${process.env.NEXT_PUBLIC_BACKEND_URL + '/.netlify/functions'}/user/v1/connect/twitter`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      data: body,
      ...(options || {}),
    },
  );
}

/** 此处后端没有提供注释 PUT /user/v1/gen_verify_code */
export async function UserGenVerifyCode(
  body: API.v1GenVerifyCodePayLoad,
  options?: { [key: string]: any },
) {
  return request<API.v1GenVerifyCodeResponse>(
    `${process.env.NEXT_PUBLIC_BACKEND_URL + '/.netlify/functions'}/user/v1/gen_verify_code`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      data: body,
      ...(options || {}),
    },
  );
}

/** 此处后端没有提供注释 POST /user/v1/login */
export async function UserLogin(body: API.v1LoginPayLoad, options?: { [key: string]: any }) {
  return request<API.v1LoginResponse>(
    `${process.env.NEXT_PUBLIC_BACKEND_URL + '/.netlify/functions'}/user/v1/login`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: body,
      ...(options || {}),
    },
  );
}

/** 此处后端没有提供注释 POST /user/v1/opener_game/mint_record */
export async function UserOpenerGameMintRecord(
  body: API.v1OpenerGameMintRecordPayLoad,
  options?: { [key: string]: any },
) {
  return request<API.v1OpenerGameMintRecordResponse>(
    `${
      process.env.NEXT_PUBLIC_BACKEND_URL + '/.netlify/functions'
    }/user/v1/opener_game/mint_record`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: body,
      ...(options || {}),
    },
  );
}

/** 此处后端没有提供注释 GET /user/v1/opener_game/opener_records */
export async function UserOpenerGameOpenerRecordList(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.UserOpenerGameOpenerRecordListParams,
  options?: { [key: string]: any },
) {
  return request<API.v1OpenerGameOpenerRecordListResponse>(
    `${
      process.env.NEXT_PUBLIC_BACKEND_URL + '/.netlify/functions'
    }/user/v1/opener_game/opener_records`,
    {
      method: 'GET',
      params: {
        ...params,
      },
      ...(options || {}),
    },
  );
}

/** 此处后端没有提供注释 GET /user/v1/opener_game/round_info */
export async function UserGetOpenerGameRoundInfo(options?: { [key: string]: any }) {
  return request<API.v1GetOpenerGameRoundInfoResponse>(
    `${process.env.NEXT_PUBLIC_BACKEND_URL + '/.netlify/functions'}/user/v1/opener_game/round_info`,
    {
      method: 'GET',
      ...(options || {}),
    },
  );
}

/** 此处后端没有提供注释 GET /user/v1/profile */
export async function UserGetProfile(options?: { [key: string]: any }) {
  return request<API.v1UserProfile>(
    `${process.env.NEXT_PUBLIC_BACKEND_URL + '/.netlify/functions'}/user/v1/profile`,
    {
      method: 'GET',
      ...(options || {}),
    },
  );
}

/** 此处后端没有提供注释 PUT /user/v1/profile */
export async function UserPutProfile(
  body: API.v1PutProfilePayLoad,
  options?: { [key: string]: any },
) {
  return request<API.v1UserProfile>(
    `${process.env.NEXT_PUBLIC_BACKEND_URL + '/.netlify/functions'}/user/v1/profile`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      data: body,
      ...(options || {}),
    },
  );
}

/** 此处后端没有提供注释 POST /user/v1/social/disconnect */
export async function UserDisconnectSocial(
  body: API.v1DisconnectSocialPayLoad,
  options?: { [key: string]: any },
) {
  return request<API.v1DisconnectSocialResponse>(
    `${process.env.NEXT_PUBLIC_BACKEND_URL + '/.netlify/functions'}/user/v1/social/disconnect`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: body,
      ...(options || {}),
    },
  );
}

/** 此处后端没有提供注释 POST /user/v1/telegram/webhooks/dm */
export async function UserTelegramBotDMWebhooks(
  body: API.v1TelegramBotDMWebhooksPayLoad,
  options?: { [key: string]: any },
) {
  return request<API.v1TelegramBotDMWebhooksResponse>(
    `${process.env.NEXT_PUBLIC_BACKEND_URL + '/.netlify/functions'}/user/v1/telegram/webhooks/dm`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: body,
      ...(options || {}),
    },
  );
}
