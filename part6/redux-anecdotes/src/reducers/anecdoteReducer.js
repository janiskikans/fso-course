import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdotes'

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    appendAnecdote(state, action) {
      state.push(action.payload)
    },
    setAnecdotes(state, action) {
      return action.payload
    }
  }
})

export const { appendAnecdote, setAnecdotes } = anecdoteSlice.actions

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const createAnecdote = content => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch(appendAnecdote(newAnecdote))
  }
}

export const voteForAnecdote = anecdoteId => {
  return async (dispatch, getState) => {
    const state = getState()
    const anecdotes = state.anecdotes
    const anecdoteToChange = anecdotes.find(anecdote => anecdote.id === anecdoteId)

    const updatedAnecdote = await anecdoteService.updateAnecdote(anecdoteId, {
      ...anecdoteToChange,
      votes: anecdoteToChange.votes + 1
    })

    const updatedAnecdotes = anecdotes.map(anecdote => anecdote.id !== anecdoteId ? anecdote : updatedAnecdote)
    dispatch(setAnecdotes(updatedAnecdotes))
  }
}

export default anecdoteSlice.reducer