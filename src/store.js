import { configureStore } from '@reduxjs/toolkit';
import userReducer from './features/userSlice';
import popupReducer from './features/popupSlice';
import gameReducer from './features/gameSlice'



export const store = configureStore({
  reducer: {
    user: userReducer,
    popup: popupReducer,
    game: gameReducer,  // add your slice here  // Example: popup: popupReducer, game: gameReducer,  // add your slice here  // Example: popup: popupReducer, game: gameReducer,  // add your slice here  // Example: popup: popupReducer, game: gameReducer,  // add your slice here  // Example: popup: popupReducer, game: gameReducer,  // add your slice here  // Example: popup: popupReducer
  },
})