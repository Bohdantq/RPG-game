let gold = 50;
let health = 100;
let xp = 0;
let currentWeapon = 0;
let fighting;
let monsterHealth;
let inventory = ["hand"];
let agi; //Agility (AGI)
let acc; //Enemy Accuracy (ACC)
let fightCadillionUses = 4;
let fightFiendUses = 3;

const goldText = document.getElementById("goldText");
const healthText = document.getElementById("healthText");
const xpText = document.getElementById("xpText");
const button1 = document.getElementById("button1");
const button2 = document.getElementById("button2");
const button3 = document.getElementById("button3");
const monsterStats = document.getElementById("monsterStats");
const monsterName = document.getElementById("monsterName");
const monsterHealthText = document.getElementById("monsterHealth");
const text = document.getElementById("text");
const weapons = [
   {
      name: "hand",
      power: 5
   },
   {
      name: "Wildwood Blade",
      power: 26
   },
   {
      name: "Skythern Blade",
      power: 50
   },
   {
      name: "Mortum Blade",
      power: 120
   }
]
const monsters = [
   {
      name: "Wildwood Cadillion",
      level: 2,
      health: 25
   },
   {
      name: "Skythern Fiend",
      level: 8,
      health: 80
   },
   {
      name: "Vamacheron",
      level: 15,
      health: 500
   }
]
const locations = [
   {
      name: "village square",
      "button text": ["Go to store", "Go to farm", "Vamacheron(last fight)"],
      "button functions": [goStore, goFarm, fightVamacheron],
      text: "You are in the village square. You see a sign that says \"Store\"."
   },
   {
      name: "store",
      "button text": ["Buy 10 health (10 gold)", "Buy weapon (30 gold)", "Go to village square"],
      "button functions": [buyHealth, buyWeapon, goVillage],
      text: "You enter the store."
   },
   {
      name: "farm",
      "button text": ["Fight Wildwood Cadillion", "Fight Skythern Fiend", "Go to village"],
      "button functions": [fightCadillion, fightFiend, goVillage],
      text: "You arrived to farm. There are some monsters you can see."
   },
   {
      name: "fight",
      "button text": ["Attack", "Dodge", "Run"],
      "button functions": [attack, dodge, goVillage],
      text: "⚔️ A wild monster appears! ⚔️"
   },
   {
      name: "kill monster",
      "button text": ["Go to village square", "Go to village square", "Go to village square"],
      "button functions": [goVillage, goVillage, goVillage],
      text: 'The monster screams "Arg!" as it dies. You gain experience points and find gold.'
   },
   {
      name: "lose",
      "button text": ["REPLAY?", "REPLAY?", "REPLAY?"],
      "button functions": [restart, restart, restart],
      text: "You die. \u{2620}"
   },
   {
      name: "win",
      "button text": ["REPLAY?", "REPLAY?", "REPLAY?"],
      "button functions": [restart, restart, restart],
      text: "You defeat the Vamacheron! YOU WIN THE GAME! \u{1F389}"
   }
]

button1.innerText = locations[0]["button text"][0];
button2.innerText = locations[0]["button text"][1];
button3.innerText = locations[0]["button text"][2];
goldText.innerText = gold;
healthText.innerText = health;
xpText.innerText = xp;

// initialize buttons
button1.onclick = goStore;
button2.onclick = goFarm;
button3.onclick = fightVamacheron;

// Navigation functions
function update(location) {
   monsterStats.style.display = "none";
   button1.innerText = location["button text"][0];
   button2.innerText = location["button text"][1];
   button3.innerText = location["button text"][2];
   button1.onclick = location["button functions"][0];
   button2.onclick = location["button functions"][1];
   button3.onclick = location["button functions"][2];
   text.innerText = location.text;
}
function goVillage() {
   update(locations[0]);
}
function goStore() {
   update(locations[1]);
}
function goFarm() {
   update(locations[2]);
}
function goFight() {
   update(locations[3]);
   monsterHealth = monsters[fighting].health;
   monsterStats.style.display = "flex";
   monsterName.innerText = monsters[fighting].name;
   monsterHealthText.innerText = monsterHealth;
}

// Fight functions
function attack() {
   text.innerText = "The " + monsters[fighting].name + " attacks! \u{1F479}";
   text.innerText += " You attack it with your " + weapons[currentWeapon].name + " \u{1F608}";
   health -= getMonsterAttackValue(monsters[fighting].level);

   if (isMonsterHit()) {
      monsterHealth -= weapons[currentWeapon].power + Math.floor(Math.random() * xp) + 1;
   }
   else {
      text.innerText = " You miss \u{1F610}";
   }
   healthText.innerText = health;
   monsterHealthText.innerText = monsterHealth;

   battleField();
}

function dodge() {
   agi = 15 + Math.floor(xp / 10);
   acc = monsters[fighting].level * 1.5;

   if (isDodged(agi, acc)) {
      text.innerText = "You dodged the attack from the " + monsters[fighting].name;
      monsterHealth -= weapons[currentWeapon].power / 2;
   }
   else {
      text.innerText = "You dodge the attack from the " + monsters[fighting].name;
   }
   monsterHealthText.innerText = monsterHealth;

   battleField();
}

function battleField() {
   if (health <= 0) {
      lose();
   }
   else if (monsterHealth <= 0) {
      if (fighting === 2) {
         winGame();
      }
      else {
         defeatMonster();
      }
   }

   if (Math.random() <= .05 && inventory.length !== 1) {
      text.innerText = " Your " + inventory.pop() + " breaks \u{1F4A9}"
      currentWeapon--;
   }
}

function getMonsterAttackValue(level) {
   const hit = (level * 2) - (Math.floor(Math.random() * xp));
   return hit > 0 ? hit : 0;
}

function isMonsterHit() {
   return Math.random() > .2 || health < 20;
}

function isDodged(agi, acc) {
   const dodgeChance = Math.max(0, Math.min(1, (agi * 0.02) - (acc * 0.015)));
   return Math.random() < dodgeChance;
}

// Buy functions
function buyHealth() {
   if (gold >= 10) {
      gold -= 10;
      health += 10;
      goldText.innerText = gold;
      healthText.innerText = health;
   }
   else {
      text.innerText = "You do not have enough gold to buy health \u{1F614}"
   }
}
function buyWeapon() {
   if (currentWeapon < weapons.length - 1) {
      if (gold >= 30) {
         gold -= 30;
         currentWeapon++;
         goldText.innerText = gold;
         let newWeapon = weapons[currentWeapon].name;
         text.innerText = "You bought a " + newWeapon + ".\u{1F4AA}\n";
         inventory.push(newWeapon);
         text.innerText += " Your inventory: " + inventory;
      }
      else {
         text.innerText = "You do not have enough gold to buy weapon \u{1F612}";
      }
   }
   else {
      text.innerText = "You already have the most powerful weapon! Have fun \u{1F609}";
      button2.innerText = "Sell weapon for 15 gold";
      button2.onclick = sellWeapon;
   }
}

// Sell function
function sellWeapon() {
   if (inventory.length > 1) {
      gold += 15;
      goldText.innerText = gold;
      let currentWeapon = inventory.shift();
      text.innerText = "You sold a " + currentWeapon + ".\u{1F4B8}";
      text.innerText += " In your inventory you have: " + inventory;
   }
   else {
      text.innerText = "Don't sell your only weapon! \u{1F605}";
   }
}

// Combat functions
function fightCadillion() {
   if (fightCadillionUses > 0) {
      fightCadillionUses--;
      fighting = 0;
      goFight();
   }
   else {
      text.innerText = "There are no " + monsters[fighting].name + " left";
   }
}
function fightFiend() {
   if (fightFiendUses > 0) {
      fightFiendUses--;
      fighting = 1;
      goFight();
   }
   else {
      text.innerText = "There are no " + monsters[fighting].name + " left";
   }
}
function fightVamacheron() {
   fighting = 2;
   goFight();
   text.innerText = "\u{1F480} Boss fight incoming! \u{1F480}";
}
function defeatMonster() {
   gold += Math.floor(monsters[fighting].level * 8.6);
   xp += monsters[fighting].level;
   goldText.innerText = gold;
   xpText.innerText = xp;
   update(locations[4]);
}
function lose() {
   update(locations[5]);
}
function winGame() {
   update(locations[6]);
}
function restart() {
   gold = 50;
   health = 100;
   xp = 0;
   currentWeapon = 0;
   inventory = ["hand"];
   goldText.innerText = gold;
   healthText.innerText = health;
   xpText.innerText = xp;
   goVillage();
}
