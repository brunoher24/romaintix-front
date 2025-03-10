import { createSlice } from '@reduxjs/toolkit'
import StorageService from '../services/storageService';


const initialState = {
  playedWords: new StorageService().getData("playedWords") || [],
  wordHasBeenFound: new StorageService().getData("wordHasBeenFound") || false,
};

export const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    updatePlayedWords: (state, action) => {
      const storage = new StorageService();
      storage.setData("playedWords", action.payload);
      state.playedWords = action.payload;
    },
    updateWordHasBeenFound: (state, action) => {
      state.wordHasBeenFound = action.payload;
    }

  },
})

// Action creators are generated for each case reducer function
export const { updatePlayedWords, updateWordHasBeenFound } = gameSlice.actions
export const selectGame = state => state.game;


export default gameSlice.reducer