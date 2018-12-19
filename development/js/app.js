document.addEventListener("DOMContentLoaded",function() {

/****************\
|* Klasy        *|
\****************/

function Schedule(id, weekNumber, title, description) {
    this.id = id; // id przepisu
    this.title = title; // nazwa planu
    this.description = description; // opis planu
    this.weekNumber = weekNumber; // numer tygodnia do którego przypisany jest plan
    this.monday = []; // plan na poniedzialek
    this.tuesday = []; // plan na wtorek
    this.wednesday = []; // plan na środę
    this.thursday = []; // plan na czwartek
    this.friday = []; // plan na piątek
    this.saturday = []; // plan na sobotę
    this.sunday = []; // plan na niedzielę	
}

Schedule.prototype.showInfo = function() {
    console.warn("ID: ", this.id, "TYTUŁ: ", this.title); // wyświetl id oraz tytuł
    console.warn("OPIS: ",this.description); // wyświetl opis
    console.warn("Poniedziałek:");
    this.monday.forEach(function(elem, i) {
        console.warn(i, elem); // wyświetl każdy poskiłek z poniedziałku
    })
}

function Recipe(id, title, description) {
    this.id = id; // id przepisu
    this.title = title; // nazwa przepisu
    this.description = description; // opis przepisu
    this.ingredients = []; // składniki przepisu
    this.instructions = []; // instrukcje przepisu
}
  /* 
   Metoda `.showInfo()` 
   wyświetlająca w konsoli wszystkie informacje o przepisie */
Recipe.prototype.showInfo = function() {
    console.warn(this.id, this.title); // wyświetl id oraz tytuł
    console.warn(this.description); // wyświetl opis
    this.ingredients.map(function(elem, i) {
      console.warn(i, elem); // wyświetl każdy element
    })
    this.instructions.map(function(elem, i) {
      console.warn(i, elem); // wyświetl każdy element
    })
}
  

/***********\
|* Funkcje *|
\***********/

function addNewInstruction () {
    if (!recipeAdder.instructionInput.value) return;
    var newListElementContent = `
        ${recipeAdder.instructionInput.value}
        <button class="edit-instruction"><i class="far fa-edit"></i></button>
        <button class="delete-instruction"><i class="far fa-trash-alt"></i></button>
    `;
    var newListElement = document.createElement("li");
    newListElement.innerHTML = newListElementContent;
    recipeAdder.instructionInput.value = "";
    recipeAdder.instructionList.appendChild(newListElement);
    newListElement.querySelector(".delete-instruction").addEventListener("click", function () { 
        this.parentElement.remove();
    });
}

function addNewComponent () {
    if (!recipeAdder.componentInput.value) return;
    var newListElementContent = `
        ${recipeAdder.componentInput.value}
        <button class="edit-component"><i class="far fa-edit"></i></button>
        <button class="delete-component"><i class="far fa-trash-alt"></i></button>
    `;
    var newListElement = document.createElement("li");
    newListElement.innerHTML = newListElementContent;
    recipeAdder.componentInput.value = "";
    recipeAdder.componentList.appendChild(newListElement);
    newListElement.querySelector(".delete-component").addEventListener("click", function () {
        this.parentElement.remove();
    });
}


function createListItem(plan, type) { //type = "plan" albo "recipe"
    var newRowContent = `
        <div class="col-1-7"><div class="item-list-id">${plan.id}</div></div>
        <div class="col-1-7"><div class="item-list-name">${plan.title}</div></div>
        <div class="col-4-7">
            <div class="item-list-description">
                ${plan.description}
            </div>
        </div>
        <div class="col-1-7">
            <div class="item-list-actions">
                <button class="edit-${type}"><i class="far fa-edit"></i></button>
                <button class="delete-${type}"><i class="far fa-trash-alt"></i></button>
            </div>
        </div>
    `;
    var newListItem = document.createElement("div");
    newListItem.classList.add("row");
    newListItem.innerHTML = newRowContent;
    return newListItem;
}

function displayList (list, itemArray, type) {
    list.innerHTML = "";
    itemArray.forEach(function(item) {
        list.appendChild(createListItem(item, type));
    });
}

function createNotification(type, content) {
    var newMessage = document.createElement("span");
    newMessage.classList.add("notifications-message");
    if (type === "info") {
        newMessage.classList.add("info");
        newMessage.innerHTML = `
        
            <i class="fas fa-info-circle"></i>
                ${content}
            <i class="fas fa-window-close"></i>
       
        `;
    } else if (type === "warning") {
        newMessage.classList.add("warning");
        newMessage.innerHTML = `
      
            <i class="fas fa-exclamation-circle"></i>
                ${content}
            <i class="fas fa-window-close"></i>
      
        `;
    } else if (type === "success") {
        newMessage.classList.add("success");
        newMessage.innerHTML = `
     
            <i class="fas fa-check-circle"></i>
                ${content}
            <i class="fas fa-window-close"></i>
       
        `
    }
    
    return newMessage;
}

function displayNotifications() {
    if (allRecipes.length === 0) {
        notificationsContainer.appendChild(createNotification("warning", "Pamiętaj, aby dodać przepisy!"));
    } else if (allRecipes.length === 1) {
        notificationsContainer.appendChild(createNotification("info", "Masz jeden przepis!"))
    } else if (allRecipes.length <= 4) {
        notificationsContainer.appendChild(createNotification("info", `Masz już ${allRecipes.length} przepisy!`));
    } else {
        notificationsContainer.appendChild(createNotification("info", `Masz ${allRecipes.length} przepisów, nieźle!`));
    }

    if (allPlans.length === 0) {
        notificationsContainer.appendChild(createNotification("warning", "Pamiętaj aby dodać plan!"));
    } else if (allPlans.length === 1) {
        notificationsContainer.appendChild(createNotification("info", "Masz jeden przepis!"))
    } else if (allPlans.length <= 4) {
        notificationsContainer.appendChild(createNotification("info", `Masz już ${allPlans.length} plany!`));
    } else {
        notificationsContainer.appendChild(createNotification("info", `Masz ${allPlans.length} planów, nieźle!`));
    }

    notificationsContainer.appendChild(createNotification("success", "Świetnie, że jesteś! Udanego planowania i smacznego :)"));
    return document.querySelectorAll(".notifications-message");
}

function renderMealSchedule(plan, mealNumber) {
    var mealNames = ["śniadanie", "drugie śniadanie", "zupa", "drugie danie", "kolacja"]; //tablica wiąząca indeksy posiłków z nazwami
    var rowContent = `        
            <div class="col-1-7">
                ${(plan.monday[mealNumber] || mealNames[mealNumber])}
            </div>
            <div class="col-1-7">
                ${(plan.tuesday[mealNumber] || mealNames[mealNumber])}
            </div>
            <div class="col-1-7">
                ${(plan.wednesday[mealNumber] || mealNames[mealNumber])}
            </div>
            <div class="col-1-7">
                ${(plan.thursday[mealNumber] || mealNames[mealNumber])}
            </div>
            <div class="col-1-7">
                ${(plan.friday[mealNumber] || mealNames[mealNumber])}
            </div>
            <div class="col-1-7">
                ${(plan.saturday[mealNumber] || mealNames[mealNumber])}
            </div>
            <div class="col-1-7">
                ${(plan.sunday[mealNumber] || mealNames[mealNumber])}
            </div>
        
    `;
    var newRow = document.createElement("div");
    newRow.classList.add("row");
    newRow.innerHTML = rowContent;
    return newRow;
}

function renderPlan (plan) {
    var planMealList = document.querySelector(".plan-meal-list");
    planMealList.style.opacity = 0.3;
    setTimeout(function () {
        planMealList.innerHTML = "";
        for (var i = 0; i < MEALS_PER_DAY; i++) {
            planMealList.appendChild(renderMealSchedule(plan, i));
        }
        planMealList.style.opacity = 1;
        weekNumberInfo.textContent = currentPlan + 1;
    }, 200);
}

function switchDashboardContent (buttonId) {
    
    dashboardItems.forEach(function (item) {
       
        if (item.classList.contains(buttonId)) {
            
            item.classList.add("on-top");
        } else {
            item.classList.remove("on-top");
        }
    });
}

function sendName () {
    
    if (nameInput.value.length < 2) {
        setWarning("Imię zbyt krótkie.", 1000);
    } else if (nameInput.value.length > 100) {
        setWarning("Imię zbyt długie.", 1000);
    } else {
        nameDisplay.style.opacity = 0;
        name = nameInput.value;
        localStorage.savedName = name;
        setDashboardActive();
    }
 }

function setDashboardActive () {
    if (!name) return;
    setTimeout(function () {
        nameDisplay.textContent = name;
        nameDisplay.style.opacity = 1;
        replaceGreeting();
    }, 1000); 
    selectContentItem(document.querySelector("#dashboard"));
}

function replaceGreeting () {
    document.querySelector(".content h3").style.opacity = 0;
    document.querySelector(".content h4").textContent = "Tu możesz zmienić swoje imię.";
    document.querySelector(".content p").textContent = "";
}

function changeCard () {
    if (!name) {
        setWarning("Najpierw podaj imię!", 1000);
        return;
    }
    selectContentItem(this);               
}

function selectContentItem (activeButton) {

  
    //jezeli przycisk zostanie klikniety, przelec petla po wszystkich przyciskach i usun klase active
    buttons.forEach(function (button) {
        button.classList.remove("active");
        
    }); 
    
    //teraz przechodzimy petla po wszystkich kartach z trescia i usuwamy klase active
    contentItems.forEach(function(contentItem) {
   
        contentItem.classList.remove("active");
        //sprawdzamy, czy dana karta zawiera taka sama klase, jak klikniety przycisk
        if (contentItem.classList.contains(activeButton.id)) {
            //jezeli tak, to ta karta bedzie aktywna
       
            contentItem.classList.add("active");
        }
    });
    //na sam koniec ustawiamy klikniety przycisk jako aktywny
 
    activeButton.classList.add("active");
    setTimeout(function () {
        switchDashboardContent("main");
    }, 100);
}

function setWarning(text, duration) {
    warningMessage.classList.remove("inactive");
    if(warningTimer) {
        clearTimeout(warningTimer);
    }
    warningMessage.textContent = text;
    warningTimer = setTimeout(function() {
        warningMessage.classList.add("inactive");
    }, duration);
}



/***********\
|* Zmienne *|
\***********/

var name = "";
var warningTimer;
var counter = 0;

var MEALS_PER_DAY = 5;

var buttons = document.querySelectorAll(".button");
var dasboardButtons = document.querySelectorAll(".dashboard-main-top-panel button");
var dashboardItems = document.querySelectorAll(".dashboard-item");

var notificationsContainer = document.querySelector(".notifications");

var notificationMessages;

var contentItems = document.querySelectorAll(".content");
var nameDisplay = document.querySelector(".name");
var warningMessage = document.querySelector(".content-container span");
var homeButton = document.querySelector(".home");

var sendNameButton = document.querySelector(".send-name");
var nameInput = document.querySelector("#name");

var weekNumberInfo = document.querySelector(".plan-preview-title span");


var btnPrev = document.querySelector(".btn-prev");
var btnNext = document.querySelector(".btn-next");

var planList = document.querySelector(".plans .item-list-contents");
var recipeList = document.querySelector(".recipes .item-list-contents");
console.log(planList, recipeList);
// przygotowanie globalnej zmiennej przechowującej wszystkie plany
var allPlans = [];

// var allRecipes = [];
var allRecipes = [];
// var allRecipes = [1, 2, 3, 4, 5];

var recipeAdder = {
    nameInput: document.querySelector("#recipe-name"),
    descriptionInput: document.querySelector("#recipe-description"),
    instructionInput: document.querySelector(".instruction-input-box"),
    componentInput: document.querySelector(".components-input-box"),
    instructionList: document.querySelector(".instruction-list"),
    componentList: document.querySelector(".components-list"),
    addButton: document.querySelector(".add-recipe .btnApp"),
    addInstructionButton: document.querySelector(".add-instruction"),
    addComponentButton: document.querySelector(".add-component")
};

console.log(recipeAdder);

// utworzenie przykładowego obiektu planu
var newPlan = new Schedule(allPlans.length + 1, 41,"Mięsny Tydzień", "W tym tygodniu dieta jest wyjątkowo mięsna");
newPlan.monday = ["kiełbaska na gorąco","surowy boczek","zupa","schabowy","kiełbaska na gorąco"];
newPlan.tuesday = ["grzyby","surowy boczek","porosty","schabowy","flaki"];
newPlan.wednesday = ["kiełbaska na gorąco","surowy boczek","pączek","schabowy","kiełbaska na gorąco"];
newPlan.thursday = ["kaszanka","ochłap","zupa","schabowy","kiełbaska na gorąco"];
newPlan.friday = ["kiełbaska na gorąco","mózgi","zupa","schabowy","kiełbaska na gorąco"];
newPlan.saturday = ["kiełbaska na gorąco","surowy boczek","galareta","schabowy","kiełbaska na gorąco"];
newPlan.sunday = ["kiełbaska na gorąco","surowy boczek","zupa","ciasteczka","kiełbaska na gorąco"];
allPlans.push(newPlan);

var secondPlan = new Schedule(allPlans.length + 1, 42,"Grzybowy Tydzień", "Tutaj jemy same grzby");
secondPlan.monday = ["prawdziwek", "maślak", "borowik", "kania", "pieczarka"];
secondPlan.tuesday = ["prawdziwek", "muchomor", "borowik", "kania", "pieczarka"];
secondPlan.wednesday = ["prawdziwek", "maślak", "sromotnik", "kania", "pieczarka"];
secondPlan.thursday = ["prawdziwek", "maślak", "borowik", "grzybowa", "pieczarka"];
secondPlan.friday = ["prawdziwek", "maślak", "borowik", "kania", "grzyby w śmietanie"];
secondPlan.saturday = ["rydz", "maślak", "borowik", "kania", "pieczarka"];
secondPlan.sunday = ["prawdziwek", "purchawa", "borowik", "kania", "pieczarka"];

allPlans.push(secondPlan);
var thirdPlan = new Schedule(allPlans.length + 1, 43, "Kolejny plan", "Nie wiadomo co jemy");

var planArray = [];

allPlans.push(thirdPlan);
for (var i = 0; i < 10; i++) {
    var plan = new Schedule(allPlans.length + 1, i + 43, ("Kolejny plan nr " + i), "Nie wiadomo co jemy");
    allPlans.push(plan);
}


var currentPlan = 0; //w ktorym miejscu tablicy planow jestesmy


var newRecipe2 = new Recipe(allRecipes.length + 1, "Fasolka po bretońsku", "Taka fasolka że kołdrę podnosi!");
allRecipes.push(newRecipe2);
var newRecipe3 = new Recipe(allRecipes.length + 1, "Sałatka grecka", "Oryginalna sałatka grecka z pomidora, ogórka, czerwonej cebuli i czarnych oliwek, z oliwą i oregano. ");
allRecipes.push(newRecipe3);

var newRecipe1 = new Recipe(allRecipes.length + 1, "Jajecznica na boczku", "Taką jajecznicę lubie najbardziej ;p ");
// dodawanie składników do przepisu (newRecipe1, allRecipies[0])
newRecipe1.ingredients.push("3 jajka"); 
newRecipe1.ingredients.push("mała cebula"); 
newRecipe1.ingredients.push("szczypiorek"); 
newRecipe1.ingredients.push("5 plasterków boczku"); 

newRecipe1.instructions.push("Rozpuść masło na patelni i podgrzej.");
newRecipe1.instructions.push("Dodaj boczek."); 
newRecipe1.instructions.push("Na rozgrzaną patelnię wbij jajaka i mieszaj doprawiając."); 
newRecipe1.instructions.push("Podawaj z grzankami. Smacznego!"); 

allRecipes.push(newRecipe1); // dodanie przepisu do globalnej tablicy

/**********\
|* Logika *|
\**********/
newPlan.showInfo();

notificationMessages = displayNotifications();
// localStorage.savedName = ""; //debug
displayList(planList, allPlans, "plan");
displayList(recipeList, allRecipes, "recipe");

if (localStorage.savedName) {
    name = localStorage.savedName;
    nameInput.value = name;
    setDashboardActive ();
} 

if (!name) {
    nameDisplay.textContent = "";
    document.querySelector("#user").classList.add("active");
}


buttons.forEach(function(button) {
    //do kazdego przycisku dodajemy funkcję do klikania
    button.addEventListener("click", changeCard);
}); 

sendNameButton.addEventListener("click", function (event) {
    event.preventDefault();
    sendName();
});
nameInput.addEventListener("keypress", function (event) {
  
    // event.preventDefault();
    if (event.keyCode === 13 && document.querySelector("#user").classList.contains("active")) { // enter
        sendName();
    }
});

homeButton.addEventListener("click", function (event) {
    event.preventDefault();
    setDashboardActive();
});

dasboardButtons.forEach(function(button) {
    button.addEventListener("click", function () {
        switchDashboardContent (this.id);
    });
});

notificationMessages.forEach(function (message) {
    message.addEventListener("click", function () {
        var currentMessage = this;
        currentMessage.style.opacity = 0;
        
        setTimeout(function () {
            currentMessage.remove();
        }, 300);
    });
})


weekNumberInfo.textContent = currentPlan + 1;
renderPlan(newPlan);

btnPrev.addEventListener("click", function (event) {
    event.preventDefault();
    
    if (currentPlan === 0) return;
    currentPlan--;
    btnNext.classList.remove("disabled");
    renderPlan(allPlans[currentPlan]);
    if (currentPlan === 0) {
        btnPrev.classList.add("disabled");
    } else {
        btnPrev.classList.remove("disabled");
    }
});

btnNext.addEventListener("click", function (event) {
    event.preventDefault();
   
    if (currentPlan === allPlans.length - 1) return;
    currentPlan++;
    btnPrev.classList.remove("disabled");
    renderPlan(allPlans[currentPlan]);
    if (currentPlan === allPlans.length - 1) {
        btnNext.classList.add("disabled");
    } else {
        btnNext.classList.remove("disabled");
    }
});

recipeAdder.addInstructionButton.addEventListener("click", addNewInstruction);
recipeAdder.instructionInput.addEventListener("keypress", function (event) {
    if (event.keyCode === 13) {
        addNewInstruction();
    }
});

recipeAdder.addComponentButton.addEventListener("click", addNewComponent);
recipeAdder.componentInput.addEventListener("keypress", function (event) {
    if (event.keyCode === 13) {
        addNewComponent();
    }
});

recipeAdder.addButton.addEventListener("click", function (event) {
    event.preventDefault();
    if (!recipeAdder.nameInput.value || !recipeAdder.descriptionInput.value) return;
    var recipeToAdd = new Recipe(allRecipes.length + 1, recipeAdder.nameInput.value, recipeAdder.descriptionInput.value);
    var instructionElements = recipeAdder.instructionList.querySelectorAll("li");
    instructionElements.forEach(function (element) {
        recipeToAdd.instructions.push(element.innerText);
    });
    console.log(recipeToAdd.instructions);
    var componentElements = recipeAdder.componentList.querySelectorAll("li");
    componentElements.forEach(function (element) {
        recipeToAdd.ingredients.push(element.innerText);
    });
    console.log(recipeToAdd.ingredients);
    allRecipes.push(recipeToAdd);
    console.log(allRecipes);
    displayList(recipeList, allRecipes, "recipe");
    recipeAdder.descriptionInput.value = "";
    recipeAdder.nameInput.value = "";
    recipeAdder.instructionList.innerHTML = "";
    recipeAdder.componentList.innerHTML = "";
    switchDashboardContent("main");
});

});

//   Metoda `.saveToLocalStorage()` 
//   zapisująca do localStorage informacje o przepisie */
//   Schedule.prototype.saveToLocalStorage = function() {
//     /* if(){
//         // uzupełnij
//       }else{
//         // uzupełnij
//       } */
//   }


// function Recipe(id, title, description) {
//     this.id = id; // id przepisu
//     this.title = title; // nazwa przepisu
//     this.description = description; // opis przepisu
//     this.ingredients = []; // składniki przepisu
//     this.instructions = []; // instrukcje przepisu
//   }
//   /* 
//    Metoda `.showInfo()` 
//    wyświetlająca w konsoli wszystkie informacje o przepisie */
//   Recipe.prototype.showInfo = function() {
//     console.warn(this.id, this.title); // wyświetl id oraz tytuł
//     console.warn(this.description); // wyświetl opis
//     this.ingredients.map(function(elem, i) {
//       console.warn(i, elem); // wyświetl każdy element
//     })
//     this.instructions.map(function(elem, i) {
//       console.warn(i, elem); // wyświetl każdy element
//     })
//   }
  
//   /* 
//   Metoda `.saveToLocalStorage()` 
//   zapisująca do localStorage informacje o przepisie */
//   Recipe.prototype.saveToLocalStorage = function() {
//     /* if(){
//         // uzupełnij
//       }else{
//         // uzupełnij
//       } */
//   }
  
//   // przygotowanie globalnej zmiennej przechowującej wszystkie przepisy
//   var allRecipies = [];
  
//   // utworzenie kilku przykładowych przepisów 
//   var newRecipe1 = new Recipe(allRecipies.length + 1, "Jajecznica na boczku", "Taką jajecznicę lubie najbardziej ;p ");
//   allRecipies.push(newRecipe1); // dodanie przepisu do globalnej tablicy
//   var newRecipe2 = new Recipe(allRecipies.length + 1, "Fasolka po bretońsku", "Taka fasolka że kołdrę podnosi!");
//   allRecipies.push(newRecipe2);
//   var newRecipe3 = new Recipe(allRecipies.length + 1, "Sałatka grecka", "Oryginalna sałatka grecka z pomidora, ogórka, czerwonej cebuli i czarnych oliwek, z oliwą i oregano. ");
//   allRecipies.push(newRecipe3);
  
//   // dodawanie składników do przepisu (newRecipe1, allRecipies[0])
//   newRecipe1.ingredients.push("3 jajka"); 
//   newRecipe1.ingredients.push("mała cebula"); 
//   newRecipe1.ingredients.push("szczypiorek"); 
//   newRecipe1.ingredients.push("5 plasterków boczku"); 
  
//   newRecipe1.instructions.push("Rozpuść masło na patelni i podgrzej.");
//   newRecipe1.instructions.push("Dodaj boczek."); 
//   newRecipe1.instructions.push("Na rozgrzaną patelnię wbij jajaka i mieszaj doprawiając."); 
//   newRecipe1.instructions.push("Podawaj z grzankami. Smacznego!"); 
  
//   console.clear();
//   allRecipies[0].showInfo(); // wyświetla pierwszy przepis w konsoli