declare namespace API {
  type v1ConnectTelegramPayLoad = true;

  type v1ConnectTelegramResponse = {
    code?: string;
  };

  type v1ConnectTwitterPayLoad = {
    twitter?: string;
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

  type v1UserProfile = {
    id?: string;
    address?: string;
    name?: string;
    twitter?: string;
    telegram?: string;
    discord?: string;
  };
}
