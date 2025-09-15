import { IUser } from '@/types/user.interface';

export interface IRegisterData{
		email?: string,
		password: string,
		name: string,
		phoneNumber: string,
		address?: string
}

export interface IAuthFormData {
	phoneNumber: string;
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
	accessToken: string;
	refreshToken: string;
}

export interface IAuthResponse extends ITokens, IUser {}

export interface IUpdateTokens {
	refreshToken: string;
	accessToken: string;
}