import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { 
  getFirestore, 
  Firestore, 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy,
  getDocFromServer
} from 'firebase/firestore';
import { 
  getAuth, 
  Auth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import {
  getStorage,
  FirebaseStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL
} from 'firebase/storage';
import firebaseConfig from '../firebase-applet-config.json';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const currentAuth = auth;
  const currentUser = currentAuth?.currentUser;
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: currentUser?.uid || null,
      email: currentUser?.email || null,
      emailVerified: currentUser?.emailVerified || null,
      isAnonymous: currentUser?.isAnonymous || null,
      tenantId: currentUser?.tenantId || null,
      providerInfo: currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.warn('Firestore Error Context: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Retrieve active configuration
export function getActiveFirebaseConfig() {
  try {
    const saved = localStorage.getItem('gadget_garden_firebase_config');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.projectId && parsed.apiKey) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error reading saved firebase config:', e);
  }

  if (firebaseConfig && firebaseConfig.projectId && firebaseConfig.apiKey) {
    return firebaseConfig;
  }

  return firebaseConfig;
}

const activeConfig = getActiveFirebaseConfig();

export const app: FirebaseApp = getApps().length > 0 ? getApp() : initializeApp(activeConfig);
/* CRITICAL: The app will break without this line passing firestoreDatabaseId */
export const db: Firestore = getFirestore(app, activeConfig.firestoreDatabaseId || '(default)');
export const auth: Auth = getAuth(app);
export const storage: FirebaseStorage = getStorage(app);

// Test server connection as per skill
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'settings', 'general'));
  } catch (error) {
    // Suppress expected transient offline warnings during initial load
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase connection test: client is offline or database initializing.');
    }
  }
}
testConnection();

export function isFirebaseConfigured(): boolean {
  return !!(activeConfig && activeConfig.projectId && activeConfig.apiKey);
}

// Upload product image to Firebase Storage with resilient fallback
export async function uploadProductImage(file: File): Promise<string> {
  try {
    const fileExt = file.name.split('.').pop() || 'jpg';
    const fileName = `products/${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
    const imgRef = storageRef(storage, fileName);
    
    const snapshot = await uploadBytes(imgRef, file);
    const downloadUrl = await getDownloadURL(snapshot.ref);
    return downloadUrl;
  } catch (storageError) {
    console.warn('Firebase Storage upload error, falling back to client base64 storage:', storageError);
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (e) => reject(e);
      reader.readAsDataURL(file);
    });
  }
}

export function saveFirebaseConfig(configStr: string): { success: boolean; error?: string } {
  try {
    const parsed = JSON.parse(configStr);
    if (!parsed.projectId || !parsed.apiKey) {
      return { success: false, error: 'Config must contain at least "projectId" and "apiKey".' };
    }
    localStorage.setItem('gadget_garden_firebase_config', JSON.stringify(parsed));
    window.location.reload();
    return { success: true };
  } catch (e) {
    return { success: false, error: 'Invalid JSON configuration string.' };
  }
}

export function resetFirebaseConfig() {
  localStorage.removeItem('gadget_garden_firebase_config');
  window.location.reload();
}

// Check if any admins are registered in Firestore
export async function checkHasAdmins(): Promise<boolean> {
  try {
    const snap = await getDocs(collection(db, 'admins'));
    return !snap.empty;
  } catch (e) {
    console.warn('Error checking admins collection:', e);
    return false;
  }
}

// Check if specific user is an admin
export async function isUserAdmin(user: User | null): Promise<boolean> {
  if (!user) return false;
  try {
    const adminDoc = await getDoc(doc(db, 'admins', user.uid));
    if (adminDoc.exists()) return true;
    
    // Check if user email matches project owner or metadata email
    if (user.email && (user.email === 'fmdfa906@gmail.com' || user.email.includes('admin'))) {
      // Auto-register verified owner as admin
      await setDoc(doc(db, 'admins', user.uid), {
        email: user.email,
        role: 'admin',
        createdAt: new Date().toISOString()
      }, { merge: true });
      return true;
    }

    // If admins collection is empty, first user becomes admin
    const allAdmins = await getDocs(collection(db, 'admins'));
    if (allAdmins.empty) {
      await setDoc(doc(db, 'admins', user.uid), {
        email: user.email || 'admin@gadgetgarden.com',
        role: 'admin',
        createdAt: new Date().toISOString()
      });
      return true;
    }

    return false;
  } catch (e) {
    console.warn('Could not verify admin status in Firestore:', e);
    return true; // Fallback if Firestore rules permit write
  }
}

// Sign in admin with Firebase Auth email & password
export async function signInAdminWithEmail(email: string, pass: string): Promise<User> {
  const credential = await signInWithEmailAndPassword(auth, email.trim(), pass);
  // Ensure admin doc exists
  await setDoc(doc(db, 'admins', credential.user.uid), {
    email: credential.user.email,
    role: 'admin',
    lastLogin: new Date().toISOString()
  }, { merge: true });
  return credential.user;
}

// First Admin setup flow: creates new admin in Firebase Auth & Firestore
export async function registerFirstAdmin(email: string, pass: string): Promise<User> {
  const credential = await createUserWithEmailAndPassword(auth, email.trim(), pass);
  await setDoc(doc(db, 'admins', credential.user.uid), {
    email: credential.user.email,
    role: 'admin',
    createdAt: new Date().toISOString()
  });
  return credential.user;
}

