import * as SecureStore from 'expo-secure-store';

// Supabase needs a `Storage`-shaped object to persist sessions. SecureStore
// is hardware-backed (iOS Keychain / Android Keystore) so tokens are not
// readable from disk on a stolen or jailbroken device.
//
// Android's Keystore caps each value at ~2KB, and a Supabase session JSON
// (access + refresh tokens + user) runs 2–4KB. We chunk on write and
// reassemble on read. A small `${key}.meta` entry records the chunk count.

const CHUNK_SIZE = 1800;

async function getMeta(key: string): Promise<number | null> {
  const raw = await SecureStore.getItemAsync(`${key}.meta`);
  if (!raw) return null;
  const n = Number.parseInt(raw, 10);
  return Number.isFinite(n) && n > 0 ? n : null;
}

async function clearChunks(key: string, count: number): Promise<void> {
  await Promise.all([
    SecureStore.deleteItemAsync(`${key}.meta`),
    ...Array.from({ length: count }, (_, i) => SecureStore.deleteItemAsync(`${key}.${i}`)),
  ]);
}

export const secureStorage = {
  async getItem(key: string): Promise<string | null> {
    const count = await getMeta(key);
    if (count === null) {
      // Legacy / non-chunked write (e.g. tiny values). Fall back to a direct
      // read so a partially-migrated app still works.
      return SecureStore.getItemAsync(key);
    }
    const chunks: string[] = [];
    for (let i = 0; i < count; i++) {
      const chunk = await SecureStore.getItemAsync(`${key}.${i}`);
      if (chunk === null) return null;
      chunks.push(chunk);
    }
    return chunks.join('');
  },

  async setItem(key: string, value: string): Promise<void> {
    // Wipe any prior chunks so we don't leave orphans if the new value is
    // shorter than the old one.
    const prior = await getMeta(key);
    if (prior !== null) await clearChunks(key, prior);
    await SecureStore.deleteItemAsync(key);

    const count = Math.ceil(value.length / CHUNK_SIZE) || 1;
    await SecureStore.setItemAsync(`${key}.meta`, String(count));
    for (let i = 0; i < count; i++) {
      const chunk = value.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);
      await SecureStore.setItemAsync(`${key}.${i}`, chunk);
    }
  },

  async removeItem(key: string): Promise<void> {
    const count = await getMeta(key);
    if (count !== null) {
      await clearChunks(key, count);
    } else {
      await SecureStore.deleteItemAsync(key);
    }
  },
};
