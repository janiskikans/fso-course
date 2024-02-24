const Header = ({ course }) => <h1>{course}</h1>

const Total = ({ course }) => {
  const exerciseSum = course.parts.reduce((acc, part) => acc + part.exercises, 0)

  return <p><b>total of {exerciseSum} exercises</b></p>
}

const Part = ({ part }) => <p>{part.name} {part.exercises}</p>

const Content = ({ parts }) => 
  <>
    {parts.map((part) =>
      <Part part={part} key={part.id} />
    )} 
  </>

const Course = ({ course }) => {
  
  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total course={course} />
    </div>
  )
}

export default Course