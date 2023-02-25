const settings = {
    message: "Hello from myModule!",
    settingsArray: JSON.parse(localStorage.getItem("settingsTopBar")),
    loadApp(){

      fetch('../HtmlTemplates/settings.html')
        .then(response => response.text())
        .then(html => {

          const htmlParent = document.getElementById("app-overlay-id");
          htmlParent.insertAdjacentHTML('beforeend', html);

          const form = document.getElementById("settings");
          form.addEventListener("submit", function(event) {
            console.log("submit");
            event.preventDefault();
            let network = document.getElementById("network").value;
            let networkDelay = document.getElementById("networkDelay").value;

            localStorage.setItem("network", network);
            localStorage.setItem("networkDelay", networkDelay);
            setTimeout(function(){}, 100);
            // click on close-btn
            document.getElementById("close-btn").click();
          });


          // if networkd and networkDelay already exist in the localStorage, we set the value of the inputs
          if (localStorage.getItem("network")) {
            document.getElementById("network").value = localStorage.getItem("network");
          }
          if (localStorage.getItem("networkDelay")) {
            document.getElementById("networkDelay").value = localStorage.getItem("networkDelay");
          }

          const inputsSettings = document.querySelectorAll("#settings input");
          inputsSettings.forEach(input => {
            // set input to check if the settings already exist in the array (localStorage) and if it's enabled
            if (settings.settingsArray.find(setting => setting.name === input.name)) {
              input.checked = settings.settingsArray.find(setting => setting.name === input.name).enabled;
            }

            input.addEventListener("change", function(event) {
              // if the settings already exist in the array, we update it
              if (settings.settingsArray.find(setting => setting.name === event.target.name)) {
                  settings.settingsArray.find(setting => setting.name === event.target.name).enabled = event.target.checked;
              } else {
                // if the settings doesn't exist in the array, we add it
                settings.settingsArray.push({
                  name: event.target.name,
                  enabled: event.target.checked
                });
              }
              
              localStorage.setItem("settingsTopBar", JSON.stringify(settings.settingsArray));

              console.log(localStorage);
            });
          });

        })
        .catch(error => alert("Erreur dans le chargement de l'application."));
  }   

  };

  export default settings;