// TODO: Remove the 'next exercise' button for the timed exercises
// TODO: Add a confirm screen for the home button during workouts
// TODO: When restart is pressed should that time be added to the previous break or the exercise?

// ----- Buttons -----
const beginWorkoutButton = document.getElementById("beginWorkout");
const addWorkoutButton = document.getElementById("addWorkout");
const navButtons = document.querySelector(".navBar");
const backButton = document.getElementById("backButton");
const homeButton = document.getElementById("homeButton");
const fromScratchButton = document.getElementById("fromScratch");
const createExerciseButton = document.getElementById("createExercise");
const addExerciseButton = document.getElementById("addExercise");
const saveButton = document.getElementById("saveButton");
const submitWorkoutButton = document.getElementById("submitWorkout");
const editExistingButton = document.getElementById("editExisting");
const nextExerciseButton = document.getElementById("nextExerciseButton");
const restartButton = document.getElementById("restartButton");

// ----- Screens -----
const titleScreen = document.getElementById("titleScreen");
const selectWorkoutScreen = document.getElementById("selectWorkoutScreen");
const createWorkoutScreen = document.getElementById("createWorkoutScreen");
const editWorkoutScreen = document.getElementById("editWorkoutScreen");
const addExerciseScreen = document.getElementById("addExerciseScreen");
const addWorkoutScreen = document.getElementById("addWorkoutScreen");
const editExistingWorkoutScreen = document.getElementById("editExistingWorkoutScreen");
const workoutScreen = document.getElementById("workoutScreen");

// ----- Other HTML elements -----
const exerciseNameInput = document.getElementById("exerciseNameInput");
const exerciseTimeInput = document.getElementById("exerciseTimeInput");
const workoutName = document.getElementById("workoutName")
const exercisesEditor = document.getElementById("exercisesEditor");
const beginWorkoutList = document.getElementById("beginWorkoutList");
const editWorkoutList = document.getElementById("editWorkoutList");
const untimedExerciseContainer = document.getElementById("untimedExerciseContainer");
const timedExerciseContainer = document.getElementById("timedExerciseContainer");
const progressBarFill = document.getElementById("progressBarFill");

const prevExerciseText = document.getElementById("prevExerciseText");
const nextExerciseText = document.getElementById("nextExerciseText");
const currExerciseText = document.getElementById("currExercise");
const bestTimeText = document.getElementById("bestTime");
const currExerciseTimeText = document.getElementById("currExerciseTime");

// ----- Variables -----
let newWorkout = 
{
    name: "",
    exercises: []
}; // To be filled with the exercises. When saved the first element will be the workout name
let currWorkout;
let workoutList = []; // To be filled with the workouts (current is the first in the list, new get added to front)
let editExerciseIndex = -1; // Index relating to the exercise being editted. -1 if not relating to any exercise

// Main timer
const mainTime = document.getElementById("mainTime");
let mainStartTime;
let mainElapsedTime;
let mainTimerInterval;

// Exercise timer
const exerciseTime = document.getElementById("exerciseTime");
let exerciseStartTime;
let exerciseElapsedTime;
let exerciseTimerInterval;

// ----- Functions -----
function initialise()
{
    // TODO: JSON stuff goes here prob
    if (workoutList.length === 0)
    {
        beginWorkoutButton.classList.add("grey");
        editExistingButton.classList.add("grey");
    }
}
initialise();

function switchPage(newPage)
{
    const currPage = document.querySelector(".active");
    currPage.classList.replace("active", "inactive");
    newPage.classList.replace("inactive", "active");

    if (newPage == titleScreen || newPage == workoutScreen) 
    {
        navButtons.classList.add("inactive");
    }
    else
    {
        navButtons.classList.remove("inactive");
    }
}

function addExercise()
{
    const exercise = exerciseNameInput.value;
    const time = exerciseTimeInput.value;
    if (!exerciseNameInput.value) {return}

    if (!exerciseTimeInput.value)
    {
        if (editExerciseIndex != -1)
        {
            newWorkout.exercises[editExerciseIndex] = 
            {
                name: exercise,
                time: 0
            };
        }
        else
        {
            newWorkout.exercises.push({
                name: exercise,
                time: 0
            });
        }
    }
    else if (!isNaN(time) && Number(time) >= 0)
    {
        if (editExerciseIndex != -1)
        {
            newWorkout.exercises[editExerciseIndex] = 
            {
                name: exercise,
                time: Number(time)
            }
        }
        else
        {
            newWorkout.exercises.push({
                name: exercise,
                time: Number(time)
            });
        }
    }

    if (newWorkout.exercises.length > 0)
    {
        saveButton.classList.remove("grey");
    }

    editExerciseIndex = -1;
    updateUI();

    exerciseNameInput.value = '';
    exerciseTimeInput.value = '';
}

function editExercise(index)
{
    editExerciseIndex = index;
    switchPage(addExerciseScreen);
    exerciseNameInput.value = newWorkout.exercises[index].name;
    exerciseTimeInput.value = newWorkout.exercises[index].time;
}

function moveExerciseDown(index)
{
    if (index < newWorkout.exercises.length - 1)
    {
        [newWorkout.exercises[index], newWorkout.exercises[index + 1]] = [newWorkout.exercises[index + 1], newWorkout.exercises[index]];
    }

    updateUI();
}

function deleteExercise(index)
{
    newWorkout.exercises = newWorkout.exercises.filter((element, elementIndex) => {
        if (index === elementIndex) {return false}
        return true;
    })

    if (newWorkout.exercises.length === 0)
    {
        saveButton.classList.add("grey");
    }

    updateUI();
}

function editExistingWorkout(index)
{
    newWorkout = createEmptyWorkout();
    newWorkout.exercises = JSON.parse(JSON.stringify(workoutList[index].exercises));
    saveButton.classList.remove("grey");
    updateUI();
    switchPage(editWorkoutScreen);
}

function createEmptyWorkout()
{
    return {
        name: "",
        exercises: []
    };
}

function beginWorkout(index)
{
    currWorkout = JSON.parse(JSON.stringify(workoutList[index]));
    currWorkout.index = -1;
    currWorkout.exercises.push({name: 'Stretches', time: 0});
    for (let i = 0; i < currWorkout.exercises.length - 1; i += 2)
    {
        currWorkout.exercises.splice(i + 1, 0, {name: "Break", time: 0});
    }

    mainTime.textContent = `00:00.000`;
    prevExerciseText.textContent = `None`;
    nextExerciseText.textContent = `${currWorkout.exercises[0].name}`;

    switchPage(workoutScreen);
}

function resetWorkout()
{
    clearInterval(mainTimerInterval);
    clearInterval(exerciseTimerInterval);

    mainStartTime = undefined;
    mainElapsedTime = 0;

    exerciseStartTime = undefined;
    exerciseElapsedTime = 0;

    currWorkout = undefined;

    mainTime.textContent = "00:00.000";
    exerciseTime.textContent = "";
    untimedExerciseContainer.classList.add("inactive");
    timedExerciseContainer.classList.add("inactive");
    progressBarFill.style.width = "0%";
    restartButton.classList.add("inactive");
    currExerciseText.textContent = "";
    prevExerciseText.textContent = "";
    nextExerciseText.textContent = "";
    nextExerciseButton.textContent = "Start";
}

function goToExercise(index)
{
    currWorkout.index = index;
    untimedExerciseContainer.classList.add("inactive");
    timedExerciseContainer.classList.add("inactive");

    let next;
    let prev;
    let nextText;

    exerciseStartTime = Date.now();

    if (index === 0)
    {
        prev = `None`;
        restartButton.classList.remove("inactive");

        mainStartTime = Date.now();

        mainTimerInterval = setInterval(function printMainTime() {
            mainElapsedTime = Date.now() - mainStartTime;
            mainTime.textContent = formatTime(mainElapsedTime);
        }, 20);

        exerciseTimerInterval = setInterval(function printExerciseTime() {
            exerciseElapsedTime = Date.now() - exerciseStartTime;
            exerciseTime.textContent = formatTime(exerciseElapsedTime);

            if (currWorkout.exercises[currWorkout.index].time > 0)
            {
                const progress = Math.min(exerciseElapsedTime / (currWorkout.exercises[currWorkout.index].time * 1000), 1);
                console.log(progress);
                progressBarFill.style.width = `${progress * 100}%`;
                if (progress >= 1) 
                {
                    handleNextExerciseButton();
                }
            }
        }, 20);
    }
    else
    {
        prev = currWorkout.exercises[index-1].name;
    }    

    if (currWorkout.exercises.length - 1 === index)
    {
        next = `None`;
        nextText = `Finish`;
    }
    else
    {
        if (index % 2 === 0)
        {
            next = currWorkout.exercises[index+2].name;
            restartButton.classList.remove("inactive");
            if (currWorkout.exercises[index].time === 0) 
            {
                untimedExerciseContainer.classList.remove("inactive");
                // TODO: bestTime logic here
                bestTimeText.textContent = `N/A`;
            }
            else 
            {
                timedExerciseContainer.classList.remove("inactive");
                currExerciseTimeText.textContent = `${currWorkout.exercises[index].time} seconds`;
            }
        }
        else
        {
            next = currWorkout.exercises[index+1].name;
            restartButton.classList.add("inactive");
        }
        nextText = `Next`;
    }

    currExerciseText.textContent = `${currWorkout.exercises[index].name}`;
    nextExerciseButton.textContent = `${nextText}`;
    prevExerciseText.textContent = `${prev}`;
    nextExerciseText.textContent = `${next}`;
}

function endWorkout()
{
    // Stop timer logic
    currExerciseText.textContent = `Workout Complete!`;
}

function formatTime(milliseconds)
{
    const minutes = Math.floor(milliseconds / 60000);
    milliseconds %= 60000;
    const seconds = Math.floor(milliseconds / 1000);
    milliseconds %= 1000;

    const format = (num) => num.toString().padStart(2, '0');

    return `${format(minutes)}:${format(seconds)}.${format(milliseconds.toString().padStart(3, '0'))}`;
}

function updateUI()
{
    let newInnerHTML = '';

    newWorkout.exercises.forEach((workoutElement, elementIndex) => {
        newInnerHTML += `
        <section>
            <button class="exerciseButton" onclick="editExercise(${elementIndex})">
                <p>${workoutElement.name}</p>
            </button>

            <button class="moveDown" onclick="moveExerciseDown(${elementIndex})">
                <i class="fa-solid fa-arrow-down"></i>
            </button>

            <button class="delete" onclick="deleteExercise(${elementIndex})">
                <i class="fa-solid fa-trash-can"></i>
            </button>
        </section>
        `
    })

    exercisesEditor.innerHTML = newInnerHTML;

    newInnerHTML = '';

    workoutList.forEach((element, elementIndex) => {
        newInnerHTML += `
        <section>
            <button class="normalButton beginWorkout" onclick="beginWorkout(${elementIndex})">
                <p>${element.name}</p>
            </button>
        </section>
        `
    })

    beginWorkoutList.innerHTML = newInnerHTML;

    newInnerHTML = '';

    workoutList.forEach((element, elementIndex) => {
        newInnerHTML += `
        <section>
            <button class="normalButton editWorkout" onclick="editExistingWorkout(${elementIndex})">
                <p>${element.name}</p>
            </button>
        </section>
        `
    })

    editWorkoutList.innerHTML = newInnerHTML;
}

// ----- Handle Buttons Presses -----
function handleBackButton()
{
    const currPage = document.querySelector(".active");

    if (currPage == selectWorkoutScreen || currPage == createWorkoutScreen)
    {
        switchPage(titleScreen);
    }
    else if (currPage == editWorkoutScreen || currPage == editExistingWorkoutScreen)
    {
        switchPage(createWorkoutScreen);
    }
    else if (currPage == addExerciseScreen || currPage == addWorkoutScreen)
    {
        editExerciseIndex = -1;
        switchPage(editWorkoutScreen);
    }
}
backButton.addEventListener('click', handleBackButton);

function handleHomeButton()
{
    resetWorkout();
    switchPage(titleScreen);
}
homeButton.addEventListener('click', handleHomeButton);

function handleBeginWorkoutButton()
{
    if (workoutList.length > 0)
    {
    switchPage(selectWorkoutScreen);
    }
}
beginWorkoutButton.addEventListener('click', handleBeginWorkoutButton);

function handleAddWorkoutButton()
{
    switchPage(createWorkoutScreen);
}
addWorkoutButton.addEventListener('click', handleAddWorkoutButton);

function handleFromScratchButton()
{
    newWorkout = createEmptyWorkout();
    saveButton.classList.add("grey");
    updateUI();
    switchPage(editWorkoutScreen);
}
fromScratchButton.addEventListener('click', handleFromScratchButton);

function handleCreateExerciseButton()
{
    switchPage(addExerciseScreen);
}
createExerciseButton.addEventListener('click', handleCreateExerciseButton);

function handleAddExerciseButton()
{
    addExercise();
    switchPage(editWorkoutScreen);
}
addExerciseButton.addEventListener('click', handleAddExerciseButton);

function handleSaveButton()
{
    if (newWorkout.exercises.length > 0)
    {
    switchPage(addWorkoutScreen);
    }
}
saveButton.addEventListener('click', handleSaveButton);

function handleSubmitWorkoutButton()
{
    if (!workoutName.value) {return}
    newWorkout.name = workoutName.value;
    workoutList.unshift(JSON.parse(JSON.stringify(newWorkout)));
    switchPage(titleScreen);
    newWorkout = createEmptyWorkout();
    beginWorkoutButton.classList.remove("grey");
    editExistingButton.classList.remove("grey");
    workoutName.value = '';
    updateUI();
}
submitWorkoutButton.addEventListener('click', handleSubmitWorkoutButton);

function handleEditExistingButton()
{
    if (workoutList.length > 0)
    {
        switchPage(editExistingWorkoutScreen);
    }
}
editExistingButton.addEventListener('click', handleEditExistingButton);

function handleNextExerciseButton()
{
    if (currWorkout.index === currWorkout.exercises.length - 1)
    {
        endWorkout(); //TODO: Might be just switching to an endWorkoutScreen?
    }
    else
    {
        goToExercise(currWorkout.index + 1);
    }
}
nextExerciseButton.addEventListener('click', handleNextExerciseButton);

function handleRestartButton()
{
    exerciseStartTime = Date.now();
}
restartButton.addEventListener('click', handleRestartButton);

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js")
    .then(() => console.log("Service Worker Registered"));
}
