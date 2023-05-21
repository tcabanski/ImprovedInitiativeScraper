
const puppeteer = require('puppeteer');
const fs = require('fs');

var browser;
var page;
const improvedInitiativeUrl = 'https://improvedinitiative.app/p/9vcmqj0s';
var changeOccuredCallback;
var socketIo;

async function open(io) {
  try {
    socketIo = io;
    browser = await puppeteer.launch();
    page = await browser.newPage();
    await page.goto(improvedInitiativeUrl);
    await page.exposeFunction('changeOccured', function() {
      changeCallback();
    });
  
    await page.evaluate(() => {
      var observer = new MutationObserver((mutations) => { 
        if (mutations.length > 0) {
          changeOccured();
        }
      });
      observer.observe(document.querySelector(".combatants"), { attributes: true, characterData: true, childList: true, subtree: true });
    });
  } catch (error) {
    console.log(error);
  }
}

async function changeCallback() {
  var combatants = await getCombatants();
  io.emit('combatants', {
    combatants: await getCombatants()
  });
}

async function close() {
  try {
    await browser.close();
  } catch (error) {
    console.log(error);
  }
}

async function scrape() {
  try {
    const page = await browser.newPage();
    await page.goto(improvedInitiativeUrl);
    await page.waitForSelector('.combatant', { timeout: 5000 });
    return await getCombatants();
  } catch (error) {
    console.log(error);
  }
}

async function getCombatants() {
  try {
    const combatants = await page.evaluate(() => {
        hold = []
        const s = document.querySelectorAll('.combatant');

        s.forEach(s1 => {
          currentHp = ''
          hpSelector = s1.querySelector('.current-hp')
          if (hpSelector.innerHTML.startsWith('<span')) {
            currentHp = hpSelector.querySelector('span').innerText
          } else {
            currentHp = hpSelector.innerHTML
          }

          hold.push({
            init: s1.querySelector('.combatant__initiative').innerText,
            name: s1.querySelector('.combatant__name').innerText,
            hp: currentHp,
            isCurrent: s1.className.includes('active')
          })
        })
        return hold
    });
    console.log(`Get combatants has ${combatants.length} combatants`)

    return combatants;
  } catch (error) {
    console.log(error);
  }
}

exports.scrape = scrape;
exports.open = open;
exports.close = close;