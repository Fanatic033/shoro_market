export interface IUser {
	id: number;
	username: string;
	role: string;
	jwtToken: string;
	refreshToken: string;
	phone?: string;
}