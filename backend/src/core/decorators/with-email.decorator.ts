import { SerializeGroups } from './serialize-groups.decorator';

export function WithEmail() {
  return SerializeGroups('email');
}
