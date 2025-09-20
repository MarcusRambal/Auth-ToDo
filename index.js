/*
{
id: number,
text: string,
done: boolean,
createdAt: number,
updatedAt: number
}
*/

document.addEventListener("DOMContentLoaded", ()  => {
    const taskButton = document.getElementById("task-button");


    //functions 
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

    function renderTaks() {
            const tasks = getTasks();

            if (tasks.length === 0) {
                console.log("No tasks to render.");
                document.getElementById("task-container").innerHTML = "<p>No tasks available.</p>";
                return;
            }

            console.log("Rendering tasks:", tasks);
            const tasklist = document.getElementById("task-container");
            tasklist.innerHTML = "";
            tasks.forEach(task => {
                const createdDate = new Date(task.createdAt).toLocaleString("es-CO", { timeZone: "America/Bogota" });
                const updatedDate = new Date(task.updatedAt).toLocaleString("es-CO", { timeZone: "America/Bogota" });
                const taskItem = document.createElement("div");
                taskItem.className = "task-item";
                taskItem.innerHTML = `
                    <input type="checkbox" ${task.done ? "checked" : ""} data-id="${task.id}" class="task-checkbox">
                    <span class="${task.done ? "task-done" : ""}">${task.text}</span>
                    <button data-id="${task.id}" class="delete-button">Delete</button>
                    <div class="task-dates">
                        <span class="task-created">Created: ${createdDate}</span>
                        <span class="task-updated">Updated: ${updatedDate}</span>
                    </div>
                `;
                tasklist.appendChild(taskItem);
            });
        }

    function deleteTask(id) {
        let tasks = getTasks();
        tasks = tasks.filter(task => task.id !== id);
        saveTasks(tasks);
        renderTaks();
    }


    //Detección de eventos en botones eliminar
    document.getElementById("task-container").addEventListener("click", (e) => {
    if (e.target.classList.contains("delete-button")) {
        const id = parseInt(e.target.getAttribute("data-id"));
        deleteTask(id);
    }
    });

    document.getElementById("task-container").addEventListener("change", (e) => {
    if (e.target.classList.contains("task-checkbox")) {
        const id = parseInt(e.target.getAttribute("data-id"));
        const tasks = getTasks();
        const task = tasks.find(t => t.id === id);
        if (task) {
            task.done = e.target.checked;
            task.updatedAt = Date.now();
            saveTasks(tasks);
            renderTaks();
        }
    }
    });

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
            createdAt: Date.now(),
            updatedAt: Date.now()
        }

       const tasks = getTasks();
        tasks.push(task);
        saveTasks(tasks);
        console.log("Task added:", task);
        console.log("All tasks:", tasks);

        console.log("Tarea agregada correctamente.");
        todoInput.value = "";

        
        renderTaks();
    })
    renderTaks();
})
