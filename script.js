// Selects the progress bar and progress text elements
const progressBar = document.querySelector(".progress-bar"),
    progressText = document.querySelector(".progress-text");

// Function to update the progress bar based on time value
const progress = (value) => {
    const percentage = (value / time) * 100; // Calculate percentage based on remaining time
    progressBar.style.width = `${percentage}%`; // Update the progress bar width
    progressText.innerHTML = `${value}`; // Display remaining time
};

// Selects various elements used in the quiz
const startBtn = document.querySelector(".start"),
    numQuestions = document.querySelector("#num-questions"),
    category = document.querySelector("#category"),
    difficulty = document.querySelector("#difficulty"),
    timePerQuestion = document.querySelector("#time"),
    quiz = document.querySelector(".quiz"),
    startScreen = document.querySelector(".start-screen");

// Initializes variables for quiz questions, time, score, current question, and timer
let questions = [],
    time = 30,
    score = 0,
    currentQuestion,
    timer;

// Function to start the quiz
const startQuiz = () => {
    const num = numQuestions.value, // Number of questions selected
        cat = category.value, // Category of questions selected
        diff = difficulty.value; // Difficulty level selected

    loadingAnimation(); // Display loading animation

    // Fetch quiz questions based on selected options
    const url = `https://opentdb.com/api.php?amount=${num}&category=${cat}&difficulty=${diff}&type=multiple`;
    fetch(url)
        .then((res) => res.json())
        .then((data) => {
            questions = data.results; // Store retrieved questions
            setTimeout(() => {
                startScreen.classList.add("hide"); // Hide start screen
                quiz.classList.remove("hide"); // Show quiz screen
                currentQuestion = 1;
                showQuestion(questions[0]); // Display the first question
            }, 1000);
        });
};

// Event listener to start quiz on button click
startBtn.addEventListener("click", startQuiz);

// Function to display a question and its answers
const showQuestion = (question) => {
    const questionText = document.querySelector(".question"),
        answersWrapper = document.querySelector(".answer-wrapper");
    questionNumber = document.querySelector(".number");

    questionText.innerHTML = question.question; // Display the question text

    // Combine correct and incorrect answers, then shuffle them
    const answers = [
        ...question.incorrect_answers,
        question.correct_answer.toString(),
    ];
    answersWrapper.innerHTML = ""; // Clear previous answers
    answers.sort(() => Math.random() - 0.5); // Shuffle answers

    // Display each answer option
    answers.forEach((answer) => {
        answersWrapper.innerHTML += `
                  <div class="answer ">
            <span class="text">${answer}</span>
            <span class="checkbox">
              <i class="fas fa-check"></i>
            </span>
          </div>
        `;
    });

    // Display question number
    questionNumber.innerHTML = ` Question <span class="current">${
        questions.indexOf(question) + 1
    }</span>
            <span class="total">/${questions.length}</span>`;

    // Add event listener to each answer to select it
    const answersDiv = document.querySelectorAll(".answer");
    answersDiv.forEach((answer) => {
        answer.addEventListener("click", () => {
            if (!answer.classList.contains("checked")) {
                answersDiv.forEach((answer) => {
                    answer.classList.remove("selected");
                });
                answer.classList.add("selected"); // Mark selected answer
                submitBtn.disabled = false;
            }
        });
    });

    time = timePerQuestion.value; // Set time for each question
    startTimer(time); // Start the countdown timer
};

// Function to start and control the countdown timer
const startTimer = (time) => {
    timer = setInterval(() => {
        if (time === 3) {
            playAdudio("countdown.mp3"); // Play countdown audio at 3 seconds
        }
        if (time >= 0) {
            progress(time); // Update progress bar
            time--;
        } else {
            checkAnswer(); // Check answer if time runs out
        }
    }, 1000); // Run every second
};

// Function to show loading animation during data fetch
const loadingAnimation = () => {
    startBtn.innerHTML = "Loading";
    const loadingInterval = setInterval(() => {
        if (startBtn.innerHTML.length === 10) {
            startBtn.innerHTML = "Loading";
        } else {
            startBtn.innerHTML += ".";
        }
    }, 500);
};

// Display project credit on page
function defineProperty() {
    var osccred = document.createElement("div");
    osccred.innerHTML =
        "A Project By Darlington @ <a href='https://africanstemgirl.com/' target=_blank>Code with us @ AfricanSteGirl</a>";
    osccred.style.position = "absolute";
    osccred.style.bottom = "0";
    osccred.style.right = "0";
    osccred.style.fontSize = "10px";
    osccred.style.color = "#ccc";
    osccred.style.fontFamily = "sans-serif";
    osccred.style.padding = "5px";
    osccred.style.background = "#fff";
    osccred.style.borderTopLeftRadius = "5px";
    osccred.style.borderBottomRightRadius = "5px";
    osccred.style.boxShadow = "0 0 5px #ccc";
    document.body.appendChild(osccred);
}

defineProperty(); // Call function to add project credit

// Set up submit and next button event listeners
const submitBtn = document.querySelector(".submit"),
    nextBtn = document.querySelector(".next");

submitBtn.addEventListener("click", () => {
    checkAnswer();
});

nextBtn.addEventListener("click", () => {
    nextQuestion(); // Move to the next question
    submitBtn.style.display = "block";
    nextBtn.style.display = "none";
});

// Function to check the selected answer
const checkAnswer = () => {
    clearInterval(timer); // Stop timer
    const selectedAnswer = document.querySelector(".answer.selected");
    if (selectedAnswer) {
        const answer = selectedAnswer.querySelector(".text").innerHTML;
        if (answer === questions[currentQuestion - 1].correct_answer) {
            score++; // Increase score for correct answer
            selectedAnswer.classList.add("correct");
        } else {
            selectedAnswer.classList.add("wrong");
            // Highlight the correct answer
            document.querySelectorAll(".answer").forEach((answer) => {
                if (
                    answer.querySelector(".text").innerHTML ===
                    questions[currentQuestion - 1].correct_answer
                ) {
                    answer.classList.add("correct");
                }
            });
        }
    } else {
        // Highlight correct answer if none selected
        document.querySelectorAll(".answer").forEach((answer) => {
            if (
                answer.querySelector(".text").innerHTML ===
                questions[currentQuestion - 1].correct_answer
            ) {
                answer.classList.add("correct");
            }
        });
    }

    // Disable selection and show next button
    document.querySelectorAll(".answer").forEach((answer) => {
        answer.classList.add("checked");
    });
    submitBtn.style.display = "none";
    nextBtn.style.display = "block";
};

// Function to go to the next question
const nextQuestion = () => {
    if (currentQuestion < questions.length) {
        currentQuestion++;
        showQuestion(questions[currentQuestion - 1]);
    } else {
        showScore(); // Show score if all questions are answered
    }
};

// Show the final score on end screen
const endScreen = document.querySelector(".end-screen"),
    finalScore = document.querySelector(".final-score"),
    totalScore = document.querySelector(".total-score");

const showScore = () => {
    endScreen.classList.remove("hide"); // Display end screen
    quiz.classList.add("hide"); // Hide quiz
    finalScore.innerHTML = score; // Show user's score
    totalScore.innerHTML = `/ ${questions.length}`; // Show total questions
};

// Reload page to restart quiz
const restartBtn = document.querySelector(".restart");
restartBtn.addEventListener("click", () => {
    window.location.reload();
});

// Function to play audio
const playAdudio = (src) => {
    const audio = new Audio(src);
    audio.play();
};