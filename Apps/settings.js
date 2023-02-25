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
            event.preventDefault();
            const formData = new FormData(form);
            const entries = formData.entries();
          });

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
            });
          });

        })
        .catch(error => alert("Erreur dans le chargement de l'application."));
  }   

  };

  export default settings;