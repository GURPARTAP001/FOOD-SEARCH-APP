const mealsEl = document.getElementById('meals');
const favoriteContainer = document.getElementById('fav-meals')

const searchTerm = document.getElementById("search-term");
const searchbtn = document.getElementById("search");

const mealInfoEl=document.getElementById('meal-info');
const mealPopup =document.getElementById('meal-popup')
const popupCloseBtn=document.getElementById('close-popup')
// initial function call for the function
getRandomMeal();
fetchFavMeals();

// it is the async function that fetches the random food item 
async function getRandomMeal() {
    const resp = await fetch("https://www.themealdb.com/api/json/v1/1/random.php");

    // only getting the first element of the array list
    const respData = await resp.json();
    const randomMeal = respData.meals[0]
    console.log(randomMeal)

    addMeal(randomMeal, true);
}

async function getMealById(id) {

    const resp = await fetch("https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + id);

    const respData = await resp.json();
    const meals = respData.meals[0];

    return meals
}

async function getMealsBySearch(term) {

    const resp = await fetch("https://www.themealdb.com/api/json/v1/1/search.php?s=" + term);

    const respData = await resp.json();
    const meals = respData.meals;

    return meals;

}

//by defualt the randomness is false
function addMeal(mealData, random = false) {

    // using the below logic we are creating the random meal section of the webpage
    const meal = document.createElement('div');

    meal.classList.add('meal');
    meal.innerHTML = `
        <div class="meal-header">
           ${random ? `<spam class="random">Random Recipe</spam>` : ''}
            <img src="${mealData.strMealThumb}" 
            alt="${mealData.strMeal}">
        </div>
        <div class="meal-body">
            <h4>${mealData.strMeal}</h4>
            <button class="fav-btn ">
                <i class="uil uil-heart-alt"></i>
            </button>
        </div>`;

    // using the below logic we are creating the like button
    const btn = meal.querySelector(".meal-body .fav-btn");

    btn.addEventListener("click", () => {
        if (btn.classList.contains("active")) {
            removeMealLS(mealData.idMeal);
            btn.classList.remove("active");
        }
        else {
            addMealLS(mealData.idMeal);
            btn.classList.add("active");
        }
        fetchFavMeals();
    });
     
    meal.children[0].addEventListener('click',()=>{
        showMealInfo(mealData);
    })

    mealsEl.appendChild(meal);
}


// LS:local storage,so basically we are storing the meal ID in the ls and do all the operations using it

function addMealLS(mealId) {

    const mealIds = getMealsLS();

    localStorage.setItem('mealIds', JSON.stringify([...mealIds, mealId]));
}

function removeMealLS(mealId) {

    const mealIds = getMealsLS();

    localStorage.setItem('mealIds', JSON.stringify(mealIds.filter((id) => id !== mealId)));
}

function getMealsLS() {

    const mealIds = JSON.parse(localStorage.getItem('mealIds'));//we are trying to access the object with the  'key:mealIds'

    return mealIds === null ? [] : mealIds;
}

// using the below function we will add the items present in the local storage to the fav meal 
async function fetchFavMeals() {

    //clean the container
    favoriteContainer.innerHTML = "";
    const mealIds = getMealsLS();

    const meals = [];
    for (let i = 0; i < mealIds.length; i++) {
        const mealId = mealIds[i];

        const meal = await getMealById(mealId);
        addMealFav(meal);
    }

    console.log(meals);
}

// creating the top most fav meal section using the below function
function addMealFav(mealData) {

    const favmeal = document.createElement('li');
    favmeal.innerHTML = `
    <img src="${mealData.strMealThumb}" alt="${mealData.strMeal}"><span>${mealData.strMeal}</span>
    <button class="clear"><i class="uil uil-times"></i></button>
    `;

    const btn = favmeal.querySelector('.clear');

    btn.addEventListener('click', () => {

        removeMealLS(mealData.idMeal)

        fetchFavMeals();
    });

    favmeal.children[0].addEventListener('click',()=>{
        showMealInfo(mealData);
    });
    favmeal.children[1].addEventListener('click',()=>{
        showMealInfo(mealData);
    });

    console.log(favmeal.children[0]);

    favoriteContainer.appendChild(favmeal);

}

function showMealInfo(mealData){

    // clening the container before we show the popup
    mealInfoEl.innerHTML='';
    // upadtaing the meal info
    const mealEl=document.createElement('div');


    // throught the below function we are setting the list of the ingriedents in the pop up
    const ingredients=[]; //making the array of ingredient
    for(let i=0;i<=20;i++){
        if(mealData['strIngredient'+i]){
            ingredients.push(`${mealEl['strIngredient'+i]}-${mealData['strMeasure'+i]}`)

        }else{
            break;
        }
        
    }

    mealEl.innerHTML=`
            <h1>${mealData.strMeal}</h1>
            <img src="${mealData.strMealThumb}" alt="">


            <p>${mealData.strInstructions}</p>
            <h3>Ingredients:</h3>
            <ul>
               ${ingredients.map((ing)=>`
               <li>${ing}</li>
               `).join("")}
            </ul>
    `

    mealInfoEl.appendChild(mealEl);

    // this will show the popup
    mealPopup.classList.remove('hidden');
}

searchbtn.addEventListener('click', async () => {

    //cleaning the inner container
    mealsEl.innerHTML = '';
    const search = searchTerm.value;//through this we are getting the value present inside the search field


    const meals = await getMealsBySearch(search)

    if (meals) {
        meals.forEach((meal) => {
            addMeal(meal);
        });
    }
    else {
        alert("Recipe not found");
        getRandomMeal();
    }
});

popupCloseBtn.addEventListener('click',()=>{

    mealPopup.classList.add('hidden');
})
