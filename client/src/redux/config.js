import { configureStore } from '@reduxjs/toolkit'
import filmReducer from './reducer/filmReducer'

export const store = configureStore({
    reducer: {
        filmReducer: filmReducer
    },
})