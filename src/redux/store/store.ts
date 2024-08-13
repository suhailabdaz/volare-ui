import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import userAuthSlice from '../slices/userSlice';
import adminAuthSlice from '../slices/adminSlice';
import ProfileSlice from '../slices/profileSlice';
import TravellerSlice from '../slices/travellersSlice';
import authorityAuthSlice from '../slices/authoritySlice';
import airlineAuthSlice from '../slices/airlineSlice';
import Heroslice from '../slices/HeroSlice';
import { airlineApi } from '../apis/airlineApiSlice';
import {userApi} from '../apis/userApiSlice'
import {adminApi} from '../apis/adminApiSlice'
import {authorityApi} from '../apis/authorityApiSlice'

const persistConfiguration = {
  key: 'root',
  version: 1,
  storage,
};

const rootReducer = combineReducers({
    UserAuth: userAuthSlice.reducer,
    AdminAuth: adminAuthSlice.reducer,
    ProfileAuth :ProfileSlice.reducer,
    TravellerAuth:TravellerSlice.reducer,
    AuthorityAuth:authorityAuthSlice.reducer,
    AirlineAuth:airlineAuthSlice.reducer,
    HeroAuth:Heroslice.reducer,
  [airlineApi.reducerPath]: airlineApi.reducer, 
  [userApi.reducerPath]: userApi.reducer, 
  [adminApi.reducerPath]: adminApi.reducer, 
  [authorityApi.reducerPath]: authorityApi.reducer, 
});

const persistedReducer = persistReducer(persistConfiguration, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(airlineApi.middleware)
    .concat(userApi.middleware)
    .concat(adminApi.middleware)
    .concat(authorityApi.middleware), 



});

export const persistor = persistStore(store);

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
