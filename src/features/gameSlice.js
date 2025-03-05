import { createSlice } from '@reduxjs/toolkit'
import StorageService from '../services/storageService';

const storage = new StorageService();

const initialState = {
  playedWords: storage.getData("playedWords") || [],
};

export const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    updatePlayedWords: (state, action) => {
        storage.setData("playedWords", action.payload);
        state.playedWords = action.payload;
    }
  },
})

// Action creators are generated for each case reducer function
export const { updatePlayedWords } = gameSlice.actions
export const selectGame = state => state.game;


export default gameSlice.reducer