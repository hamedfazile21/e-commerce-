import { User } from "src/user/entities/user.entity";

export interface IGoogleUser {
  google_id: string;
  email: string;
  name: string;
  last_name: string;
  avatar_url?: string;
}

export interface IJwtPayload {
  sub: number;
  email: string;
  role: string;
}

export interface IHandelTokenAndResponse {
  token : string,
  user : User
}
