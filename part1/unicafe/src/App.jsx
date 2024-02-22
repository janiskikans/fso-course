import { useState } from 'react'

const Button = ({ handleClick, text }) => <button onClick={handleClick}>{text}</button>

const StatisticLine = ({ text, value }) => (
	<tr>
		<td>{text}</td>
		<td>{value}</td>
	</tr>
)

const Statistics = ({ good, neutral, bad }) => {
	const allCount = good + neutral + bad

	if (!allCount) {
		return <div>No feedback given</div>
	}

	const average = allCount ? (good * 1 + neutral * 0 + bad * -1) / allCount : 0
	const positivePercentage = (allCount ? (good / allCount) * 100 : 0) + ' %'

	return (
		<table>
			<tbody>
				<StatisticLine text='good' value={good} />
				<StatisticLine text='neutral' value={neutral} />
				<StatisticLine text='bad' value={bad} />
				<StatisticLine text='all' value={allCount} />
				<StatisticLine text='average' value={average} />
				<StatisticLine text='positive' value={positivePercentage} />
			</tbody>
		</table>
	)
}

const App = () => {
	const [good, setGood] = useState(0)
	const [neutral, setNeutral] = useState(0)
	const [bad, setBad] = useState(0)

	return (
		<div>
			<h1>give feedback</h1>
			<Button text='good' handleClick={() => setGood(good + 1)} />
			<Button text='neutral' handleClick={() => setNeutral(neutral + 1)} />
			<Button text='bad' handleClick={() => setBad(bad + 1)} />
			<h1>statistics</h1>
			<Statistics good={good} neutral={neutral} bad={bad} />
		</div>
	)
}

export default App
