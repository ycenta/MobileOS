// CLASS APPLICATION ENGINE
class ApplicationEngine {
    constructor() {
        this.overlay = null;
        this.currentApp = null;
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

        if (this.currentApp != null) {

            if(this.currentApp == "settings") {
                // reload top bar
                loadTopBar(true);
            }
        }
      
        if (this.overlay) {
            this.overlay.style.display = "none";
        }
    }

    createApplication(name, backgroundColor, methods, app_file) {
        console.log(backgroundColor);
        this.currentApp = app_file;
        return {
            name: name,
            backgroundColor: backgroundColor,
            render: function() { // Va créer l'élément HTML, peut être changer ça et l'enlever d'ici
                const app = document.createElement("div");

                // Style de l'application (titre & bg)
                app.innerHTML = this.name;
                app.style.backgroundColor = this.backgroundColor;
                app.classList.add("app-overlay");
                // add id = "app-overlay-id"
                app.setAttribute("id", "app-overlay-id");

                // ajout d'un bouton fermer pour debug
                const closeBtn = document.createElement("div");
                closeBtn.innerHTML = "&times;";
                closeBtn.classList.add("close-btn");
                for (let method in methods) {
                    app[method] = methods[method];
                }

                // Import du code de l'application
                import("/Apps/"+app_file+".js").then(module => {
                    module.default.loadApp();
                }).catch(error => {
                    console.log(error);
                });

                app.appendChild(closeBtn);
                return app;
            }
        }
    }

}


// INDEX JS CODE

document.addEventListener("DOMContentLoaded", function() {

    // set to localstorage the default settings of the top bar

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
                appDiv.setAttribute("data-app-file", JSON.stringify(app.app_file));
                // add dragable = true
                appDiv.setAttribute("draggable", "true");
                appDiv.style.backgroundColor = app.settings.backgroundColor;
                gridContainer.appendChild(appDiv);
            });

        }
    );

// Initialisation de la top bar
    loadTopBar();

// FIN INITIALISATION TOP BAR

});

const appEngine = new ApplicationEngine();

// on click on class .open-app-button 
document.addEventListener("click", (e) => {
    if (e.target.classList.contains("open-app-button")) {
        console.log('test');
        let myApp = appEngine.createApplication(e.target.getAttribute("data-app-name"), e.target.getAttribute("data-app-background-color"), null, JSON.parse(e.target.getAttribute("data-app-file")));
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

function loadTopBar(reload = false) {

    if(reload) { // refresh all html of the top bar, and stop the interval to recreate it
        clearInterval(topBarInterval);
        alert("reload");
    }

//    get localstorage settings
    const settingsTopBar = JSON.parse(localStorage.getItem("settingsTopBar"));
    console.log(settingsTopBar);

    let currentDate =  "";
    let dateFormat = {};

    isDay = true;
    isMonth = true;
    isYear = true;
    let objectDateFormat = {};
    settingsTopBar.forEach(setting => {

        // if(setting.name == "time" && setting.enabled == true) {
        //     const time = document.getElementById("time");
        //     topBarInterval = setInterval(() => {
        //         time.innerHTML = new Date().toLocaleTimeString();
        //     }, 1000);
        // }
        
       if(setting.name == "checkboxNetwork" && setting.enabled == true) {
               // réseau
            let networkLatency = document.getElementById("network-latency");
            let startTime = performance.now();
            fetch("https://jsonplaceholder.typicode.com/todos/1")
                .then(response => response.json())
                .then(data => {
                    const endTime = performance.now();
                    const latency = endTime - startTime;
                    networkLatency.innerHTML = `Network latency: ${latency}ms`;
                });
       }

       
       if(setting.name == "batteryVisibility" && setting.enabled == true) {
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
        }   

        if(setting.name == "month") {
            if(setting.enabled == true) {
                objectDateFormat.month = "numeric";
            }
        }
        

        if(setting.name == "day" && setting.enabled == true) {
            if(setting.enabled == true) {
                objectDateFormat.day = "numeric";
            }
        }

        if(setting.name == "year" && setting.enabled == true) {
            if(setting.enabled == true) {
                objectDateFormat.year = "numeric";
            }
        }
    
    });


    console.log(settingsTopBar);

    // if isDay == false && isMonth == false && isYear == false, currentDate = " "
    if(isDay == false && isMonth == false && isYear == false) {
        currentDate = " ";
    } else {
    currentDate = new Date().toLocaleDateString("fr-FR",  objectDateFormat);
    }
    const date = document.getElementById("date");
    date.innerHTML = currentDate;
    
    const time = document.getElementById("time");
    topBarInterval = setInterval(() => {
        time.innerHTML = new Date().toLocaleTimeString();
    }, 1000);

    // vibration status
    const vibrationStatus = document.getElementById("vibration-status");
    if (navigator.vibrate) {
        vibrationStatus.innerHTML = "Vibration On";
    } else {
        vibrationStatus.innerHTML = "Vibration Off";
    }



}










// random BS TBD

function handleOrientation(event) {
    const absolute = event.absolute;
    const alpha = event.alpha;
    const beta = event.beta;
    const gamma = event.gamma;
  
    // Do stuff with the new orientation data
}

const output = document.querySelector(".output");

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
  y += 90;

  // 10 is half the size of the ball
  // It center the positioning point to the center of the ball
  

  document.documentElement.style.setProperty("--r-x", ((y/2) -45) + "deg");
//   print current --r-x value
output.textContent += (getComputedStyle(document.documentElement).getPropertyValue("--r-x"));
}

window.addEventListener("deviceorientation", handleOrientation);