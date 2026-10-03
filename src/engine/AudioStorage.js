/**
 * IndexedDB helper for saving and loading custom user audio files (MP3, WAV, OGG)
 * Allows persistent playback of user's custom music tracks across page refreshes.
 */

const DB_NAME = 'ZodiacAudioDB';
const DB_VERSION = 1;
const STORE_NAME = 'custom_music';

function openDB() {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      resolve(null);
      return;
    }
    const req = window.indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function saveCustomAudio(key, fileOrBlob, fileName) {
  try {
    const db = await openDB();
    if (!db) return false;
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const data = {
        blob: fileOrBlob,
        name: fileName || fileOrBlob.name || 'custom_track.mp3',
        savedAt: Date.now()
      };
      const req = store.put(data, key);
      req.onsuccess = () => resolve(true);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('Could not save custom audio to IndexedDB:', err);
    return false;
  }
}

export async function loadCustomAudio(key) {
  try {
    const db = await openDB();
    if (!db) return null;
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(key);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('Could not load custom audio from IndexedDB:', err);
    return null;
  }
}

export async function deleteCustomAudio(key) {
  try {
    const db = await openDB();
    if (!db) return false;
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(key);
      req.onsuccess = () => resolve(true);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    return false;
  }
}
