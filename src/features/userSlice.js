import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  uid: "",
  nickname: "",
  wordIndex: -1,
  firebaseIdToken: ""
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setLoggedInInfos: (state, action) => {
        const {uid, nickname, wordIndex, firebaseIdToken} = action.payload;
        state.uid = uid;
        state.nickname = nickname;
        state.wordIndex = wordIndex;
        state.firebaseIdToken = firebaseIdToken
    },

    setWordIndex: (state, action) => {
      state.wordIndex = action.payload;
    },
   
    resetUserInfos: (state) => {
        state.uid = "";
        state.nickname = "";
        state.wordIndex = -1;
    },
  },
})

// Action creators are generated for each case reducer function
export const { setLoggedInInfos, setWordIndex, resetUserInfos } = userSlice.actions
export const selectUser = state => state.user;


export default userSlice.reducer