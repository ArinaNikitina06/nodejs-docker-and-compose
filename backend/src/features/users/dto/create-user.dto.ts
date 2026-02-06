export interface CreateUserDto {
	username: string;
	about?: string;
	avatar?: string;
	email: string;
	password: string;
}
