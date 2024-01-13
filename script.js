"use strict";

// The API endpoint for meals
const mealApiUrl = "https://www.themealdb.com/api/json/v1/1/search.php";

document.addEventListener("DOMContentLoaded", () => {
  // Get references to HTML elements
  const searchInput = document.querySelector(".search_bar input");
  const searchButton = document.querySelector(".search_bar .btn");
  const mainContainer = document.querySelector(".main_container");
  const favButton = document.querySelector(".fav_btn");

  // Array to store favorite meals
  let favoriteMeals = [];

  // Function to fetch meals from the API based on the search query
  const fetchMeals = async (query) => {
    try {
      const response = await fetch(`${mealApiUrl}?s=${query}`);
      const data = await response.json();
      return data.meals;
    } catch (error) {
      console.error("Error fetching meals:", error);
    }
  };

  // Function to display meals on the frontend
  const displayMeals = (meals) => {
    mainContainer.innerHTML = "";

    meals.forEach((meal) => {
      const mealCard = createMealCard(meal);
      mainContainer.appendChild(mealCard);
    });
  };

  // Function to create a meal card
  const createMealCard = (meal) => {
    const mealCard = document.createElement("div");
    mealCard.classList.add("meal_card");
    mealCard.setAttribute("data-id", meal.idMeal);

    const mealImage = document.createElement("img");
    mealImage.src = meal.strMealThumb;
    mealImage.alt = meal.strMeal;

    const mealName = document.createElement("h2");
    mealName.textContent = meal.strMeal;

    const favoriteIcon = document.createElement("i");
    favoriteIcon.classList.add("fas", "fa-heart", "favorite-icon");
    favoriteIcon.addEventListener("click", () => toggleFavorite(meal));

    mealCard.appendChild(mealImage);
    mealCard.appendChild(mealName);
    mealCard.appendChild(favoriteIcon);

    mealCard.addEventListener("click", () => showMealDetails(meal.idMeal));
    return mealCard;
  };

  // Function to toggle favorite status
  const toggleFavorite = (meal) => {
    const index = favoriteMeals.findIndex(
      (favoriteMeal) => favoriteMeal.idMeal === meal.idMeal
    );

    if (index === -1) {
      favoriteMeals.push(meal);
    } else {
      favoriteMeals.splice(index, 1);
    }

    updateFavoriteButton();
  };

// Event listener for btn_random click
document.querySelector('.btn_random').addEventListener('click', async () => {
  const meals = await fetchAllMeals();
  displayMeals(meals);
});

// Function to fetch all meals
const fetchAllMeals = async () => {
  try {
    const response = await fetch(`${mealApiUrl}?s=`);
    const data = await response.json();
    return data.meals;
  } catch (error) {
    console.error('Error fetching meals:', error);
  }
};


  // Function to update the favorite button based on the number of favorite meals
  const updateFavoriteButton = () => {
    const favCount = favoriteMeals.length;
    favButton.textContent = `Add Favourite Meals (${favCount})`;
  };

  // Event listener for the "Add Favourite Meals" button click
  favButton.addEventListener("click", () => displayFavoriteMeals());

  // Function to display favorite meals in a modal
  const displayFavoriteMeals = () => {
    const modal = createFavoriteModal();
    modal.style.display = "block";
    document.body.appendChild(modal);

    const closeModal = () => {
      modal.style.display = "none";
      document.body.removeChild(modal);
    };

    modal.addEventListener("click", (event) => {
      if (event.target === modal) {
        closeModal();
      }
    });

    favoriteMeals.forEach((meal) => {
      const mealCard = createMealCard(meal);
      modal.querySelector(".fav_meals_container").appendChild(mealCard);
    });
  };

  // Function to create a modal for favorite meals
  const createFavoriteModal = () => {
    const modal = document.createElement("div");
    modal.classList.add("modal");

    const modalContent = document.createElement("div");
    modalContent.classList.add("modal-content");

    const closeModalBtn = document.createElement("span");
    closeModalBtn.classList.add("close");
    closeModalBtn.innerHTML = "&times;";
    closeModalBtn.addEventListener(
      "click",
      () => (modal.style.display = "none")
    );

    const modalTitle = document.createElement("h2");
    modalTitle.textContent = "My Favourite Meals";

    const favMealsContainer = document.createElement("div");
    favMealsContainer.classList.add("fav_meals_container");

    modalContent.appendChild(closeModalBtn);
    modalContent.appendChild(modalTitle);
    modalContent.appendChild(favMealsContainer);

    modal.appendChild(modalContent);

    return modal;
  };

  // Event listener for search button click
  searchButton.addEventListener("click", async () => {
    const query = searchInput.value.trim();

    if (query) {
      const meals = await fetchMeals(query);
      displayMeals(meals);
    }
  });

  // Event listener for search input change (for real-time suggestions)
  searchInput.addEventListener("input", async () => {
    const query = searchInput.value.trim();

    if (query) {
      const meals = await fetchMeals(query);
      displayMeals(meals);
    }
  });

  // Function to show meal details
  const showMealDetails = async (mealId) => {
    try {
      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`
      );
      const data = await response.json();
      const meal = data.meals[0];

      // Customize this part based on your requirements
      alert(
        `Meal Name: ${meal.strMeal}\nInstructions: ${meal.strInstructions}`
      );
    } catch (error) {
      console.error("Error fetching meal details:", error);
    }
  };
});
