import { Offer } from "src/features/offers/offer.entity";
import { User } from "src/features/users/user.entity";

export function filterOffersWithWishForUser(offers: Offer[], reqUser: User, wishOwnerId: number): Offer[] {
  if (!reqUser) {
		throw new Error('reqUser is required');
	}

  return offers.filter(offer => {
    if (!offer.hidden) return true;
    if (offer.owner.id === reqUser.id) return true;
    if (wishOwnerId === reqUser.id) return true;
    return false;
  });
}
