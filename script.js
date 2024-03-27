let basketTitels = [];
let basketPrices = [];
let basketAmounts = [];
let stateHeartIcon = false;

loadBasket();


function init() {
    renderDishes();
    renderBasket();
}


function updateBasket() {
    saveBasket();
    renderBasket();
}


function renderDishes() {           // Rendert die Gerichte-Liste aus dem JSON-Array.
    let foodList = document.getElementById('food_list');
    foodList.innerHTML = '';

    for (let i = 0; i < dishes.length; i++) {
        let dish = dishes[i];
        let typeOfDish = dish['type'];
        let selectionImg = checkTypeOfDish(typeOfDish);

        foodList.innerHTML += dishesHTML(i, dish, selectionImg);
    }
}


function checkTypeOfDish(typeOfDish) {      // Prüft den Typ des Gerichtes und gibt das Image zurück
    switch (typeOfDish) {
        case 'salad':
            return '<img id="selection_img_salad" class="selection-img" src="./img/salad.jpg" alt="selection-img">';
        case 'pizza':
            return '<img id="selection_img_pizza" class="selection-img" src="./img/pizza.jpg" alt="selection-img">';
        case 'pasta':
            return '<img id="selection_img_pasta" class="selection-img" src="./img/pasta.jpg" alt="selection-img">';
        default:
            return '';
    }
}


function dishesHTML(i, dish, selectionImg) {        // HTML-Template für die Gerichte
    return /*html*/ `
        ${selectionImg}
        <div class="food-card" onclick="addToBasket(${i})">
            <div>
                <span class="food-card-name">${dish['name']}</span>
                <span>${dish['description']}</span>
                <div class="food-card-price">${dish['price'].toFixed(2).replace('.' , ',')} €</div>
            </div>
            <div class="food-card-right" id="food_card_icon_${i}">
                <img class="food-card-icon" src="./img/plus.png" alt="plus">
            </div>
        </div>
    `;
}


function addToBasket(i) {           // Funktion zum Hinzufügen der Gerichte in den Warenkorb.
    let arrayIndexBasket = getBasketIndex(i);

    if (arrayIndexBasket == -1) {           // Prüft ob das Gericht bereits im Warenkorb enthalten ist
        basketTitels.push(dishes[i]['name']);
        basketPrices.push(dishes[i]['price']);
        basketAmounts.push(1);
        updateBasket();
    } else {                                // Für Gerichte, die sich bereits im Warenkorb befinden
        basketAmounts[arrayIndexBasket]++;
        basketPrices[arrayIndexBasket] = basketPrices[arrayIndexBasket] + dishes[i]['price'];
        updateBasket();
    }
}


function renderBasket() {           // Rendert den Warenkorb mit den aktuellen Informationen.
    let basketContainer = document.getElementById('basket_container');
    basketContainer.innerHTML = '';
    
    if (basketTitels.length == 0) {     //Prüft ob der Warenkorb leer ist.
        basketContainer.innerHTML = emptyBasketHTML();
    } else {        //Wenn der Warenkorb nicht leer ist.
        basketContainer.innerHTML += basketListHTML();

        for (let j = 0; j < basketTitels.length; j++) {
            document.getElementById('basket_list').innerHTML += fullBasketHTML(j);
        }
        calculateBasketSum(basketContainer);
    }
    showAmountMobileBasketButton();
    renderMobileBasket();
}


function emptyBasketHTML() {            // HTML-Template für den leeren Warenkorb
    return /*html*/ `
        <img class="basket-icon" src="./img/basket.png" alt="basket">
        <h4>Fülle deinen Warenkorb</h4>
        <p>Füge einige leckere Gerichte aus der Speisekarte hinzu und bestelle dein Essen.</p>
    `;
}


function basketListHTML() {             // HTML-Template für die Liste des Warenkorbs
    return /*html*/ `
        <img class="delivery-boy" src="./img/delivery.png" alt="delivery">
        <div id="basket_list" class="basket-list"></div>
    `;
}


function fullBasketHTML(j) {            // HTML-Template für Elemente, die sich im Warenkorb befinden
    return /*html*/ `
        <div class="food-card-basket">
            <div class="food-card-basket-head">
                <div>${basketAmounts[j]}</div>
                <div>${basketTitels[j]}</div>
                <div class="food-card-basket-sum">${basketPrices[j].toFixed(2).replace('.' , ',')} €</div>
                <img onclick="deleteFromBasket(${j})" class="food-card-basket-trash" src="./img/trash.png" alt="trash">
            </div>
            <div class="basket-plus-minus">
                <img onclick="reduceBasket(${j})" src="./img/minus.png" alt="minus">
                <img onclick="increaseBasket(${j})" src="./img/plus.png" alt="plus">
            </div>
            <div class="separator"></div>
        </div>
    `;
}


function calculateBasketSum(basketContainer) {           // Bestimmt die Zwischensumme und das Endergebnis des Warenkorbs
    let subtotalBasket = 0;
    basketPrices.forEach((element) => subtotalBasket += element);
    let finalSum = subtotalBasket + 4.95;

    if (subtotalBasket < 30) {          //Mindestbestellwert nicht erreicht (es kann nicht bezahlt werden!)
        basketContainer.innerHTML += minOrderValueNotReached(subtotalBasket);
    } else {                            //Mindestbestellwert erreicht
        basketContainer.innerHTML += minOrderValueReached(subtotalBasket, finalSum);
    }
}


function minOrderValueNotReached(subtotalBasket) {          // HTML-Template wenn die Mindestbestellmenge nicht erreicht ist
    return /*html*/ `
        <div class="basket-sum-container">
            <div class="basket-sum">
                <div>Zwischensumme</div>
                <div>${subtotalBasket.toFixed(2).replace('.' , ',')} €</div>
            </div>
            <p>
                Leider kannst du noch nicht bestellen. Restaurant Tobys liefert erst ab einem <b>Mindestbestellwert von 30,00 €</b> (exkl. Lieferkosten)
            </p>
            <button class="basket-sum-button-1">Bezahlen (${subtotalBasket.toFixed(2).replace('.' , ',')} €)</button>
        </div>
    `;
}


function minOrderValueReached(subtotalBasket, finalSum) {           // HTML-Template wenn die Mindestbestellmenge erreicht wurde
    return /*html*/ `
        <div class="basket-sum-container">
            <div class="basket-sum">
                <div>Zwischensumme</div>
                <div>${subtotalBasket.toFixed(2).replace('.' , ',')} €</div>
            </div>
            <div class="basket-sum">
                <div>Lieferkosten</div>
                <div>4,95 €</div>
            </div>
            <div class="basket-sum">
                <div><b>Gesamt</b></div>
                <div><b>${finalSum.toFixed(2).replace('.' , ',')} €</b></div>
            </div>
            <button class="basket-sum-button-2" onclick="payBasket()">Bezahlen (${finalSum.toFixed(2).replace('.' , ',')} €)</button>
        </div>
    `;
}


function reduceBasket(j) {            // Funktion für den Minus-Button: Reduziert das jeweilige Gericht.
    if (basketAmounts[j] - 1 == 0) {
        deleteFromBasket(j);
    } else {
        basketAmounts[j]--;
        basketPrices[j] = basketPrices[j] - dishes[getDishesIndex(j)]['price'];
        updateBasket();
    }
}


function increaseBasket(j) {             // Funktion für den Plus-Button: Erhöht das jeweilige Gericht.
    basketAmounts[j]++;
    basketPrices[j] = basketPrices[j] + dishes[getDishesIndex(j)]['price'];
    updateBasket();
}


function deleteFromBasket(j) {          // Löscht das jeweilige Gericht komplett aus dem Warenkorb.   
    basketTitels.splice(j, 1);
    basketPrices.splice(j, 1);
    basketAmounts.splice(j, 1);
    updateBasket();
}


function payBasket() {                  // Warenkorb bezahlen und die Arrays zurücksetzen.
    let basket = document.getElementById('basket');
    basket.innerHTML = /*html*/ `
        <p class="text-pay-basket">Vielen Dank<br>für Ihre Bestellung!</p>
        <button class="pay-basket-button" onclick="location.reload()">Neue Bestellung</button>
    `;
    basketTitels = [];
    basketPrices = [];
    basketAmounts = [];
    saveBasket();
    payMobileBasket();
}


function saveBasket() {         // Speichert jegliche Veränderung der Arrays in den localStorage ab.
    localStorage.setItem('foodName', JSON.stringify(basketTitels));
    localStorage.setItem('foodPrice', JSON.stringify(basketPrices));
    localStorage.setItem('foodAmount', JSON.stringify(basketAmounts));
}


function loadBasket() {         // Speichert die aktuellen Gerichte aus dem localStorage in die Arrays.(wird ganz am Anfang ausgeführt)
    let basketTitelsAsText = localStorage.getItem('foodName');
    let basketPricesAsText = localStorage.getItem('foodPrice');
    let basketAmountsAsText = localStorage.getItem('foodAmount');
    
    if(basketTitelsAsText && basketPricesAsText && basketAmountsAsText) {
        basketTitels = JSON.parse(basketTitelsAsText);
        basketPrices = JSON.parse(basketPricesAsText);
        basketAmounts = JSON.parse(basketAmountsAsText);
    }
}


function showSelection(id) {        // Markiert das jeweilige Gericht im Auswahl-Feld
    removeSelectionHighlight();
    document.getElementById(id).classList.add('highlighted');
}


function removeSelectionHighlight() {       // Entfernt die Markierung von allen Gerichten des Auswahl-Feldes
    document.getElementById('selection_salad').classList.remove('highlighted');
    document.getElementById('selection_pizza').classList.remove('highlighted');
    document.getElementById('selection_pasta').classList.remove('highlighted');
}


window.onscroll = () => {        // Funktion, die die y-Scroll-Position ermittelt und demnach die Auswahlleiste markiert.
    let yScrollPosition = window.scrollY;
    let saladImgPosition = document.getElementById('selection_img_salad').offsetTop - 4;
    let pizzaImgPosition = document.getElementById('selection_img_pizza').offsetTop - 4;
    let pastaImgPosition = document.getElementById('selection_img_pasta').offsetTop - 4;

    if (yScrollPosition < saladImgPosition) {
        removeSelectionHighlight();
    } else if (yScrollPosition >= saladImgPosition && yScrollPosition < pizzaImgPosition) {
        showSelection('selection_salad');
    } else if (yScrollPosition >= pizzaImgPosition && yScrollPosition < pastaImgPosition) {
        showSelection('selection_pizza');
    } else if (yScrollPosition >= pastaImgPosition) {
        showSelection('selection_pasta');
    }
}


function getDishesIndex(j) {          // Hilfsfunktion, die den Index aus der Gerichte-Liste zurückgibt, wo der Name mit dem Warenkorb übereinstimmt.
    return dishes.findIndex((element) => element.name === basketTitels[j]);
}


function getBasketIndex(i) {     // Hilfsfunktion, die den Index aus dem Warenkorb ausgibt, der mit dem Gericht übereinstimmt.
    return basketTitels.indexOf(dishes[i]['name']);
}


function like() {               // Like-Funktion für das Herz-Icon des Restaurants
    let heartIcon = document.getElementById('heart_icon');

    if (stateHeartIcon) {
        heartIcon.src = './img/heart.png';
        stateHeartIcon = false;
    } else {
        heartIcon.src = './img/heart_red.png';
        stateHeartIcon = true;
    }
}


// Funktionen für die Mobile-Ansicht:
function showAmountMobileBasketButton() {           // Zeigt die Anzahl der Gerichte im Warenkorb auf dem Mobilen-Warenkorb-Button an.
    let mobileBasketButton = document.getElementById('mobile_basket_button');
    mobileBasketButton.innerHTML = `
        Warenkorb anzeigen (${basketTitels.length})
    `;
}


function showMobileBasket() {           // Legt ein div über den gesamten Inhalt und zeigt damit den mobilen Warenkorb an.
    getMobileBasket().classList.remove('d-none');
    document.body.classList.add('overflow-hidden');
    renderMobileBasket();
}


function closeMobileBasket() {          // Schließt den mobilen Warenkorb wieder.
    getMobileBasket().classList.add('d-none');
    document.body.classList.remove('overflow-hidden');
}


function renderMobileBasket() {             // Rendert den mobilen Warenkorb.
    let mobileBasket = getMobileBasket();
    mobileBasket.innerHTML = mobileBasketHeadlineHTML();

    if (basketTitels.length == 0) {     //Prüft ob der Warenkorb leer ist.
        mobileBasket.innerHTML += emptyBasketHTML();
    } else {        //Wenn der Warenkorb nicht leer ist.
        mobileBasket.innerHTML += mobileBasketListHTML();
        for (let j = 0; j < basketTitels.length; j++) {
            document.getElementById('mobile_basket_list').innerHTML += fullBasketHTML(j);
        }
        calculateBasketSum(mobileBasket);
    }
}


function mobileBasketHeadlineHTML() {           // HTML-Template
    return /*html*/ `
        <h3 class="margin-btm">Warenkorb</h3>
        <img class="cancel-img" src="./img/cancel.png" onclick="closeMobileBasket()" alt="cancel">
    `;
}


function mobileBasketListHTML() {               // HTML-Template
    return /*html*/ `
        <img class="delivery-boy" src="./img/delivery.png" alt="delivery">
        <div id="mobile_basket_list" class="mobile-basket-list"></div>
    `;
}


function payMobileBasket() {                // Funktion für das Bezahlen des mobilen Warenkorbs
    getMobileBasket().innerHTML = /*html*/ `
        <p class="text-pay-basket">Vielen Dank<br>für Ihre Bestellung!</p>
        <button class="pay-basket-button" onclick="location.reload()">Neue Bestellung</button>
    `;
}


function getMobileBasket() {            // Hilfsfunktion für das HTML-Element des mobilen Warenkorbs
    return document.getElementById('mobile_basket');
}