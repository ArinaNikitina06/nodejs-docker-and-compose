import { Offer } from "src/features/offers/offer.entity";
import { User } from "src/features/users/user.entity";

export function filterOffersForUser(
	offers: Offer[],
	reqUser: User
): Offer[] {
	if (!reqUser) {
		throw new Error('reqUser is required');
	}
	return offers.filter((offer) => {
		if (offer.hidden !== true) return true;
		if (offer.owner?.id === reqUser.id) return true;
		return false;
	});
}
