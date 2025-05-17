class Quiz {
    constructor() {
        this.questions = [];
        this.currentQuestion = 0;
        this.score = 0;
        this.isQuizStarted = false;

        // DOM Elements
        this.startButton = document.getElementById('startQuiz');
        this.quizContent = document.getElementById('quizContent');
        this.questionElement = document.getElementById('question');
        this.choicesElement = document.getElementById('choices');
        this.nextButton = document.getElementById('nextQuestion');
        this.questionNumberElement = document.getElementById('questionNumber');
        this.scoreElement = document.getElementById('score');
        this.resultsElement = document.getElementById('results');
        this.finalScoreElement = document.getElementById('finalScore');
        this.retakeButton = document.getElementById('retakeQuiz');

        // Event Listeners
        this.startButton.addEventListener('click', () => this.startQuiz());
        this.nextButton.addEventListener('click', () => this.showNextQuestion());
        this.retakeButton.addEventListener('click', () => this.retakeQuiz());

        // Load questions from JSON file
        this.loadQuestions();
    }

    async loadQuestions() {
        try {
            const response = await fetch('resources/quizzes/industrial-plant/fans-and-blowers.json');
            this.questions = await response.json();
        } catch (error) {
            console.error('Error loading questions:', error);
            this.questions = []; // Initialize with empty array if loading fails
        }
    }

    startQuiz() {
        this.isQuizStarted = true;
        this.currentQuestion = 0;
        this.score = 0;
        this.startButton.classList.add('hidden');
        this.quizContent.classList.remove('hidden');
        this.resultsElement.classList.add('hidden');
        this.updateScore();
        this.showQuestion();
    }

    showQuestion() {
        const question = this.questions[this.currentQuestion];
        this.questionElement.textContent = question.question;
        this.choicesElement.innerHTML = '';
        
        question.choices.forEach((choice, index) => {
            const button = document.createElement('button');
            button.className = 'choice-button';
            button.textContent = choice;
            button.addEventListener('click', () => this.selectChoice(index));
            this.choicesElement.appendChild(button);
        });

        this.nextButton.disabled = true;
        this.questionNumberElement.textContent = 
            `Question: ${this.currentQuestion + 1}/${this.questions.length}`;
    }

    selectChoice(choiceIndex) {
        const buttons = this.choicesElement.getElementsByClassName('choice-button');
        const question = this.questions[this.currentQuestion];

        // Remove previous selections
        Array.from(buttons).forEach(button => {
            button.classList.remove('correct', 'incorrect', 'selected');
        });

        // Mark selected answer
        buttons[choiceIndex].classList.add('selected');

        // Check if answer is correct
        if (choiceIndex === question.correctAnswer) {
            buttons[choiceIndex].classList.add('correct');
            this.score++;
            this.updateScore();
        } else {
            buttons[choiceIndex].classList.add('incorrect');
            buttons[question.correctAnswer].classList.add('correct');
        }

        // Disable all choice buttons after selection
        Array.from(buttons).forEach(button => {
            button.disabled = true;
        });

        this.nextButton.disabled = false;
    }

    showNextQuestion() {
        this.currentQuestion++;
        
        if (this.currentQuestion < this.questions.length) {
            this.showQuestion();
        } else {
            this.showResults();
        }
    }

    showResults() {
        this.quizContent.classList.add('hidden');
        this.resultsElement.classList.remove('hidden');
        this.finalScoreElement.textContent = 
            `${this.score} out of ${this.questions.length} (${Math.round(this.score/this.questions.length * 100)}%)`;
    }

    retakeQuiz() {
        this.startQuiz();
    }

    updateScore() {
        this.scoreElement.textContent = `Score: ${this.score}`;
    }
}

// Initialize quiz when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const quiz = new Quiz();
});