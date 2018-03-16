import './styles.css'

const todosList = document.querySelector('#todos-container')
const input = document.querySelector('#input')

const renderATodo = (todo) => `
<li class="list-element">
  <p class="todo-label">${todo.label}</p>
  <button class="button remove-button">x</button>
</li>
`
const createTodo = (string) => {
  return {
    label: string,
    completed: false,
    createdAt: new Date()
  }
}
input.addEventListener('keydown', (event) => {
  if (event.keyCode === 13) {
    todosList.innerText = renderATodo(createTodo(event.target.value))
    event.target.value = ""
  }
})
