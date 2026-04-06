const input = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const list = document.getElementById("taskList");
const priorityInput = document.getElementById("priority");
const dueDateInput = document.getElementById("dueDate");

const totalEl = document.getElementById("total");
const completedEl = document.getElementById("completed");
const pendingEl = document.getElementById("pending");

const emptyMessage = document.getElementById("emptyMessage");

let filter="all";

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks(){
localStorage.setItem("tasks",JSON.stringify(tasks));
}

function renderTasks(){

list.innerHTML="";

let filteredTasks = tasks.filter(task=>{
if(filter==="active") return !task.completed;
if(filter==="completed") return task.completed;
return true;
});

if(filteredTasks.length===0){
emptyMessage.style.display="block";
}else{
emptyMessage.style.display="none";
}

filteredTasks.forEach(task=>{

const li=document.createElement("li");

li.classList.add(task.priority);

if(task.completed){
li.classList.add("completed");
}

if(task.dueDate){
let today=new Date().toISOString().split("T")[0];
if(today>task.dueDate && !task.completed){
li.classList.add("overdue");
}
}

li.innerHTML=`
<span>${task.text} (Due: ${task.dueDate||"None"})</span>
<div>
<button onclick="toggleTask(${task.id})">✔</button>
<button onclick="deleteTask(${task.id})">❌</button>
</div>
`;

list.appendChild(li);

});

updateStats();

}

function updateStats(){

let total=tasks.length;
let completed=tasks.filter(t=>t.completed).length;
let pending=total-completed;

totalEl.textContent="Total: "+total;
completedEl.textContent="Completed: "+completed;
pendingEl.textContent="Pending: "+pending;

}

function addTask(){

let text=input.value.trim();

if(text==="") return;

tasks.push({
id:Date.now(),
text:text,
priority:priorityInput.value,
dueDate:dueDateInput.value,
completed:false
});

input.value="";
dueDateInput.value="";

saveTasks();
renderTasks();

}

addBtn.addEventListener("click",addTask);

input.addEventListener("keypress",e=>{
if(e.key==="Enter") addTask();
});

function deleteTask(id){

tasks=tasks.filter(task=>task.id!==id);

saveTasks();
renderTasks();

}

function toggleTask(id){

tasks=tasks.map(task=>{
if(task.id===id){
task.completed=!task.completed;
}
return task;
});

saveTasks();
renderTasks();

}

document.querySelectorAll(".filters button").forEach(btn=>{
btn.addEventListener("click",()=>{
filter=btn.dataset.filter;
renderTasks();
});
});

document.getElementById("darkToggle").addEventListener("click",()=>{
document.body.classList.toggle("dark-mode");
});

renderTasks();
const themes=["theme-blue","theme-green","theme-orange","theme-dark"];
let themeIndex=0;

document.getElementById("themeSwitcher").addEventListener("click",()=>{

document.body.classList.remove(...themes);

themeIndex=(themeIndex+1)%themes.length;

document.body.classList.add(themes[themeIndex]);

});