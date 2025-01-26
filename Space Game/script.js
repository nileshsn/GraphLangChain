let health = 100;
let fuel = 50;
let distance = 0;

const button1 = document.querySelector('#button1');
const button2 = document.querySelector('#button2');
const button3 = document.querySelector('#button3');
const button4 = document.querySelector('#button4');
const text = document.querySelector('#text');
const healthSpan = document.querySelector('#health');
const fuelSpan = document.querySelector('#fuel');
const distanceSpan = document.querySelector('#distance');

// Initialize game
updateGame();

// Set button click events
button1.onclick = navigateSpace;
button2.onclick = encounterAliens;
button3.onclick = refuelShip;
button4.onclick = exploreAsteroidField;

// Function to update game stats
function updateGame() {
    healthSpan.textContent = health;
    fuelSpan.textContent = fuel;
    distanceSpan.textContent = distance;
}

// Navigate through space (Button 1)
function navigateSpace() {
    text.textContent = "You set course for the next star system...";
    let eventChance = Math.random();

    if (eventChance < 0.3) {
        // Encounter alien pirates
        text.textContent += " Warning! Alien pirates are approaching!";
        button2.style.display = 'inline-block';
        button2.textContent = 'Engage pirates!';
    } else if (eventChance < 0.6) {
        // Discover new planet
        text.textContent += " You discover an uncharted planet rich in resources.";
        button4.style.display = 'inline-block';
        button4.textContent = 'Explore the planet!';
    } else {
        // Smooth sailing
        text.textContent += " Your journey through space continues smoothly.";
    }

    distance += Math.ceil(Math.random() * 10);
    fuel -= Math.ceil(Math.random() * 5);
    updateGame();
}

// Encounter alien pirates (Button 2)
function encounterAliens() {
    text.textContent = "You face the menacing alien pirates in battle!";
    let pirateStrength = Math.ceil(Math.random() * 30);

    while (health > 0 && pirateStrength > 0) {
        // Player attacks
        let playerAttack = Math.ceil(Math.random() * 20) + 10;
        pirateStrength -= playerAttack;

        // Alien pirates attack
        let pirateAttack = Math.ceil(Math.random() * 25) + 15;
        health -= pirateAttack;
    }

    if (health > 0) {
        text.textContent = "You defeated the alien pirates and secured the area.";
        fuel -= 10;
        distance += 20;
    } else {
        text.textContent = "Your ship was heavily damaged by the alien pirates...";
        health = 0;
    }

    button2.style.display = 'none';
    updateGame();
}

// Refuel the ship (Button 3)
function refuelShip() {
    text.textContent = "You refuel your spaceship at a nearby space station.";
    fuel += 30;
    updateGame();
}

// Explore the asteroid field (Button 4)
function exploreAsteroidField() {
    text.textContent = "You navigate through a dangerous asteroid field...";
    let eventChance = Math.random();

    if (eventChance < 0.5) {
        // Discover valuable resources
        text.textContent += " You collect valuable resources from the asteroids.";
        fuel += 10;
    } else {
        // Encounter space anomaly
        text.textContent += " Suddenly, you encounter a mysterious space anomaly.";
        health -= 20;
    }

    button4.style.display = 'none';
    updateGame();
}
