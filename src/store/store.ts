import { configureStore } from '@reduxjs/toolkit'
import cellReducer from './features/cell/cellReducer'
import bundleReducer from './features/bundle/bundleReducer'
import { useDispatch } from 'react-redux'
export const store = configureStore({
  reducer: {
    cellReducer,
    bundleReducer
  },
  // middleware: (getDefaultMiddleware) => getDefaultMiddleware({
  //   serializableCheck: false
  // })
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>

// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = () => useDispatch<AppDispatch>()