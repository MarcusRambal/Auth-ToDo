/*
{
id: number,
text: string,
done: boolean,
createdAt: number,
updatedAt: number
}
*/
function getTasks() {
    const tasks = localStorage.getItem('tasks');
    return tasks ? JSON.parse(tasks) : [];
}

function saveTasks(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function getNextId() {
    const tasks = getTasks();
    const ids = tasks.map(task => task.id);
    const maxId = ids.length > 0 ? Math.max(...ids) : 0;
    return maxId + 1;
}



document.addEventListener("DOMContentLoaded", ()  => {
    const taskButton = document.getElementById("task-button");

    // Events
    taskButton.addEventListener("click", (e) => {
        e.preventDefault();

        const todoInput = document.getElementById("todo-input");
        const todoText = todoInput.value;

        if (todoText.trim() === "") {
            alert("Please enter a task.");
            return;
        }
        console.log("Task to add:", todoText);

        const task = {
            id: getNextId(),
            text:todoText,
            done: false,
            createAt: Date.now(),
            updateAt: Date.now()
        }

       const tasks = getTasks();
        tasks.push(task);
        saveTasks(tasks);
        console.log("Task added:", task);
        console.log("All tasks:", tasks);

        alert("Tarea agregada correctamente.");
        todoInput.value = "";

    })

})
