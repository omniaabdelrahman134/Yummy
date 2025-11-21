const nav = document.querySelector('nav');
const btnOpen = document.getElementById('btnOpen');
const items = document.querySelectorAll('.links li');
const searchItem = document.getElementById('Search');
const searchBtn = document.getElementById('searchBtn');
const search_by_name = document.getElementById('search_by_name');
const search_by_letter = document.getElementById('search_by_letter');
const catItem = document.getElementById('categories');
const catElements = document.getElementById('CategoriesElements');
const catEl = document.getElementById('catEl');
const areaItem = document.getElementById('area');
const areaElements = document.getElementById('areaElements');
const areaEl = document.getElementById('areaEl');
const ingredinetsItem = document.getElementById('ingredinets');
const ingredinetsElements = document.getElementById('ingredinetsElements');
const ingredinetsEl = document.getElementById('ingredinetsEl');
const contactItem = document.getElementById('contact');
const contactElements = document.getElementById('contactEl');
const contactEl = document.getElementById('contactElement');
const password = document.getElementById('inputPass');
const rePassword = document.getElementById('inputRePass');
const nameInput = document.getElementById('inputName');
const emailInput = document.getElementById('inputEmail');
const phoneInput = document.getElementById('inputPhone');
const ageInput = document.getElementById('inputAge');

let descriptionHTml = document.getElementById('description');
let mealsHtml = document.getElementById('meals');
let mealList = [];
let categoriesList = [];
let areasList = [];
let ingredientsList = [];

let inputRegex = {
  name: /^[a-zA-Z ]+$/,
  email:
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  phone: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
  age: /^(0?[1-9]|[1-9][0-9]|[1][1-9][1-9]|200)$/,
  password: /^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/,
};

$(document).ready(() => {
  searchMealsByName().then(() => {
    $('.loading-screen').fadeOut(500);
    $('body').css('overflow', 'visible');
  });
});

function resetLinks() {
  items.forEach((item) => {
    item.style.top = '50px';
    item.style.opacity = '0';
  });
}
function CloseNav() {
  nav.classList.remove('active');
  btnOpen.classList.remove('d-none');
  btnClose.classList.add('d-none');
}
searchMealsByName();
$('.loading-screen').fadeIn(300);

async function searchMealsByName(tool = 'search', letters = 's', item = '') {
  let meals = await fetch(
    `https://www.themealdb.com/api/json/v1/1/${tool}.php?${letters}=${item}`
  );
  let response = await meals.json();
  mealList = response.meals;

  let box = ``;

  for (let i = 0; i < mealList.length; i++) {
    box += `
                <div role="button" onclick ="loadMealDetails('${mealList[i].idMeal}')" class=" col-md-3">
                    <div class="position-relative rounded-2 overflow-hidden">
                        <img src="${mealList[i].strMealThumb}" alt="${mealList[i].strMeal}" class="rounded img-fluid">
                        <div
                            class="meal-layer position-absolute d-flex flex-column justify-content-center align-items-center text-white text-center p-2">
                            <h3 class="text-black">${mealList[i].strMeal}</h3>
                        </div>
                    </div>
                </div>
            `;
  }
  areaEl.classList.add('d-none');
  contactElements.classList.add('d-none');
  catElements.classList.add('d-none');
  ingredinetsElements.classList.add('d-none');
  descriptionHTml.classList.remove('d-none'); 

  mealsHtml.innerHTML = box;
  mealsHtml.classList.remove('d-none');
  $('.loading-screen').fadeOut(300);
}
// ==================== GoTo Functions ====================//

function goToCatList(category) {
  $('.loading-screen').fadeIn(300);

  mealsHtml.classList.remove('d-none');
  catElements.classList.add('d-none');
  searchMealsByName('filter', 'c', category);
  console.log(category);
  $('.loading-screen').fadeOut(300);
}

function goToAreaList(area) {
  $('.loading-screen').fadeIn(300);

  mealsHtml.classList.remove('d-none');
  areaEl.classList.add('d-none');
  searchMealsByName('filter', 'a', area);
  console.log(area);
  $('.loading-screen').fadeOut(300);
}

function goToIngredinetsList(ingredient) {
  $('.loading-screen').fadeIn(300);

  mealsHtml.classList.remove('d-none');
  ingredinetsElements.classList.add('d-none');
  searchMealsByName('filter', 'i', ingredient);
  // console.log(ingredient);
  $('.loading-screen').fadeOut(300);
}
// ==================== Dispaly Functions ====================//
function dispalyDescription(idx) {
  $('.loading-screen').fadeIn(300);

  let ingredients = [];
  for (let i = 1; i <= 20; i++) {
    let ingredient = idx[`strIngredient${i}`];
    if (ingredient) {
      ingredients += `<li class=" alert alert-info m-2 p-1">${ingredient}</li>`;
    }
  }

  let box = `<div class="col-md-4">
                    <img src="${idx.strMealThumb}" alt="${
    idx.strMeal
  }" class="img-fluid rounded">
                    <h3>${idx.strMeal}</h3>
                </div>
                <div class="col-md-8 text-capitalize">
                    <h2>instructions</h2>
                    <p>${idx.strInstructions.slice(0, 600)}.</p>
                    <h3><strong>Area</strong> : ${idx.strArea}</h3>
                    <h3><strong>Category</strong> : ${idx.strCategory}</h3>
                    <h3>Recipes :</h3>
                    <ul class="d-flex flex-wrap p-0 gap-2">
                        ${ingredients}
                    </ul>
                    <h3>tags :</h3>
                    <a href="${
                      idx.strSource
                    }" target="_blank"><button class="btn btn-success text-white text-capitalize me-2">source</button></a>
                    <a href="${
                      idx.strYoutube
                    }" target="_blank"><button class="btn btn-danger text-white text-capitalize">youtube</button></a>
                </div>`;

  mealsHtml.classList.add('d-none');
  searchBtn.classList.add('d-none');
  descriptionHTml.innerHTML = box;
  $('.loading-screen').fadeOut(300);
}

async function loadMealDetails(mealId) {
  let res = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`
  );
  let data = await res.json();
  let fullMeal = data.meals[0];
  // console.log(fullMeal);

  dispalyDescription(fullMeal);
}

async function displayCategories() {
  $('.loading-screen').fadeIn(300);

  try {
    let res = await fetch(
      'https://www.themealdb.com/api/json/v1/1/categories.php'
    );
    let data = await res.json();
    categoriesList = data.categories;
    // console.log(data.categories);
  } catch (err) {
    console.error('Error:', err);
  }
  searchBtn.classList.add('d-none');
  mealsHtml.classList.add('d-none');
  ingredinetsElements.classList.add('d-none');
  areaEl.classList.add('d-none');
  contactElements.classList.add('d-none');
  descriptionHTml.classList.add('d-none');

  let box = ``;

  for (let i = 0; i < categoriesList.length; i++) {
    box += ` <div class="col-md-3">
                    <div role = "button" onclick="goToCatList('${
                      categoriesList[i].strCategory
                    }')"
 class="position-relative rounded-2 overflow-hidden">
                        <img src="${categoriesList[i].strCategoryThumb}" alt="${
      categoriesList[i].strCategory
    }" class=" rounded img-fluid"><div
                            class="meal-layer position-absolute d-flex flex-column justify-content-center align-items-center text-white text-center p-2">
                            <h3 class="text-black">${
                              categoriesList[i].strCategory
                            }</h3>
                            <p class="text-black">${categoriesList[
                              i
                            ].strCategoryDescription.slice(0, 60)}</p>
                        </div>
                    </div>
                </div> `;
  }
  catEl.innerHTML = box;
  $('.loading-screen').fadeOut(300);
}

async function displayAreas() {
  $('.loading-screen').fadeIn(300);

  try {
    let res = await fetch(
      'https://www.themealdb.com/api/json/v1/1/list.php?a=list'
    );
    let data = await res.json();
    areasList = data.meals;
    // console.log(areasList);
  } catch (error) {
    console.error('Error:', error);
  }

  searchBtn.classList.add('d-none');
  mealsHtml.classList.add('d-none');
  ingredinetsElements.classList.add('d-none');
  contactElements.classList.add('d-none');
  catElements.classList.add('d-none');
  descriptionHTml.classList.add('d-none');

  let box = ``;
  for (let i = 0; i < areasList.length; i++) {
    box += `<div role ="button" onclick="goToAreaList('${areasList[i].strArea}')" class="col-md-3">
                    <div class=" text-capitalize text-white text-center ">
                        <i class="mb-1 fa-solid fa-house-laptop fa-4x"></i>
                        <div>
                            <h3>${areasList[i].strArea}</h3>
                        </div>
                    </div>
                </div>`;
  }
  areaElements.innerHTML = box;
  $('.loading-screen').fadeOut(300);
}

async function displayIngredients() {
  $('.loading-screen').fadeIn(300);
  try {
    let res = await fetch(
      'https://www.themealdb.com/api/json/v1/1/list.php?i=list'
    );
    let data = await res.json();
    ingredientsList = data.meals;
    // console.log(ingredientsList);
  } catch (error) {
    console.error('Error:', error);
  }

  searchBtn.classList.add('d-none');
  mealsHtml.classList.add('d-none');
  areaEl.classList.add('d-none');
  contactElements.classList.add('d-none');
  catElements.classList.add('d-none');
  descriptionHTml.classList.add('d-none');

  let box = ``;
  for (let i = 0; i < ingredientsList.length; i++) {
    if (ingredientsList[i].strDescription == null) {
      ingredientsList[i].strDescription = 'no description available';
    }
    box += `<div role ="button" onclick="goToIngredinetsList('${
      ingredientsList[i].strIngredient
    }')" class="col-md-3">
                    <div class=" text-capitalize text-white text-center ">
                        <i class="fa-solid fa-drumstick-bite fa-4x"></i>
                        <div>
                            <h3>${ingredientsList[i].strIngredient}</h3>
                            <p>${ingredientsList[i].strDescription
                              .split(' ')
                              .slice(0, 20)
                              .join(' ')}</p>
                        </div>
                    </div>
                </div>`;
  }
  ingredinetsEl.innerHTML = box;
  $('.loading-screen').fadeOut(300);
}

// ==================== Validation Functions ====================//
function validateName() {
  let nameValue = nameInput.value;

  if (inputRegex.name.test(nameValue)) {
    document.getElementById('nameAlert').classList.add('d-none');
  } else {
    document.getElementById('nameAlert').classList.remove('d-none');
  }
}

function validateEmail() {
  let emailValue = emailInput.value;

  if (inputRegex.email.test(emailValue)) {
    document.getElementById('EmailAlert').classList.add('d-none');
  } else {
    document.getElementById('EmailAlert').classList.remove('d-none');
  }
}
function validatePhone() {
  let phoneValue = phoneInput.value;

  if (inputRegex.phone.test(phoneValue)) {
    document.getElementById('phoneAlert').classList.add('d-none');
  } else {
    document.getElementById('phoneAlert').classList.remove('d-none');
  }
}
function validateAge() {
  let ageValue = ageInput.value;

  if (inputRegex.age.test(ageValue)) {
    document.getElementById('AgeAlert').classList.add('d-none');
  } else {
    document.getElementById('AgeAlert').classList.remove('d-none');
  }
}
function validatePass() {
  let passValue = password.value;

  if (inputRegex.password.test(passValue)) {
    document.getElementById('passAlert').classList.add('d-none');
  } else {
    document.getElementById('passAlert').classList.remove('d-none');
  }
}
function validateRePass() {
  let repassValue = rePassword.value;
  let passValue = password.value;

  if (repassValue === passValue && repassValue != '') {
    document.getElementById('repassAlert').classList.add('d-none');
  } else {
    document.getElementById('repassAlert').classList.remove('d-none');
  }
}

nameInput.addEventListener('input', validateName);
emailInput.addEventListener('input', validateEmail);
phoneInput.addEventListener('input', validatePhone);
ageInput.addEventListener('input', validateAge);
password.addEventListener('input', validatePass);
rePassword.addEventListener('input', validateRePass);
submitBtn.addEventListener('click', () => {
  nameInput.value = '';
  emailInput.value = '';
  phoneInput.value = '';
  ageInput.value = '';
  password.value = '';
  rePassword.value = '';
});

// ==================== Event Listeners ====================//
btnOpen.addEventListener('click', () => {
  nav.classList.add('active');
  btnOpen.classList.add('d-none');
  btnClose.classList.remove('d-none');

  resetLinks();

  items.forEach((item, i) => {
    setTimeout(() => {
      item.style.top = '0';
      item.style.opacity = '1';
    }, (i + 5) * 100);
  });
});

searchItem.addEventListener('click', () => {
  searchBtn.classList.remove('d-none');
  CloseNav();
  mealsHtml.classList.remove('d-none');       // meals should show
  descriptionHTml.classList.add('d-none');
  catElements.classList.add('d-none');
  areaEl.classList.add('d-none');
  ingredinetsElements.classList.add('d-none');
  contactElements.classList.add('d-none');
});

search_by_name.addEventListener('input', () => {
  let name = search_by_name.value.toLowerCase();
  searchMealsByName('search', 's', name);
  // console.log(name);
});

search_by_letter.addEventListener('input', () => {
  let letter = search_by_letter.value.toLowerCase().slice(0, 1);

  searchMealsByName('search', 's', letter);
  // console.log(name);
});

catItem.addEventListener('click', () => {
  CloseNav();
  catElements.classList.remove('d-none');
  displayCategories();
});

areaItem.addEventListener('click', () => {
  CloseNav();
  areaEl.classList.remove('d-none');
  displayAreas();
});

ingredinetsItem.addEventListener('click', () => {
  CloseNav();
  ingredinetsElements.classList.remove('d-none');
  displayIngredients();
});

contactItem.addEventListener('click', () => {
  CloseNav();
  $('.loading-screen').fadeIn(300);

  mealsHtml.classList.add('d-none');
  searchBtn.classList.add('d-none');
  descriptionHTml.classList.add('d-none');
  ingredinetsElements.classList.add('d-none');
  areaEl.classList.add('d-none');
  catElements.classList.add('d-none');
  contactElements.classList.remove('d-none');
  // displayContact();
  $('.loading-screen').fadeOut(300);
});
