const chrono = {
    message: "Hello from myModule!",
    loadApp()
    {

      fetch('../HtmlTemplates/chrono.html')
        .then(response => response.text())
        .then(html => {
            const htmlParentbis = document.getElementById("app-overlay-id");
            htmlParentbis.insertAdjacentHTML('beforeend', html);   
            
            let milliseconds = 0;
            let seconds = 0;
            let minutes = 0;
            let hours = 0;
            let displayMilliseconds = 0;
            let displaySeconds = 0;
            let displayMinutes = 0;
            let displayHours = 0;
            let interval = null;
            let status = "stopped";
            let countdownMode = false;
            
            function startClock(){
                let date = new Date();
                let hours = date.getHours();
                let minutes = date.getMinutes();
                let seconds = date.getSeconds();
                minutes = minutes < 10 ? '0'+minutes : minutes;
                seconds = seconds < 10 ? '0'+seconds : seconds;
                let strTime = hours + ':' + minutes + ':' + seconds ;
                document.getElementById("clock").textContent = strTime;
            }

            setInterval(startClock, 1000);
            
            function startTimer(duration = 0) {
                milliseconds += 10;
                if (milliseconds >= 1000) {
                  milliseconds -= 1000;
                  seconds++;
              
                  if (seconds >= 60) {
                    seconds -= 60;
                    minutes++;
              
                    if (minutes >= 60) {
                      minutes -= 60;
                      hours++;
                    }
                  }
                }
              
                if (milliseconds < 10) {
                  displayMilliseconds = "00" + milliseconds.toString();
                } else if (milliseconds < 100) {
                  displayMilliseconds = "0" + milliseconds.toString();
                } else {
                  displayMilliseconds = milliseconds;
                }
              
                if (seconds < 10) {
                  displaySeconds = "0" + seconds.toString();
                } else {
                  displaySeconds = seconds;
                }
              
                if (minutes < 10) {
                  displayMinutes = "0" + minutes.toString();
                } else {
                  displayMinutes = minutes;
                }
              
                if (hours < 10) {
                  displayHours = "0" + hours.toString();
                } else {
                  displayHours = hours;
                }
              
                document.getElementById("timer").textContent = `${displayHours}:${displayMinutes}:${displaySeconds}:${displayMilliseconds}`;
              }
              
              
            function startStop() {

              //vibrate 
              //if the localStorage says that the user wants to vibrate, then vibrate, else don't vibrate
              if(localStorage.getItem("vibrationPermission") === "true"){
                navigator.vibrate(100);
                console.log("vibrate");
              }

              if (status === "stopped") {
                interval = window.setInterval(startTimer, 10);
                document.getElementById("start").textContent = "Pause";
                status = "started";
              } else {
                window.clearInterval(interval);
                countdownMode = false;
                document.getElementById("start").textContent = "Start";
                status = "stopped";
              }
            }
      
            function reset() {
              window.clearInterval(interval);
              countdownMode = false;
              milliseconds = 0;
              seconds = 0;
              minutes = 0;
              hours = 0;
              document.getElementById("timer").textContent = "00:00:00:000";
              document.getElementById("start").textContent = "Start";
              status = "stopped";
              let lapList = document.getElementById("lapList");
              lapList.innerHTML = "";
            }

            function addLap() {
              //vibrate 10ms
              if(localStorage.getItem("vibrationPermission") === "true"){
                navigator.vibrate(10);
                console.log("vibrate");
              }
              let lap = document.getElementById("timer").textContent;
              let lapList = document.getElementById("lapList");
              let li = document.createElement("li");
              li.textContent = lap;
              lapList.appendChild(li);
            }

            function initTimerDuration(){
              if(countdownMode === false){

                if(status === "started"){
                  startStop();
                  reset();
                }

                countdownMode = true;
                startTimerDuration( document.getElementById("countdown").value);
              }
            }

            function startTimerDuration(duration) {

                let timer = duration;
                let hours, minutes, seconds;
              
                let intervalMinuterie = setInterval(function() {
                  if(countdownMode === false){
                    clearInterval(intervalMinuterie);
                    return;
                  }
                  hours = Math.floor(timer / 3600);
                  minutes = Math.floor((timer % 3600) / 60);
                  seconds = timer % 60;
              
                  hours = hours < 10 ? "0" + hours : hours;
                  minutes = minutes < 10 ? "0" + minutes : minutes;
                  seconds = seconds < 10 ? "0" + seconds : seconds;
              
                  document.getElementById("timer").textContent = hours + ":" + minutes + ":" + seconds;
              
                  if (--timer < 0 ) {
                    clearInterval(intervalMinuterie);
                    //vibrate 4 times
                    if(localStorage.getItem("vibrationPermission") === "true"){
                      navigator.vibrate([500, 500, 500]);
                    }

                    if (!('Notification' in window)) {
                      alert('Minuterie terminée !')
                    }
                    else if (Notification.permission === 'granted') {
                      const notification = new Notification('Minuterie terminée !')
                    }
                    else if (Notification.permission !== 'denied') {
                      Notification.requestPermission().then((permission) => {
                        if (permission === 'granted') {
                          const notification = new Notification('Minuterie terminée !')
                        }
                      });
                    }

                    //reset the timer
                    reset();

                  }
                }, 1000);
              }
          
                document.getElementById("start").addEventListener("click", startStop);
                document.getElementById("reset").addEventListener("click", reset);
                document.getElementById("startCountdown").addEventListener("click", initTimerDuration);
                document.getElementById("addLap").addEventListener("click", addLap);
            

        });
    }
};

export default chrono;
