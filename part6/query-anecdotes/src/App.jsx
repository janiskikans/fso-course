import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { useNotifcationDispatch } from './NotificationContext'
import { getAnecdotes, updateAnecdote } from './requests'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

const App = () => {
  const queryClient = useQueryClient()
  const notificationDispatch = useNotifcationDispatch()

  const anecdotesResult = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes
  })

  const updateAnecdoteMutation = useMutation({
    mutationFn: updateAnecdote,
    onSuccess: (updatedAnecdote) => {
      const anecdotes = queryClient.getQueryData(['anecdotes'])
      const newAnecdotes = anecdotes.map(anecdote => {
        return anecdote.id === updatedAnecdote.id ? updatedAnecdote : anecdote
      })

      queryClient.setQueryData(['anecdotes'], newAnecdotes)
    }
  })

  const handleVote = (anecdote) => {
    updateAnecdoteMutation.mutate({ ...anecdote, votes: anecdote.votes + 1 })
    notificationDispatch({ type: 'SET', payload: `anecdote '${anecdote.content}' voted` })
    setTimeout(() => notificationDispatch({ type: 'CLEAR' }), 5000)
  }

  if (anecdotesResult.isLoading) {
    return <div>loading data...</div>
  }

  if (anecdotesResult.isError) {
    return <div>anecdote service not available due to problems in server</div>
  }

  const anecdotes = anecdotesResult.data.sort((a, b) => b.votes - a.votes)

  return (
    <div>
      <h3>Anecdote app</h3>
    
      <Notification />
      <AnecdoteForm />
    
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
