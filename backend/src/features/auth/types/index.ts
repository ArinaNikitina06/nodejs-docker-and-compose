import type { Request } from "express";
import { User } from "src/features/users/user.entity";

export interface RequestWithUser extends Request {
	user: User;
}
