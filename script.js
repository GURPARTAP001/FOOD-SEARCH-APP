const meals = document.getElementById('meals');
const favoriteContainer=document.getElementById('fav-meals')
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

    const respData=await resp.json();
    const meal=respData.meals[0];

    return meal
}

async function getMealsBySearch(term) {

    const meals = await fetch("https://www.themealdb.com/api/json/v1/1/search.php?s=" + term);

}

//by defualt the randomness is false
function addMeal(mealData, random = false) {

    // using the below logic we are creating the random meal section of the webpage
    const meal = document.createElement('div');
    meal.classList.add('meal');
    meal.innerHTML = `
        <div class="meal-header">
           ${random? `<spam class="random">Random Recipe</spam>`:''}
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
        const btn=meal.querySelector(".meal-body .fav-btn");

        btn.addEventListener("click",()=>{

            if(btn.classList.contains("active")){
                removeMealLS(mealData.idMeal);
                btn.classList.remove("active");
            }
            else{
                addMealLS(mealData.idMeal);
                btn.classList.add("active");
            }

            
            fetchFavMeals();
            
        });

        meals.appendChild(meal);

}


// LS:local storage,so basically we are storing the meal ID in the ls and do all the operations using it

function addMealLS(mealId){

    const mealIds=getMealsLS();

    localStorage.setItem('mealIds',JSON.stringify([...mealIds,mealId]));
}

function removeMealLS(mealId){

    const mealIds=getMealsLS();

    localStorage.setItem('mealIds',JSON.stringify(mealIds.filter((id)=>id!==mealId)));
}

function getMealsLS(){

    const mealIds=JSON.parse(localStorage.getItem('mealIds'));//we are trying to access the object with the  'key:mealIds'

    return mealIds===null?[]:mealIds;
}

// using the below function we will add the items present in the local storage to the fav meal 
async function fetchFavMeals(){

    //clean the container
    favoriteContainer.innerHTML="";
    const mealIds=getMealsLS();

    const meals=[];
    for(let i=0;i<mealIds.length;i++){
        const mealId=mealIds[i];

      const meal= await getMealById(mealId);
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

    const btn=favmeal.querySelector('.clear');

    btn.addEventListener('click',()=>{
        
        removeMealLS(mealData.idMeal)

        fetchFavMeals();
    })
        favoriteContainer.appendChild(favmeal);

}
