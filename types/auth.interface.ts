import { IUser } from '@/types/user.interface';

export interface IAuthFormData {
	username: string;
	password: string;
}

export enum EnumSecurityStore {
	ACCESS_TOKEN = 'accessToken',
	REFRESH_TOKEN = 'refreshToken',
}

export enum EnumAsyncStorage {
	USER = 'user',
}

export interface ITokens {
	jwtToken: string;
	refreshToken: string;
}

export interface IAuthResponse extends ITokens, IUser {}

export interface IUpdateTokens {
	refreshToken: string;
	accessToken: string;
}