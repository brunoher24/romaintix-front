import axios from "axios";
import { db } from './firebaseInit';
import { 
    doc, 
    setDoc, 
    getDoc,
    updateDoc,
    serverTimestamp
} from "firebase/firestore";
import { scoreFormater } from "./utilities";



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

    async updateOneUser(uid, data) {
        try {
            await updateDoc(doc(db, 'users', uid), {
                ...data,
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
                optin_analytics,
                updated_at: serverTimestamp(),
            });

            return { success: true };
        } catch (error) {
            console.log(error);
            return { error };
        }
    },

    async getWordScore(guessWord, wordIndex, accessToken) {
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
                Authorization: "Bearer " + accessToken
                }
            });
            // const output = Number(result.data.data.match(/[1-9][0-9]*/g)[0]) / 100;
            const score = scoreFormater(result);
            if(score.percents === 1000) {
                await this.updateOneUser();
            }
            return scoreFormater(result);
        } catch(error) {
            console.log(error);
            return { error };
        }
        
    },

    async getWordsScore(user_word, target_words, accessToken) {
        const env = process.env;
        const _ = "REACT_APP_";
        const urlPrefix = env[`${_}${env[_+'ENVIRONMENT'].toUpperCase()}_BACKEND_URL`];
        try {
            const result = await axios({
                method: 'post',
                url: `${urlPrefix}/api/play-wiki`,
                data: {
                    user_word, 
                    target_words
                },
                headers: {
                Authorization: "Bearer " + accessToken
                }
            });
            
            return result.data;
        } catch(error) {
            console.log(error);
            return { error };
        }
        
    }
    
};

export default userService;
