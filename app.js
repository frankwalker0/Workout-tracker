// TODO: Add splits to the workout screen

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
const saveWorkoutTimesButton = document.getElementById("saveWorkoutTimesButton");
const viewStatsButton = document.getElementById("viewStatsButton");

// ----- Screens -----
const titleScreen = document.getElementById("titleScreen");
const selectWorkoutScreen = document.getElementById("selectWorkoutScreen");
const createWorkoutScreen = document.getElementById("createWorkoutScreen");
const editWorkoutScreen = document.getElementById("editWorkoutScreen");
const addExerciseScreen = document.getElementById("addExerciseScreen");
const addWorkoutScreen = document.getElementById("addWorkoutScreen");
const editExistingWorkoutScreen = document.getElementById("editExistingWorkoutScreen");
const workoutScreen = document.getElementById("workoutScreen");
const endWorkoutScreen = document.getElementById("endWorkoutScreen");
const viewStatsScreen = document.getElementById("viewStatsScreen");
const workoutStatsScreen = document.getElementById("workoutStatsScreen");

// ----- Other HTML elements -----
const exerciseNameInput = document.getElementById("exerciseNameInput");
const exerciseTimeInput = document.getElementById("exerciseTimeInput");
const exerciseRepInput = document.getElementById("exerciseRepInput");
const workoutName = document.getElementById("workoutName")
const exercisesEditor = document.getElementById("exercisesEditor");
const beginWorkoutList = document.getElementById("beginWorkoutList");
const editWorkoutList = document.getElementById("editWorkoutList");
const untimedExerciseContainer = document.getElementById("untimedExerciseContainer");
const timedExerciseContainer = document.getElementById("timedExerciseContainer");
const progressBarFill = document.getElementById("progressBarFill");
const finishedWorkoutTimesContainer = document.getElementById("finishedWorkoutTimesContainer");
const statsWorkoutList = document.getElementById("statsWorkoutList");
const allWorkoutStats = document.getElementById("allWorkoutStats");
const wholeWorkoutStats = document.getElementById("wholeWorkoutStats");
const exerciseTotalStats = document.getElementById("exerciseTotalStats");
const exerciseAverageStats = document.getElementById("exerciseAverageStats");
const exerciseBestStats = document.getElementById("exerciseBestStats");
const exerciseTotalReps = document.getElementById("exerciseTotalReps");

const prevExerciseText = document.getElementById("prevExerciseText");
const nextExerciseText = document.getElementById("nextExerciseText");
const currExerciseText = document.getElementById("currExercise");
const bestTimeText = document.getElementById("bestTime");
const currExerciseTimeText = document.getElementById("currExerciseTime");
const finishedWorkoutTime = document.getElementById("finishedWorkoutTime");
const workoutStatsName = document.getElementById("workoutStatsName");

const exerciseAudio = document.getElementById("exerciseAudio");

// ----- Variables -----
let newWorkout = 
{
    name: "",
    exercises: [],
    stats: [],
    bestTimes: [],
    firstWorkoutDate: undefined
}; // To be filled with the exercises. When saved the first element will be the workout name
let currWorkout;
let editExerciseIndex = -1; // Index relating to the exercise being editted. -1 if not relating to any exercise

let workoutList = JSON.parse(localStorage.getItem("workoutList")) || [];
workoutList.forEach(workout => {
    if (workout.firstWorkoutDate) {
        workout.firstWorkoutDate = new Date(workout.firstWorkoutDate);
    }
});

let totalTime = 0;
let exerciseTotalTime = 0;
let breakTotalTime = 0;
let stretchTotalTime = 0;
let workoutsCompleted = 0;

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
    if (workoutList.length === 0)
    {
        beginWorkoutButton.classList.add("grey");
        editExistingButton.classList.add("grey");
    }

    for (let i = 0; i < workoutList.length; i++)
    {
        let workout = JSON.parse(JSON.stringify(workoutList[i]));
        workout.exercises.push({name: "Stretches", time: 0, reps: 0});
        for (let i = 0; i < workout.exercises.length - 1; i += 2)
        {
            workout.exercises.splice(i + 1, 0, {name: "Break", time: 0, reps: 0});
        }

        for (let j = 0; j < workout.stats.length; j++)
        {
            workoutsCompleted++;

            for (let k = 0; k < workout.stats[j].length; k++)
            {
                totalTime += workout.stats[j][k];

                if (workout.exercises[k].name === "Break")
                {
                    breakTotalTime += workout.stats[j][k];
                }
                else if (workout.exercises[k].name === "Stretches")
                {
                    stretchTotalTime += workout.stats[j][k];
                }
                else
                {
                    exerciseTotalTime += workout.stats[j][k];
                }
            }
        }
    }
    if (workoutsCompleted === 0)
    {
        viewStatsButton.classList.add("grey");
    }
}
initialise();

function saveWorkouts() {
    localStorage.setItem("workoutList", JSON.stringify(workoutList));
}

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
    updateUI();
}

function addExercise()
{
    const exercise = exerciseNameInput.value;
    let time = exerciseTimeInput.value;
    let reps = exerciseRepInput.value;

    if (!exerciseTimeInput.value)
    {
        time = 0;
    }
    if (!exerciseRepInput.value)
    {
        reps = 0;
    }

    if (!exerciseNameInput.value) {return}
    if (isNaN(Number(time)) || Number(time) < 0) {return}
    if (isNaN(Number(reps)) || Number(reps) < 0) {return}

    if (editExerciseIndex != -1)
    {
        newWorkout.exercises[editExerciseIndex] =
        {
            name: exercise,
            time: Number(time),
            reps: Number(reps)
        };
    }
    else
    {
        newWorkout.exercises.push({
            name: exercise,
            time: Number(time),
            reps: Number(reps)
        });
    }

    if (newWorkout.exercises.length > 0)
    {
        saveButton.classList.remove("grey");
    }

    editExerciseIndex = -1;
    updateUI();

    exerciseNameInput.value = '';
    exerciseTimeInput.value = '';
    exerciseRepInput.value = '';
}

function editExercise(index)
{
    editExerciseIndex = index;
    switchPage(addExerciseScreen);
    exerciseNameInput.value = newWorkout.exercises[index].name;
    exerciseTimeInput.value = newWorkout.exercises[index].time;
    exerciseRepInput.value = newWorkout.exercises[index].reps;
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
        exercises: [],
        stats: [],
        bestTimes: [],
        firstWorkoutDate: undefined
    };
}

function beginWorkout(index)
{
    currWorkout = JSON.parse(JSON.stringify(workoutList[index]));
    currWorkout.index = -1;
    currWorkout.exercises.push({name: "Stretches", time: 0, reps: 0});
    for (let i = 0; i < currWorkout.exercises.length - 1; i += 2)
    {
        currWorkout.exercises.splice(i + 1, 0, {name: "Break", time: 0, reps: 0});
    }
    currWorkout.times = [];
    currWorkout.workoutListIndex = index;

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
    nextExerciseButton.classList.remove("grey");
    nextExerciseButton.addEventListener('click', handleNextExerciseButton);
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

    // From ChatGPT
    if (currWorkout.exercises[index].name === "Bring Sally up") {
        exerciseAudio.currentTime = 0;
        exerciseAudio.play();
    } else {
        exerciseAudio.pause();
        exerciseAudio.currentTime = 0;
    }

    if (currWorkout.exercises[index].time > 0)
    {
        nextExerciseButton.classList.add("grey");
        nextExerciseButton.removeEventListener('click', handleNextExerciseButton);
    }

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
                progressBarFill.style.width = `${progress * 100}%`;
                if (progress >= 1) 
                {
                    nextExerciseButton.classList.remove("grey");
                    nextExerciseButton.addEventListener('click', handleNextExerciseButton);
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
                if (currWorkout.bestTimes.length > 0)
                {
                    bestTimeText.textContent = currWorkout.bestTimes[index];
                }
                else
                {
                    bestTimeText.textContent = `N/A`;
                }
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

    if (currWorkout.exercises[index].reps > 0 && currWorkout.exercises[index].name !== "Bring Sally up")
    {
        currExerciseText.textContent = `${currWorkout.exercises[index].reps} ${currWorkout.exercises[index].name}`;
    }
    else
    {
        currExerciseText.textContent = `${currWorkout.exercises[index].name}`;
    }

    nextExerciseButton.textContent = `${nextText}`;
    prevExerciseText.textContent = `${prev}`;
    nextExerciseText.textContent = `${next}`;
}

function endWorkout()
{   
    let newInnerHTML = ``;

    finishedWorkoutTime.textContent = formatTime(Date.now() - mainStartTime);
    switchPage(endWorkoutScreen);

    for (let i = 0; i < currWorkout.times.length; i++)
    {
        newInnerHTML += `
        <div>
            <h3>${currWorkout.exercises[i].name}:</h3>
            <h4>${currWorkout.times[i]}</h4>
        </div>
        `;
    }

    finishedWorkoutTimesContainer.innerHTML = newInnerHTML;
}

function showWorkoutStats(index)
{
    switchPage(workoutStatsScreen);

    let workout = JSON.parse(JSON.stringify(workoutList[index]));
    workout.exercises.push({name: "Stretches", time: 0, reps: 0});
    for (let i = 0; i < workout.exercises.length - 1; i += 2)
    {
        workout.exercises.splice(i + 1, 0, {name: "Break", time: 0, reps: 0});
    }

    workoutStatsName.textContent = `${workout.name}`;

    let thisWorkoutTime = 0;
    let thisExerciseTime = 0;
    let thisBreakTime = 0;
    let thisExerBreakTime = 0;

    let completions = 0;
    let totalTimeWorkout = 0;
    let breakTotalTimeWorkout = 0;
    let stretchTotalTimeWorkout = 0;
    let exerciseTotalTimeWorkout = 0;
    let totalTimesList = [];
    let totalRepsList = [];

    for (let i = 0; i < workout.stats[0].length; i++)
    {
        thisWorkoutTime += workout.stats[0][i];
        totalTimesList.push(0);
        totalRepsList.push(0);
        if (workout.exercises[i].name === "Break")
        {
            thisExerBreakTime += workout.stats[0][i];
            thisBreakTime += workout.stats[0][i];
        }
        else if (workout.exercises[i].name !== "Stretches")
        {
            thisExerBreakTime += workout.stats[0][i];
            thisExerciseTime += workout.stats[0][i];
        }
    }

    let bestTimeWorkout = thisWorkoutTime;
    let bestTimeExerciseWorkout = thisExerciseTime;
    let bestTimeBreakWorkout = thisBreakTime;
    let bestTimeExerBreakWorkout = thisExerBreakTime;

    for (let i = 0; i < workout.stats.length; i++)
    {
        completions++;
        thisWorkoutTime = 0;
        thisExerciseTime = 0;
        thisBreakTime = 0;
        thisExerBreakTime = 0;
        for (let j = 0; j < workout.stats[i].length; j++)
        {
            totalTimeWorkout += workout.stats[i][j];
            thisWorkoutTime += workout.stats[i][j];
            totalTimesList[j] += workout.stats[i][j];
            totalRepsList[j] += workout.exercises[j].reps;

            if (workout.exercises[j].name === "Break")
            {
                breakTotalTimeWorkout += workout.stats[i][j];
                thisBreakTime += workout.stats[i][j];
                thisExerBreakTime += workout.stats[i][j];
            }
            else if (workout.exercises[j].name === "Stretches")
            {
                stretchTotalTimeWorkout += workout.stats[i][j];
            }
            else
            {
                exerciseTotalTimeWorkout += workout.stats[i][j];
                thisExerciseTime += workout.stats[i][j];
                thisExerBreakTime += workout.stats[i][j];
            }
        }
        if (thisWorkoutTime < bestTimeWorkout)
        {
            bestTimeWorkout = thisWorkoutTime;
        }
        if (thisExerciseTime < bestTimeExerciseWorkout)
        {
            bestTimeExerciseWorkout = thisExerciseTime;
        }
        if (thisBreakTime < bestTimeBreakWorkout)
        {
            bestTimeBreakWorkout = thisBreakTime;
        }
        if (thisExerBreakTime < bestTimeExerBreakWorkout)
        {
            bestTimeExerBreakWorkout = thisExerBreakTime;
        }
    }

    let averageTimesList = [];

    for (let i = 0; i < totalTimesList.length; i++)
    {
        averageTimesList.push(totalTimesList[i] / completions);
    }

    const averageTimeWorkout = totalTime / completions;
    const averageTimeBreakWorkout = breakTotalTimeWorkout / completions;
    const averageTimeExerBreakWorkout = (breakTotalTimeWorkout + exerciseTotalTimeWorkout) / completions;
    const averageTimeExerciseWorkout = exerciseTotalTimeWorkout / completions;

    wholeWorkoutStats.innerHTML = `
    <div><h3>Total completions:</h3><h4>${completions}</h4></div>
    <div><h3>Total time:</h3><h4>${secondsToHMS(totalTimeWorkout)}</h4></div>
    <div><h3>Total time exercising:</h3><h4>${secondsToHMS(exerciseTotalTimeWorkout)}</h4></div>
    <div><h3>Total time on breaks:</h3><h4>${secondsToHMS(breakTotalTimeWorkout)}</h4></div>
    <div><h3>Total time stretching:</h3><h4>${secondsToHMS(stretchTotalTimeWorkout)}</h4></div>
    <div><h3>Average time:</h3><h4>${secondsToHMS(averageTimeWorkout)}</h4></div>
    <div><h3>Average time exercising per workout:</h3><h4>${secondsToHMS(averageTimeExerciseWorkout)}</h4></div>
    <div><h3>Average time on breaks per workout:</h3><h4>${secondsToHMS(averageTimeBreakWorkout)}</h4></div>
    <div><h3>Average time exercising + on breaks per workout:</h3><h4>${secondsToHMS(averageTimeExerBreakWorkout)}</h4></div>
    <div><h3>Best time:</h3><h4>${secondsToHMS(bestTimeWorkout)}</h4></div>
    <div><h3>Best time for exercises:</h3><h4>${secondsToHMS(bestTimeExerciseWorkout)}</h4></div>
    <div><h3>Best time for breaks:</h3><h4>${secondsToHMS(bestTimeBreakWorkout)}</h4></div>
    <div><h3>Best time for exercises + breaks:</h3><h4>${secondsToHMS(bestTimeExerBreakWorkout)}</h4></div>
    `;

    newInnerHTML = ``;

    for (let i = 0; i < totalTimesList.length; i++)
    {
        newInnerHTML += `
        <div><h3>${workout.exercises[i].name}:</h3><h4>${secondsToHMS(totalTimesList[i])}</h4></div>
        `;
    }

    exerciseTotalStats.innerHTML = newInnerHTML;

    newInnerHTML = ``;

    
    for (let i = 0; i < averageTimesList.length; i++)
    {
        newInnerHTML += `
        <div><h3>${workout.exercises[i].name}:</h3><h4>${secondsToHMS(averageTimesList[i])}</h4></div>
        `;
    }

    exerciseAverageStats.innerHTML = newInnerHTML;

    newInnerHTML = ``;

    console.log(workout.bestTimes.length);
    for (let i = 0; i < workout.bestTimes.length; i++)
    {
        console.log(workout.bestTimes[i]);
        newInnerHTML += `
        <div><h3>${workout.exercises[i].name}:</h3><h4>${secondsToHMS(workout.bestTimes[i])}</h4></div>
        `;
    }

    exerciseBestStats.innerHTML = newInnerHTML;

    newInnerHTML = ``;

    for (let i = 0; i < totalRepsList.length; i++)
    {
        if (totalRepsList[i] > 0)
        {
            newInnerHTML += `
            <div><h3>${workout.exercises[i].name}:</h3><h4>${totalRepsList[i]}</h4></div>
            `;
        }
    }

    exerciseTotalReps.innerHTML = newInnerHTML;
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

// Stolen from google ai overview
function secondsToHMS(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);

    // Use padStart() to ensure two-digit formatting (e.g., 05 instead of 5)
    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}

// Stolen from google ai overview
function daysBetween(date1, date2) {
    // The number of milliseconds in one day
    const ONE_DAY_MS = 1000 * 60 * 60 * 24;

    // Convert both dates to UTC timestamps to ignore local timezone effects
    const date1_ms = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate());
    const date2_ms = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate());

    // Calculate the difference in milliseconds
    const differenceMs = Math.abs(date1_ms - date2_ms);

    // Convert back to days and return
    // Math.floor() ensures you get whole days
    return Math.floor(differenceMs / ONE_DAY_MS); 
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

    newInnerHTML = ``;

    newInnerHTML += `
    <div>
        <h3>Total time:</h3>
        <h4>${secondsToHMS(totalTime)}</h4>
    </div>
    `;

    newInnerHTML += `
    <div>
        <h3>Total time exercising:</h3>
        <h4>${secondsToHMS(exerciseTotalTime)}</h4>
    </div>
    `;

    newInnerHTML += `
    <div>
        <h3>Total time on breaks:</h3>
        <h4>${secondsToHMS(breakTotalTime)}</h4>
    </div>
    `;

    newInnerHTML += `
    <div>
        <h3>Total time stretching:</h3>
        <h4>${secondsToHMS(stretchTotalTime)}</h4>
    </div>
    `;

    if (workoutList.length > 0 && workoutList.at(-1).stats.length > 0)
    {
        newInnerHTML += `
        <div>
            <h3>Days since first workout:</h3>
            <h4>${daysBetween(new Date(), workoutList.at(-1).firstWorkoutDate)}</h4>
        </div>
        `;
    }

    newInnerHTML += `
    <div>
        <h3>Workouts completed:</h3>
        <h4>${workoutsCompleted}</h4>
    </div>
    `;

    allWorkoutStats.innerHTML = newInnerHTML;

    newInnerHTML = ``;
    
    workoutList.forEach((element, elementIndex) => {
        newInnerHTML += `
        <section>
            <button class="normalButton statWorkout" onclick="showWorkoutStats(${elementIndex})">
                <p>${element.name}</p>
            </button>
        </section>
        `
    })

    statsWorkoutList.innerHTML = newInnerHTML;
}

// ----- Handle Buttons Presses -----
function handleBackButton()
{
    const currPage = document.querySelector(".active");

    if (currPage == selectWorkoutScreen || currPage == createWorkoutScreen || currPage == viewStatsScreen)
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
    else if (currPage == endWorkoutScreen)
    {
        const confirmed = confirm("Are you sure? Leaving will lose workout progress!");
        if (!confirmed) return;
        resetWorkout();
        switchPage(titleScreen);
    }
    else if (currPage == workoutStatsScreen)
    {
        switchPage(viewStatsScreen);
    }
}
backButton.addEventListener('click', handleBackButton);

function handleHomeButton()
{
    if (document.querySelector(".active") === workoutScreen && currWorkout)
    {
        const confirmed = confirm("Are you sure? Leaving will lose workout progress!");
        if (!confirmed) return;
    }

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
    if (!workoutName.value || workoutList.some(workoutList => workoutList.name === workoutName.value)) {return}
    newWorkout.name = workoutName.value;
    workoutList.unshift(JSON.parse(JSON.stringify(newWorkout)));
    switchPage(titleScreen);
    newWorkout = createEmptyWorkout();
    beginWorkoutButton.classList.remove("grey");
    editExistingButton.classList.remove("grey");
    workoutName.value = '';
    saveWorkouts();
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
    if (currWorkout.index !== -1)
    {
        currWorkout.times.push(Number(Date.now() - exerciseStartTime) / 1000);
    }

    if (currWorkout.index === currWorkout.exercises.length - 1)
    {
        endWorkout();
    }
    else
    {
        goToExercise(currWorkout.index + 1);
    }
}
nextExerciseButton.addEventListener('click', handleNextExerciseButton);

function handleRestartButton()
{
    currWorkout.times[currWorkout.index - 1] += Number(Date.now() - exerciseStartTime) / 1000; 
    // exerciseStartTime = Date.now();
    goToExercise(currWorkout.index);
}
restartButton.addEventListener('click', handleRestartButton);

function handleSaveWorkoutTimesButton()
{
    if (workoutList[currWorkout.workoutListIndex].stats.length === 0)
    {
        workoutList[currWorkout.workoutListIndex].firstWorkoutDate = new Date();
    }

    workoutList[currWorkout.workoutListIndex].stats.push(currWorkout.times);

    if (workoutList[currWorkout.workoutListIndex].bestTimes.length === 0)
    {
        workoutList[currWorkout.workoutListIndex].bestTimes = JSON.parse(JSON.stringify(currWorkout.times));
    }
    else
    {
        for (let i = 0; i < currWorkout.times.length; i++)
        {
            if (currWorkout.times[i] < workoutList[currWorkout.workoutListIndex].bestTimes[i])
            {
                workoutList[currWorkout.workoutListIndex].bestTimes[i] = currWorkout.times[i];
            }
        }
    }

    workoutsCompleted++;

    for (let i = 0; i < currWorkout.times.length; i++)
    {
        totalTime += currWorkout.times[i];

        if (currWorkout.exercises[i].name === "Break")
        {
            breakTotalTime += currWorkout.times[i];
        }
        else if (currWorkout.exercises[i].name === "Stretches")
        {
            stretchTotalTime += currWorkout.times[i];
        }
        else
        {
            exerciseTotalTime += currWorkout.times[i];
        }
    }

    if (viewStatsButton.classList.contains("grey"))
    {
        viewStatsButton.classList.remove("grey");
    }
    switchPage(titleScreen);
    resetWorkout();
    saveWorkouts();
}
saveWorkoutTimesButton.addEventListener('click', handleSaveWorkoutTimesButton);

function handleViewStatsButton()
{
    switchPage(viewStatsScreen);
    updateUI();
}
viewStatsButton.addEventListener('click', handleViewStatsButton);

if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("./service-worker.js")
        .then(reg => console.log("Service Worker registered"))
        .catch(err => console.log("Service Worker failed:", err));
    });
}

