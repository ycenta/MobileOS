// CLASS APPLICATION ENGINE
class ApplicationEngine {
    constructor() {
        this.overlay = null;
    }

    openApplication(app) {
        if (!this.overlay) {
            this.overlay = document.createElement("div");
            this.overlay.classList.add("overlay");
            document.body.appendChild(this.overlay);
        }

        this.overlay.innerHTML = ""; // On nettoie l'overlay avant de l'utiliser
        this.overlay.appendChild(app.render());
        this.overlay.style.display = "block";
    }

    closeApplication() {
        if (this.overlay) {
            this.overlay.style.display = "none";
        }
    }

    createApplication(name, backgroundColor, methods) {
        console.log(backgroundColor);
        return {
            name: name,
            backgroundColor: backgroundColor,
            render: function() { // Va créer l'élément HTML, peut être changer ça et l'enlever d'ici
                const app = document.createElement("div");

                // Style de l'application (titre & bg)
                app.innerHTML = this.name;
                app.style.backgroundColor = this.backgroundColor;
                app.classList.add("app-overlay");

                // ajout d'un bouton fermer pour debug
                const closeBtn = document.createElement("div");
                closeBtn.innerHTML = "&times;";
                closeBtn.classList.add("close-btn");
                for (let method in methods) {
                    app[method] = methods[method];
                }
                app.appendChild(closeBtn);
                return app;
            }
        }
    }

    // reload app method TODO
}
// END CLASS APPLICATION ENGINE


// JS CODE HOME PAGE

document.addEventListener("DOMContentLoaded", function() {

    fetch("defaultApp.json")
        .then(response => response.json())
        .then(data => {
            const gridContainer = document.getElementById("grid-container");
            data['applications'].forEach(app => {

                // insert div in div #grid-container
                const appDiv = document.createElement("div");
                appDiv.classList.add("app");
                appDiv.innerHTML = app.name;
                appDiv.classList.add("grid-item");
                appDiv.classList.add("open-app-button");
                appDiv.setAttribute("data-app-name", app.name);
                appDiv.setAttribute("data-app-background-color", app.settings.backgroundColor);
                // add dragable = true
                appDiv.setAttribute("draggable", "true");
                appDiv.style.backgroundColor = app.settings.backgroundColor;
                gridContainer.appendChild(appDiv);
            });

            // Créer un tableau des applications au lieu de store dans un data attribute?

            // create app
            // const appEngine = new ApplicationEngine();
            // const myApp = appEngine.createApplication(data.name, data.backgroundColor, data.methods);
            // // open app
            // appEngine.openApplication(myApp);
        }
    );

    const time = document.getElementById("time");
    setInterval(() => {
        time.innerHTML = new Date().toLocaleTimeString();
    }, 1000);

    // current date
    const date = document.getElementById("date");
    date.innerHTML = new Date().toLocaleDateString();

    // vibration status
    const vibrationStatus = document.getElementById("vibration-status");
    if (navigator.vibrate) {
        vibrationStatus.innerHTML = "Vibration On";
    } else {
        vibrationStatus.innerHTML = "Vibration Off";
    }

    //Battery %
    const batteryStatus = document.getElementById("battery-status");
    navigator.getBattery().then(battery => {
        // show battery level with thoses characters : ▂▃▅▆█
        // remplacer ça par un modulo pour éviter les if
        if(battery.level < 0.2) {
            batteryStatus.innerHTML = `Batterie: ▂ ${battery.level * 100}%`;
        } else if(battery.level < 0.4) {
            batteryStatus.innerHTML = `Batterie: ▃ ${battery.level * 100}%`;
        } else if(battery.level < 0.6) {
            batteryStatus.innerHTML = `Batterie: ▅ ${battery.level * 100}%`;
        } else if(battery.level < 0.8) {
            batteryStatus.innerHTML = `Batterie: ▆ ${battery.level * 100}%`;
        } else {
            batteryStatus.innerHTML = `Batterie: █ ${battery.level * 100}%`;
        }
    });

    // réseau
    const networkLatency = document.getElementById("network-latency");
    const startTime = performance.now();
    fetch("https://jsonplaceholder.typicode.com/todos/1")
        .then(response => response.json())
        .then(data => {
            const endTime = performance.now();
            const latency = endTime - startTime;
            networkLatency.innerHTML = `Network latency: ${latency}ms`;
        });

});

const appEngine = new ApplicationEngine();

// on click on class .open-app-button 
document.addEventListener("click", (e) => {
    if (e.target.classList.contains("open-app-button")) {
        console.log('test');
        let myApp = appEngine.createApplication(e.target.getAttribute("data-app-name"), e.target.getAttribute("data-app-background-color"));
        appEngine.openApplication(myApp);
    }
});
// on click on class "open_app_button"

// close button event when class "close-btn" is clicked
document.addEventListener("click", (e) => {
    if (e.target.classList.contains("close-btn")) {
        console.log("close button clicked");
        appEngine.closeApplication();
    }
});


// random BS TBD

function handleOrientation(event) {
    const absolute = event.absolute;
    const alpha = event.alpha;
    const beta = event.beta;
    const gamma = event.gamma;
  
    // Do stuff with the new orientation data
}


const ball = document.querySelector(".ball");
const garden = document.querySelector(".garden");
const output = document.querySelector(".output");

const maxX = garden.clientWidth - ball.clientWidth;
const maxY = garden.clientHeight - ball.clientHeight;

function handleOrientation(event) {
  let x = event.beta; // In degree in the range [-180,180)
  let y = event.gamma; // In degree in the range [-90,90)

  output.textContent = `beta : ${x}\n`;
  output.textContent += `gamma: ${y}\n`;
  output.textContent += `Current deg: ${(y/2)}\n`;

  // Because we don't want to have the device upside down
  // We constrain the x value to the range [-90,90]
  if (x > 90) {
    x = 90;
  }
  if (x < -90) {
    x = -90;
  }

  // To make computation easier we shift the range of
  // x and y to [0,180]
  x += 90;
  y += 45;

  // 10 is half the size of the ball
  // It center the positioning point to the center of the ball
//   ball.style.top = `${(maxY * y) / 180 - 10}px`;
//   ball.style.left = `${(maxX * x) / 180 - 10}px`;

  document.documentElement.style.setProperty("--r-x", (y/2) + "deg");
//   print current --r-x value
output.textContent += (getComputedStyle(document.documentElement).getPropertyValue("--r-x"));
}

window.addEventListener("deviceorientation", handleOrientation);
alert("Device Orientation API is supported");