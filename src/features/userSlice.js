import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  uid: "",
  nickname: "",
  wordIndex: -1,
  accessToken: "",
  previousWord: ""
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserInfos: (state, action) => {
        const {uid, nickname, wordIndex, previousWord} = action.payload;
        state.uid = uid;
        state.nickname = nickname;
        state.wordIndex = wordIndex;
        state.previousWord = previousWord;
    },

    setWordIndex: (state, action) => {
      const {wordIndex, previousWord} = action.payload;
      state.wordIndex = wordIndex;
      state.previousWord = previousWord;
    },

    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
    },
   
    resetUserInfos: (state) => {
      state = {...initialState};
    },
  },
})

// Action creators are generated for each case reducer function
export const { setUserInfos, setWordIndex, setAccessToken, resetUserInfos } = userSlice.actions
export const selectUser = state => state.user;


export default userSlice.reducer