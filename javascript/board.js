/*
let todos = [{
    'id': 0,
    'tasktype': 'User Story',
    'taskcolor': 'aquamarine',
    'title': 'In progress',
    'description': 'Create a contact form and imprint page...',
    'subtasks': 2,
    'category': 'in-progress'
}, {
    'id': 1,
    'tasktype': 'Technical Task',
    'taskcolor': 'aquamarine',
    'title': 'done',
    'description': 'Create a contact form and imprint page...',
    'subtasks': 2,
    'category': 'done'
}, {
    'id': 2,
    'tasktype': 'User Story',
    'taskcolor': 'aquamarine',
    'title': 'To do',
    'description': 'Create a contact form and imprint page...',
    'subtasks': 2,
    'category': 'todo'
}, {
    'id': 3,
    'tasktype': 'Technical Task',
    'taskcolor': 'aquamarine',
    'title': 'Await feedback',
    'description': 'Create a contact form and imprint page...',
    'subtasks': 2,
    'category': 'await-feedback'
}]
*/


let currentDraggedTask;


function openAddTask() {
    let container = document.getElementById('add-task-popup');
    container.classList.remove('slide-out');
    container.classList.remove('d-none');
    container.innerHTML = `
    <div class="padding-top">
    <div class="popup-headline">
        <h1>Add Task</h1>
        <div class="close-popup">
            <img onclick="closeAddTask()" src="assets/img/add_task/close.svg">
        </div>
    </div>
    <div class="add-task-section">

        <div class="add-task-titel-container">
            <form action="">
            <p>Titel<span class="color-red">*</span></p>
            <input required class="margin-buttom" type="text" placeholder="Enter a title">
            <p>Description</p>
            <textarea class="margin-buttom" name="" id="" placeholder="Enter a Description"></textarea>
            <p>Assigned to</p>
            <div class="custom-select" style="width:100%;">
                <select>
                  <option value="0">Select car:</option>
                  <option class="assigned-conainer" value="1">
                <div class="assigned-circle-name">SM</div>
                 <p>Sofia Müller</p>
                 
                  </option>
                </select>
              </div>
        </div>

        <div class="add-task-between-line"></div>

        <div class="add-task-date-container">
            <p>Due date<span class="color-red">*</span></p>
            <input required class="margin-buttom" type="date">
            <p>Prio</p>
            <div class="margin-buttom add-task-prio prio-gap">
                <div class="prio-selection-urgent">
                    <span>Urgent</span> 
                    <img class="prio-icons" src="./assets/img/add_task/arrowsTop.svg">
                </div>
                <div class="prio-selection-medium">
                    <span>Medium</span> 
                    <img class="prio-icons" src="./assets/img/add_task/result.svg">
                </div>
                <div class="prio-selection-low">
                    <span>Low</span> 
                    <img class="prio-icons" src="./assets/img/add_task/arrowsButtom.svg">
                </div>
            </div>
            <p>Category<span class="color-red">*</span></p>
            <div class="custom-select" style="width:100%;">
                <select>
                  <option value="0">Select car:</option>
                  <option value="1">Audi</option>
                  <option value="2">BMW</option>
                </select>
              </div>
            <p>Subtasks</p>
            <input type="text" name="" id="">
        </div>

    </div>

    <div class="add-task-buttons">
        <p class="required-text"><span class="color-red">*</span>This field is required</p>
        <div class="popup-buttons">
            <button onclick="cancelAddTask()" class="clear-button">Cancel <img src="assets/img/add_task/close.svg"></button>
            <button class="btn" onsubmit="">Create Task <img src="assets/img/add_task/check.svg"></button>
        </div>
    </div>
</form>
`;
}

function closeAddTask() {
    let container = document.getElementById('add-task-popup');
    container.classList.add('d-none');
}

function cancelAddTask() {
    let popup = document.getElementById('add-task-popup');
    popup.classList.add('slide-out');
    popup.addEventListener('transitionend', function () { // sobald die animation fertig ist, wird der task geschlossen
        closeAddTask();
    }, { once: true });
}


function generateTodoHTML(element, i) {
    return /*html*/`
    <div draggable="true" ondragstart="startDragging(${i})" class="todo">
        <div class="task-card" onclick="openDialogTask(${i})">
            <div class="task-card-type">
                <div class="type-bg" style="background-color: ${element['taskcolor']};">${element['taskCategory']}</div>
            </div>
            <h2>${element['title']}</h2>
            <p class="task-description">${element['description']}</p>
            <div class="progress">
                <div class="progress-bar"></div>
                    ${element['subtasks']} Subtasks
            </div>
            <div class="task-card-bottom">
                <div class="taskContacts" id="taskContacts${i}">
            
                </div>
                <img src="assets/img/Vector.svg">
            </div>
        </div>
    </div>
    `;
}


function openDialogTask(i) {
    let task = tasks[i];
    console.log("dialog Fenster öffnet sich.")
    document.getElementById('dialog').classList.remove('d_none');
    showTaskDetails(task);
}


function showTaskDetails(task) {
    let taskDetails = document.getElementById('taskDetails');
    taskDetails.innerHTML ='';
    taskDetails.innerHTML = generateTaskDetails(task);
}


function generateTaskDetails(task) {
    return /*html*/`
    <div id="taskDetails">
        <div class="task-card-type">
             <div class="type-bg">${task['taskCategory']}</div> <!-- style="background-color: ${task['taskcolor']};"-->
        </div>
        <div class="header_task_details">
            <h1>${task['title']}</h1>
            <p class="task-description">${task['description']}</p>
        </div>
        <div class="task_details_information">
            <div>
                <p>Due date:</p><p>${task['date']}</p>
            </div>
            <div>
                <p>Priority</p><img src="${task['prioImg']}" alt="">
            </div>
            <div>
                <p>Assigned To:</p><p>${task['taskContacts']}</p>
            </div>
            <div>
                <p>Subtasks</p>
                <p>${task['subtasks']}</p>
            </div>
            <footer class="details_delete_edit">
                <img src="../assets/img/delete.svg" alt="">
                <p>Delete</p>|
                <img src="../assets/img/edit.svg" alt="">
                <p>Edit</p>
            </footer>
        </div>
    </div>
    `;
}

function upadeteTodo() {
    let todo = tasks.filter(t => t['category'] == 'todo');

    document.getElementById('todo').innerHTML = '';

    for (let i = 0; i < todo.length; i++) {
        const todoElement = todo[i];
        document.getElementById('todo').innerHTML += generateTodoHTML(todoElement);
    }
}


function updateInProgress() {
    let inProgress = tasks.filter(t => t['category'] == 'in-progress');

    document.getElementById('in-progress').innerHTML = '';

    for (let i = 0; i < inProgress.length; i++) {
        const inProgressElement = inProgress[i];
        document.getElementById('in-progress').innerHTML += generateTodoHTML(inProgressElement);
    }
}


function updateAwaitFeedback() {
    let awaitFeedback = tasks.filter(t => t['category'] == 'await-feedback');

    document.getElementById('await-feedback').innerHTML = '';

    for (let i = 0; i < awaitFeedback.length; i++) {
        const awaitFeedbackElement = awaitFeedback[i];
        document.getElementById('await-feedback').innerHTML += generateTodoHTML(awaitFeedbackElement);
    }
}


function updateDone() {
    let done = tasks.filter(t => t['category'] == 'done');

    document.getElementById('done').innerHTML = '';

    for (let i = 0; i < done.length; i++) {
        const doneElement = done[i];
        document.getElementById('done').innerHTML += generateTodoHTML(doneElement);
    }
}


function startDragging(i) {
    currentDraggedTask = i;
}


function updateHTML() {
    upadeteTodo();
    updateInProgress();
    updateAwaitFeedback();
    updateDone();
    console.log(todos);
}


function allowDrop(ev) {
    ev.preventDefault();
}


function moveTo(category) {
    tasks[currentDraggedTask]['category'] = category;
    updateHTML();
}


function highlight(id) {
    document.getElementById(id).classList.add('drag_area_hightlight');
}


function removeHighlight(id) {
    document.getElementById(id).classList.remove('drag_area_hightlight');
}


function closeDialogTask() {
    document.getElementById('dialog').classList.add('d_none');
}
