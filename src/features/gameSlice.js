import { createSlice } from '@reduxjs/toolkit'
import StorageService from '../services/storageService';


const initialState = {
  playedWords: new StorageService().getData("playedWords") || [],
  wordHasBeenFound: new StorageService().getData("wordHasBeenFound") || false,
  playedWordsWiki: new StorageService().getData("playedWordsWiki") || [],
  foundWordsWiki : new StorageService().getData("foundWordsWiki") || {},
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
    updatePlayedWordsWiki: (state, action) => {
      const storage = new StorageService();
      storage.setData("playedWordsWiki", action.payload);
      state.playedWordsWiki = action.payload;
    },
    updateFoundWordsWiki: (state, action) => {
      const storage = new StorageService();
      storage.setData("foundWordsWiki", action.payload);
      state.foundWordsWiki = action.payload;
    },
    resetPlayedWordsWiki: (state) => {
      const storage = new StorageService();
      storage.setData("playedWordsWiki", []);
      state.playedWordsWiki = [];
    },
    updateWordHasBeenFound: (state, action) => {
      state.wordHasBeenFound = action.payload;
    }

  },
})

// Action creators are generated for each case reducer function
export const { updatePlayedWords, updatePlayedWordsWiki, updateWordHasBeenFound, resetPlayedWordsWiki, updateFoundWordsWiki } = gameSlice.actions
export const selectGame = state => state.game;


export default gameSlice.reducer