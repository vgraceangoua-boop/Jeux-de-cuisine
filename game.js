// Game State
const gameState = {
    score: 0,
    timeLeft: 60,
    currentRecipe: 0,
    addedIngredients: [],
    gameActive: false,
    timerInterval: null
};

const recipes = [
    {
        name: "Pâtes Carbonara",
        ingredients: ["🍝 Pâtes", "🥚 Oeufs", "🥓 Bacon", "🧀 Fromage"]
    },
    {
        name: "Pizza Margherita",
        ingredients: ["🍕 Pâte", "🍅 Tomate", "🧀 Fromage", "🌿 Basilic"]
    },
    {
        name: "Salade César",
        ingredients: ["🥬 Laitue", "🧀 Fromage", "🥚 Oeufs", "🍞 Croûtons"]
    }
];

// DOM Elements
const startBtn = document.getElementById('startBtn');
const restartBtn = document.getElementById('restartBtn');
const cookBtn = document.getElementById('cookBtn');
const startScreen = document.getElementById('startScreen');
const gameScreen = document.getElementById('gameScreen');
const endScreen = document.getElementById('endScreen');
const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');
const ingredientsList = document.getElementById('ingredients');
const recipeName = document.getElementById('recipeName');
const finalScore = document.getElementById('finalScore');
const message = document.getElementById('message');
const cookingZone = document.getElementById('cookingZone');
const instruction = document.getElementById('instruction');

// Event Listeners
startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', () => {
    gameState.score = 0;
    gameState.currentRecipe = 0;
    startGame();
});
cookBtn.addEventListener('click', cookDish);

// Start Game
function startGame() {
    gameState.gameActive = true;
    gameState.score = 0;
    gameState.timeLeft = 60;
    gameState.addedIngredients = [];
    gameState.currentRecipe = Math.floor(Math.random() * recipes.length);
    
    switchScreen('gameScreen');
    loadRecipe();
    startTimer();
    updateScore();
}

// Load Recipe
function loadRecipe() {
    const recipe = recipes[gameState.currentRecipe];
    recipeName.textContent = recipe.name;
    
    ingredientsList.innerHTML = '';
    gameState.addedIngredients = [];
    
    recipe.ingredients.forEach((ingredient, index) => {
        const li = document.createElement('li');
        li.className = 'ingredient';
        li.textContent = ingredient;
        li.addEventListener('click', () => addIngredient(index, ingredient));
        ingredientsList.appendChild(li);
    });
    
    updateCookingZone();
}

// Add Ingredient
function addIngredient(index, ingredient) {
    if (!gameState.addedIngredients.includes(index)) {
        gameState.addedIngredients.push(index);
        
        // Mark as added
        const ingredients = document.querySelectorAll('.ingredient');
        ingredients[index].classList.add('added');
        
        // Add to cooking zone
        updateCookingZone();
        
        // Award points
        gameState.score += 10;
        updateScore();
    }
}

// Update Cooking Zone
function updateCookingZone() {
    const recipe = recipes[gameState.currentRecipe];
    
    if (gameState.addedIngredients.length === 0) {
        instruction.textContent = 'Clique sur les ingrédients pour les ajouter!';
    } else {
        const addedIngredients = gameState.addedIngredients.map(i => recipe.ingredients[i]).join(' ');
        instruction.textContent = `Ingrédients ajoutés: ${addedIngredients}`;
    }
}

// Cook Dish
function cookDish() {
    const recipe = recipes[gameState.currentRecipe];
    const correctCount = recipe.ingredients.length;
    const addedCount = gameState.addedIngredients.length;
    
    if (addedCount === correctCount) {
        gameState.score += 50;
        updateScore();
        message.textContent = '✅ Excellent! Tu as bien cuisiné ce plat!';
        loadRecipe();
    } else if (addedCount > 0) {
        gameState.score += 20;
        updateScore();
        message.textContent = '⚠️ Presque! Il manque quelques ingrédients.';
        loadRecipe();
    } else {
        message.textContent = '❌ Ajoute d\'abord les ingrédients!';
    }
}

// Timer
function startTimer() {
    gameState.timerInterval = setInterval(() => {
        gameState.timeLeft--;
        timerDisplay.textContent = gameState.timeLeft;
        
        if (gameState.timeLeft <= 0) {
            endGame();
        }
    }, 1000);
}

// Update Score
function updateScore() {
    scoreDisplay.textContent = gameState.score;
}

// End Game
function endGame() {
    gameState.gameActive = false;
    clearInterval(gameState.timerInterval);
    
    finalScore.textContent = `Score Final: ${gameState.score}`;
    
    if (gameState.score >= 300) {
        message.textContent = '🌟 Excellent! Tu es un grand cuisinier!';
    } else if (gameState.score >= 150) {
        message.textContent = '👍 Bien joué! Continue à pratiquer.';
    } else {
        message.textContent = '📚 Essaie à nouveau et tu feras mieux!';
    }
    
    switchScreen('endScreen');
}

// Switch Screen
function switchScreen(screenName) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenName).classList.add('active');
}

// Initialize
window.addEventListener('load', () => {
    switchScreen('startScreen');
});