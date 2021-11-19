import { 
    checkAuth, 
    createTodo, 
    completeTodo,
    getTodos,
    logout,
    deleteAllTodos, 
} from '../fetch-utils.js';
import { renderTodo } from '../render-utils.js';

checkAuth();

const todosEl = document.querySelector('.todos');
const todoForm = document.querySelector('.todo-form');
const logoutButton = document.querySelector('#logout');
const deleteButton = document.querySelector('.delete-button');

todoForm.addEventListener('submit', async(e) => {
    e.preventDefault();

    const formData = new FormData(todoForm);

    const todo = formData.get('todo');

    await createTodo(todo);

    todoForm.reset();
    renderTodos();
});

async function renderTodos() {
    const todos = await getTodos();
    
    todosEl.textContent = '';

    for (let todo of todos) {
        const todoEl = renderTodo(todo);

        todoEl.addEventListener('click', async() => {
            await completeTodo(todo.id);

            renderTodos();
        });

        todosEl.append(todoEl);
    }
}

window.addEventListener('load', async() => {
    renderTodos();
});

logoutButton.addEventListener('click', () => {
    logout();
});


deleteButton.addEventListener('click', async() => {
    await deleteAllTodos();

    renderTodos();
});
