import { randomUUID, webcrypto } from 'crypto';

const g = globalThis as unknown as { crypto?: Crypto };

if (!g.crypto) {
	g.crypto = webcrypto as unknown as Crypto;
}

if (!g.crypto.randomUUID) {
	g.crypto.randomUUID = randomUUID as unknown as Crypto['randomUUID'];
}
