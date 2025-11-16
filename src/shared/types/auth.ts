export enum AuthorizationStatus {
  Unknown = 'unknown',
  Authorized = 'authorized',
  Unauthorized = 'unauthorized',
}

export type AuthInfo = {
  id: number;
  email: string;
  name: string;
  avatarUrl: string;
  isPro: boolean;
  token: string;
};
