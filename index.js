/*
{
id: number,
text: string,
done: boolean,
createdAt: number,
updatedAt: number
}
*/

async function getApiData() {
    try {
        const response = await fetch("https://dummyjson.com/c/28e8-a101-4223-a35c");
        const data = await response.json();
        console.log("API response:", data);

        return data
    } catch (error) {
        console.error("Error al consultar la API:", error);
    }
}


document.addEventListener("DOMContentLoaded",  async ()  => {
    
    const taskButton = document.getElementById("task-button");
    const fetchButton = document.getElementById("fetch-button");    

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

    function checkApiId(apiTasks) {
        const localTasks = getTasks();
        const localIds = localTasks.map(task => task.id);

        let nextId = localIds.length > 0 ? Math.max(...localIds) + 1 : 1;

        return apiTasks.map(apiTask => {
            if (localIds.includes(apiTask.id)) {
                apiTask.id = nextId++;
            }
            return apiTask;
        });
    }

    function mergeTasks(apiTasks) {
        const localTasks = getTasks();
        const mergedTasks = [...localTasks];
        apiTasks.forEach(apiTask => {
            if (!localTasks.find(task => task.id === apiTask.id)) {
                mergedTasks.push(apiTask);
            }
        });
        saveTasks(mergedTasks);
        renderTaks();
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
                    <input type="text" value="${task.text}" data-id="${task.id}" class="task-edit-input ${task.done ? "task-done" : ""}">
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
    // Editar texto
    if (e.target.classList.contains("task-edit-input")) {
        const id = parseInt(e.target.getAttribute("data-id"));
        const newText = e.target.value.trim();
        const tasks = getTasks();

        // Validaciones
        if (newText === "") {
            alert("El texto no puede estar vacío.");
            renderTaks();
            return;
        }
        if (newText.length < 10) {
            alert("La tarea debe tener mínimo 10 caracteres.");
            renderTaks();
            return;
        }
        if (/^\d+$/.test(newText)) {
            alert("La tarea no puede ser solo números.");
            renderTaks();
            return;
        }
        if (tasks.find(t => t.text.trim().toLowerCase() === newText.toLowerCase() && t.id !== id)) {
            alert("La tarea ya existe.");
            renderTaks();
            return;
        }

        const task = tasks.find(t => t.id === id);
        if (task) {
            task.text = newText;
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

        if (todoText.length < 10) {
        alert("La tarea debe tener mínimo 10 caracteres.");
        return;
        }

        if (/^\d+$/.test(todoText)) {
        alert("La tarea no puede ser solo números.");
        return;
    }


        console.log("Task to add:", todoText);

        const task = {
            id: getNextId(),
            text:todoText.trim(),
            done: false,
            createdAt: Date.now(),
            updatedAt: Date.now()
        }

       const tasks = getTasks();

       if (tasks.find(t => t.text.trim().toLowerCase() === todoText.trim().toLowerCase())) {
            alert("Task already exists.");
            return;
        }   

        tasks.push(task);
        saveTasks(tasks);
        console.log("Task added:", task);
        console.log("All tasks:", tasks);

        console.log("Tarea agregada correctamente.");
        todoInput.value = "";

        
        renderTaks();
    })

    fetchButton.addEventListener("click",  async (e) => {
        e.preventDefault();
        const apiTasks = await getApiData();
        const newApiData = checkApiId(apiTasks);
        console.log("API Tasks:", apiTasks);
        mergeTasks(newApiData);
    })
    renderTaks();
})
