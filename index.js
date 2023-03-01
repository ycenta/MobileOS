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
        this.currentApp = app_file;
        return {
            name: name,
            backgroundColor: backgroundColor,
            render: function() { 
                const app = document.createElement("div");

                // Style de l'application (titre & bg)
                app.innerHTML = "<h1 id='app-title'>"+this.name.toUpperCase()+"</h1>";
                app.style.backgroundColor = this.backgroundColor;
                app.classList.add("app-overlay");
                app.setAttribute("id", "app-overlay-id");

                // ajout d'un bouton fermer pour debug
                const closeBtn = document.createElement("div");
                closeBtn.innerHTML = "&times;";
                closeBtn.classList.add("close-btn");
                closeBtn.setAttribute("id", "close-btn");

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

    let defaultSettings = [
        {name: 'checkboxNetwork', enabled: true},
        {name: 'hours', enabled: true},
        {name: 'minutes', enabled: true},
        {name: 'seconds', enabled: true},
        {name: 'day', enabled: true},
        {name: 'month', enabled: true},
        {name: 'year', enabled: true},
        {name: 'vibration', enabled: true},
        {name: 'vibrationVisibility', enabled: true},
        {name: 'battery', enabled: true},
        {name: 'batteryVisibility', enabled: true},
        {name: 'network', enabled: false},
        {name: 'networkDelay', enabled: false},
        {name: 'darkmode', enabled: false},
        {name: 'password', value:""}
    ];

    if(localStorage.getItem("settingsTopBar") == null) {
        localStorage.setItem("settingsTopBar", JSON.stringify(defaultSettings));
    }

    if (localStorage.getItem("scoreTicTacToe") == null) {
        let tmp_json = {'X': 0, 'O': 0};
        tmp_json = JSON.stringify(tmp_json);
        localStorage.setItem("scoreTicTacToe", tmp_json);
    }

    if ( localStorage.getItem("locked") == null ) {
        localStorage.setItem('locked', false);
    } else {
        if (localStorage.getItem('locked') && localStorage.getItem('locked')!="false") {

            console.log(localStorage.getItem('locked'));
            lockScreen();
        }
    }

    if ( localStorage.getItem('locked').enabled ) {
        lockScreen();
    }

    // Initialisation de la grille d'applications
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
                // appDiv.style.backgroundColor = app.settings.backgroundColor;
                gridContainer.appendChild(appDiv);
            });
        }
    );

    // Initialisation de la top bar
    loadTopBar();

});

const appEngine = new ApplicationEngine();

document.addEventListener("click", (e) => {
    if (e.target.classList.contains("open-app-button")) {
        let myApp = appEngine.createApplication(e.target.getAttribute("data-app-name"), e.target.getAttribute("data-app-background-color"), null, JSON.parse(e.target.getAttribute("data-app-file")));
        appEngine.openApplication(myApp);
    }
});

document.addEventListener("click", (e) => { //refacto avec l'event du dessus ? TODO
    if (e.target.classList.contains("close-btn")) {
        appEngine.closeApplication();
    }
});

function loadTopBar(reload = false) {

    if(reload) { // refresh all html of the top bar, and stop the interval to recreate it
        clearInterval(topBarInterval);  
        clearInterval(networkInterval);
    }


    if(localStorage.getItem("network") != null) {
        network = "https://"+localStorage.getItem("network");
    }else{
        network = "https://ycenta.me";
    }

    if(localStorage.getItem("networkDelay") != null) {
        networkDelay = localStorage.getItem("networkDelay");
        networkDelay = parseInt(networkDelay)* 1000;
    }else{
        networkDelay = 8000;
    }
        

    let networkLatency = document.getElementById("network-latency");
    networkInterval = setInterval(() => {
        let startTime = performance.now();
        fetch(network)
            .then(data => {
                let endTime = performance.now();
                let latency = endTime - startTime;
                latency = Math.round(latency * 100) / 100;
                networkLatency.innerHTML = `Ping : ${latency}ms`;
            })
            .catch(error => {
                let endTime = performance.now();
                let latency = endTime - startTime;
                latency = Math.round(latency * 100) / 100;
                networkLatency.innerHTML = `Ping : ${latency}ms`;
            });

    }
    ,  networkDelay);


    settingsTopBar = JSON.parse(localStorage.getItem("settingsTopBar"));

    let currentDate =  "";
    isDay = true;
    isMonth = true;
    isYear = true;
    hasSeconds = true;
    hasMinutes = true;
    hasHours = true;
    darkmode = false;
    let dateArray = [];

    settingsTopBar.forEach(setting => {

       if(setting.name == "checkboxNetwork" ) {   // réseau
            if(setting.enabled == true){

            }else{
                clearInterval(networkInterval);
            }
       }

       
       if(setting.name == "batteryVisibility") {  //Battery %
           
            const batteryStatus = document.getElementById("battery-status");
            if(setting.enabled == true) {
                navigator.getBattery().then(battery => {
                    if(battery.level < 0.2) {
                        batteryStatus.innerHTML = `▂ ${battery.level * 100}%`;
                    } else if(battery.level < 0.4) {
                        batteryStatus.innerHTML = `▃ ${battery.level * 100}%`;
                    } else if(battery.level < 0.6) {
                        batteryStatus.innerHTML = `▅ ${battery.level * 100}%`;
                    } else if(battery.level < 0.8) {
                        batteryStatus.innerHTML = `▆ ${battery.level * 100}%`;
                    } else {
                        batteryStatus.innerHTML = `█ ${battery.level * 100}%`;
                    }
                });

            }else{
                batteryStatus.innerHTML = "";
            }
        }

        if(setting.name == "month") {
            if(setting.enabled == false) {
                isMonth = false;
            }
        }
        
        if(setting.name == "day") {
            if(setting.enabled == false) {
                isDay = false;
            }
        }

        if(setting.name == "year") {
            if(setting.enabled == false) {
                isYear = false;
            }
        }

        if(setting.name == "seconds") {
            hasSeconds = setting.enabled;          
        }

        if(setting.name == "minutes") {
            hasMinutes = setting.enabled;
        }

        if(setting.name == "hours") {
            hasHours = setting.enabled;
        }
        
        if(setting.name == "vibration") {
            if(setting.enabled == true) {
                if (navigator.vibrate) {
                    //navigator.vibrate(100);
                }
                //store in local storage the permission
                localStorage.setItem("vibrationPermission", true);
            }else{
                localStorage.setItem("vibrationPermission", false);
            }
        }
    

        if ( setting.name == "darkmode" ) {
            darkmode = setting.enabled;
        }

        if(setting.name == "vibrationVisibility") {             // vibration status

            const vibrationStatus = document.getElementById("vibration-status");
            if(setting.enabled == true) {

                if(localStorage.getItem("vibrationPermission") == "true") {
                    vibrationStatus.innerHTML = "Vibration On📳";
                } else {
                    vibrationStatus.innerHTML = "Vibration Off";
                }
            }else{
                vibrationStatus.innerHTML = "";
            }
        }
    
    });

    let datetwo = new Date();
    let currentDay = datetwo.getDate();
    let currentMonth = datetwo.getMonth() + 1;
    let currentYear = datetwo.getFullYear();

    isDay ? dateArray.push(currentDay) : "";
    isMonth ? dateArray.push(currentMonth) : "";
    isYear ? dateArray.push(currentYear) : "";

    if(isDay == false && isMonth == false && isYear == false) {
        currentDate = " ";
    } else {
        currentDate = dateArray.join('/');
    }

    const date = document.getElementById("date");
    date.innerHTML = currentDate;
    
    const time = document.getElementById("time");
    const lockedtime = document.getElementById("locked-time");
    topBarInterval = setInterval(() => {
        let datetime = new Date();
        let tmp_hr = ((hasHours ? datetime.getHours() : "") + (hasMinutes ? ":"+datetime.getMinutes(): "") + (hasSeconds ? ":"+datetime.getSeconds() : ""));
        // if starts with and/or ends with : remove it
        if (tmp_hr.startsWith(":")) {
            tmp_hr = tmp_hr.substring(1);
        }
        if (tmp_hr.endsWith(":")) {
            tmp_hr = tmp_hr.substring(0, tmp_hr.length - 1);
        }
       
        time.innerHTML = (tmp_hr);
        lockedtime.innerHTML = (tmp_hr);
    }, 1000);


    if (darkmode && !document.body.classList.contains('darkmode')) {
        document.body.classList.add('darkmode');
    } else if ( !darkmode &&  document.body.classList.contains('darkmode') ) {
        document.body.classList.remove('darkmode');
    }


}


// document.addEventListener('click', () => {
//     Notification.requestPermission().then(function (status) {
//         if (status === 'denied') {
//             //
//         } else if (status === 'granted') {
//             //
//         }
//     });
// })



// const output = document.querySelector(".output");

function handleOrientation(event) {
  let x = event.beta; 
  let y = event.gamma; 

  if (x > 90) {
    x = 90;
  }
  if (x < -90) {
    x = -90;
  }

  x += 90;
  y += 90;

  document.documentElement.style.setProperty("--r-x", ((y/2) -45) + "deg");
}

window.addEventListener("deviceorientation", handleOrientation);

//Pour le lock screen
document.getElementById('unlocked-logo').addEventListener('click', lockScreen);

function lockScreen()
{
    let lockdiv = document.getElementById('screenLock');

    if ( lockdiv.classList.contains('hidden') ) {
        lockdiv.classList.remove('hidden');

        let pwdArea = document.getElementById('password-locked');
        let lockArea = document.getElementById('locked-logo');

        if ( localStorage.getItem('password') == "" || localStorage.getItem('password') === null ) {
            if ( !pwdArea.classList.contains('hidden') ) {
                pwdArea.classList.add('hidden');
            }

            if ( lockArea.classList.contains('hidden') ) {
                lockArea.classList.remove('hidden');
            }
        } else {
            if ( pwdArea.classList.contains('hidden') ) {
                pwdArea.classList.remove('hidden');
            }

            if ( !lockArea.classList.contains('hidden') ) {
                lockArea.classList.add('hidden');
            }
        }
    }

    localStorage.setItem('locked', true);
}

document.getElementById('locked-logo').addEventListener('click', unlockScreen);

function unlockScreen()
{

    let lockdiv = document.getElementById('screenLock');

    if ( !lockdiv.classList.contains('hidden') ) {
        lockdiv.classList.add('hidden');
    }

    localStorage.setItem('locked', false);

    console.log(localStorage);
}

function appendPassword(val)
{
    let input = document.getElementById('password-lock');
    
    if ( input.value.length < 9 && !isNaN(val) ) {
        input.value += val;
    }
}

function delPassword()
{
    let input = document.getElementById('password-lock');
    if ( input.value != "" ) {
        input.value = input.value.slice(0, -1);
    }
}

function checkPassword()
{
    let input = document.getElementById('password-lock');
    let passwordStored = localStorage.getItem('password');

    if ( input.value == passwordStored ) {
        unlockScreen();
        input.value = "";
        input.style.backgroundColor = '';
    } else {
        input.style.backgroundColor = 'rgb(216, 125, 125)';
        input.value = "";
    }
}
