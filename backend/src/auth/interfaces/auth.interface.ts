
export class PayLoadToken {
  sub: string;
  name: string;
}

export interface AuthInterface {
  payload: PayLoadToken;
  accesToken: string;
}

export interface IUseToken {
  sub:  string;
  isExpired: boolean;
  name: string;
}

export interface PayLoadTokenInterface {
  sub:  string;
  name: string;
  iat:  number;
  exp:  number;
}