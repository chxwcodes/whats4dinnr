//An app that decides what you should make based on what ingredients you have in your fridge and pantry

//The mighty recipeApp obj
const recipeApp = {};

//jquery variables
recipeApp.$resultsInfo = $('.resultsInfo');
recipeApp.$resultsSteps = $('.resultsSteps');
recipeApp.$h3 = $('h3');

//api key
recipeApp.apiKey = 'c3a2dd22ab68486693f350a7d15abe53';

//define a function that will make a request to the search endpoint using the user's provided arguments
recipeApp.recipeSearch = (ingredients, calories, diet) => {
    $.ajax ({
        url: 'https://api.spoonacular.com/recipes/complexSearch',
        method: 'GET',
        dataType: 'json',
        data: {
            apiKey: recipeApp.apiKey,
            diet: diet,
            includeIngredients: ingredients,
            maxCalories: calories,
            addRecipeInformation: true,
        }
    }).then(function (recipeResults) {
        //if there are no results: tell the user there are no results
        if (recipeResults.totalResults === 0) {
            recipeApp.$resultsInfo.html(`<h2>There are no recipes based on your inputs.</h2>`);

            recipeApp.$h3.text('');
        }

        console.log(recipeResults)
        //if there are results: display the recipe onto the DOM
        recipeApp.displayRecipe(recipeResults);

        
    })
}

//define a function that generates a random number based on the total number of recipe results
recipeApp.randomizeRecipe = (recipeObject) => {
    return Math.floor(Math.random() * recipeObject.results.length);
}

//define a function that will display a randomly generated recipes onto the page with the returned api
recipeApp.displayRecipe = (recipeObject) => {
    //decide what random recipe we're making 
    const recipeNum = recipeApp.randomizeRecipe(recipeObject);

    //put html info from the random recipe into the recipe info section
    const recipeInfoHTML = `
        <img src="${recipeObject.results[recipeNum].image}" alt="Image of ${recipeObject.results[recipeNum].title}">

        <h2>${recipeObject.results[recipeNum].title}</h2>

        <div class="facts">
            <p><em>Calories:</em> ${recipeObject.results[recipeNum].nutrition.nutrients[0].amount}</p>
            <p><em>Serves:</em> ${recipeObject.results[recipeNum].servings}</p>
            <p><em>Ready in:</em> ${recipeObject.results[recipeNum].readyInMinutes} minutes</p>
        </div>

        <div class="info">
            <p>${recipeObject.results[recipeNum].summary}</p>
        </div>
    `;

    //actually putting the info onto the recipe info section
    recipeApp.$resultsInfo.html(recipeInfoHTML);

    recipeApp.$h3.text('Instructions');

    //display the recipe's list of steps
    recipeObject.results[recipeNum].analyzedInstructions[0].steps.forEach((step) => {
        //save each step into a variable
        const recipeStep = `<li>${step.step}`;
        
        //display each step into the DOM
        recipeApp.$resultsSteps.append(recipeStep);
    })
}


recipeApp.init = () => {
    //listen for when the form is submitted and record the user's input 
    $('form').on('submit', function(e) {
        e.preventDefault();

        //save the user's inputs into variables
        const $userIngredients = $('#userIngredients').val();
        const $userCalories = $('#userCalories').val();
        const $userDiet = $('#userDiet').val();

        //if user submits an empty input, remind them to put in an ingredient
        if (!$userIngredients) {
            alert('Please enter at least ONE ingredient you have into the search bar! 🍗');
        } else {
            //target the results instructions and clear the previous instructions so the new one can be displayed
            recipeApp.$resultsSteps.empty();

            //call the API to search some recipes based on user's inputs
            recipeApp.recipeSearch($userIngredients, $userCalories, $userDiet);
        }
    })
}

//run init here
$(document).ready(function(){
    recipeApp.init();
});