export interface IUser {
	id?: number;
	name: string;
	email: string
	accessToken: string;
	refreshToken: string;
	phoneNumber?: string;
}