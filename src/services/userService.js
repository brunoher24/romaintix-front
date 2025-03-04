
import { db } from './firebaseInit';
import { 
    doc, 
    setDoc, 
    getDoc,
    updateDoc,
    serverTimestamp
} from "firebase/firestore";


const userService = {

    async create(uid, nickname) {
        try {
            await setDoc(doc(db, "users", uid), {
                uid,
                nickname,
                wordIndex: 0,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            });
          
            return true;
        } catch(error) {
            return {error};
        }
    },

    async readOne(uid) {
        try {
            const ref = doc(db, "users", uid);
            const snap = await getDoc(ref);
            if(snap.exists()) {
                return snap.data();
            }
            return {error: "not-found"};
        } catch(error) {
            return {error};
        }
    },

    async deleteOne(uid) {
        try {
            await setDoc(doc(db, "users", uid), {uid, deleted_at: serverTimestamp()});
            return true;
        } catch(error) {
            console.log(error);
            return {error};
        }
    },

    async updateOneUser(uid, nickname) {
        try {
            await updateDoc(doc(db, 'users', uid), {
                nickname,
                updated_at: serverTimestamp(),
            });

            return { success: true };
        } catch (error) {
            return { error };
        }
    },

    async updateOptinOneUser(uid, optin_analytics) {
        try {
            await updateDoc(doc(db, 'users', uid), {
                optin_analytics: optin_analytics,
                updated_at: serverTimestamp(),
            });

            return { success: true };
        } catch (error) {
            console.log(error);
            return { error };
        }
    },
};

export default userService;
