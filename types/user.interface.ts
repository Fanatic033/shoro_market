export interface IUser {
	id?: number;
	clientGuid: string
	name: string;
	email?: string
	accessToken: string;
	refreshToken: string;
	phoneNumber?: string;
	address?: string;
}