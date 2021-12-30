// @ts-ignore
/* eslint-disable */
import request from 'umi-request';

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
