import axios from "axios";
import { db } from './firebaseInit';
import { 
    doc, 
    setDoc, 
    getDoc,
    updateDoc,
    serverTimestamp
} from "firebase/firestore";
import StorageService from './storageService';



const userService = {
    async create(uid, nickname) {
        try {
            const newUser = {
                uid,
                nickname,
                wordIndex: 0,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            };
            console.log(newUser);
            await setDoc(doc(db, "users", uid), newUser);
          
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

    async getWordScore(guessWord, wordIndex) {
        const env = process.env;
        const _ = "REACT_APP_";
        const urlPrefix = env[`${_}${env[_+'ENVIRONMENT'].toUpperCase()}_BACKEND_URL`];
        try {
            const result = await axios({
                method: 'post',
                url: `${urlPrefix}/api/play`,
                data: {
                    wordIndex,
                    guessWord
                },
                headers: {
                Authorization: "Bearer " + new StorageService().getData("firebaseIdToken")
                }
            });
            console.log(result.data);
            return result.data.data;
        } catch(error) {
            console.log(error);
            return { error };
        }
        
    }
    
};

export default userService;
