const meals=document.getElementById('meals');


getRandomMeal();
 async function getRandomMeal(){
    const resp=await fetch("https://www.themealdb.com/api/json/v1/1/random.php");

    // only getting the first element of the array list
    const respData=await resp.json();
    const randomMeal=respData.meals[0]
    console.log(randomMeal)

    addMeal(randomMeal,true);
}

async function getMealById(id){

    const meal =await fetch("https://www.themealdb.com/api/json/v1/1/lookup.php?i="+id);
}

async function getMealsBySearch(term){
    
    const meals=await fetch("https://www.themealdb.com/api/json/v1/1/search.php?s="+term);
    
}

//by defualt the randomness is false
function addMeal(mealData,random=false){

}