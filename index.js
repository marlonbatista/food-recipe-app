const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const mealList = document.getElementById('mealList');
const modalContainer = document.querySelector('.modal-container');
const mealDetailContainer = document.querySelector('.meal-details-content');
const recipeCloseBtn = document.getElementById('recipeCloseBtn');

// Events listeners
searchButton.addEventListener('click', async () => {
    const ingredient = searchInput.value.trim();
    if (ingredient) {
        const meals = await searchMealsByIngredient(ingredient);
        displayMeals(meals);
    }
});

mealList.addEventListener('click', async (e) => {
    const card = e.target.closest('.meal-item');
    if (card) {
        const mealId = card.dataset.id;
        const meal = await getMealDetails(mealId);
        if(meal) {
            showMealDetailsPopup(meal);
        }
    }
});

// Function to fetch meals by ingredient 
const searchMealsByIngredient = async (ingredient) =>  {
    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`);
        const data = await response.json();
        return data.meals;
    } catch(error) {
        console.error('Error fecthing data :', error);
    }
}

// Function to fecth meal details by ID
const getMealDetails = async (mealId) =>  {
    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
        const data = await response.json();
        return data.meals[0];
    } catch (error) {
        console.error('Error fecthing meal details :', error);
    }
}

// Function to display meals in the list
const displayMeals = (meals) => {
    mealList.innerHTML = '';
    if (meals) {
        meals.forEach((meal) => {
            const mealItem = document.createElement('div');
            mealItem.classList.add('meal-item');
            mealItem.dataset.id = meal.idMeal;
            mealItem.innerHTML = `
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
                <h3>${meal.strMeal}</h3>
            `;
            mealList.appendChild(mealItem);
        });
    } else {
        mealList.innerHtml = '<p>No meals found. Try another ingredient.</p>';
    }
}

// Function to create and display meal details on popup
const showMealDetailsPopup = (meal) => {
    mealDetailContainer.innerHTML =`
        <h2 class="recipe-title">${meal.strMeal}</h2>
        <p class="recipe-category">${meal.strCategory}</p>
        <div class="recipe-instruct">
            <h3>Instructions:</h3>
            <p>${meal.strInstructions}</p>
        </div>
        <div class="recipe-img">
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
        </div>
        <div class="recipe-video">
            <a href="${meal.strYoutube}" target="_blank">Video tutorial</a>
        </div>
    `;
    modalContainer.style.display ="block";
}

const closeRecipeModal = () => {
    modalContainer.style.display = "none";
}

// Event listener for popup close button
recipeCloseBtn.addEventListener('click', closeRecipeModal);


searchInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        performSearch();
    }
});

const performSearch = async () => {
    const ingredient = searchInput.value.trim();
    if(ingredient) {
        const meals = await searchMealsByIngredient(ingredient);
        displayMeals(meals);
    }
};

// Performa a chicken on page load
window.addEventListener('load', () => {
    searchInput.value = "bread";
    performSearch();
});