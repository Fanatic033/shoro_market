export interface IUser {
	id?: number;
	username?: string;
	role?: string;
	accessToken: string;
	refreshToken: string;
	phone?: string;
}