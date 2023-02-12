const settings = {
    message: "Hello from myModule!",
    settingsArray: [],
    loadApp(){
      // alert("load app");
      const htmlParent = document.getElementById("app-overlay-id");
      // let appHtmlContent = document.createElement("div");

      let html = `<div >Hello from Settings<br>
      <form action="#" id="settings">
        <input type="checkbox" id="checkboxNetwork" name="checkboxNetwork">
        <label for="checkboxNetwork">Latence du réseau</label>

        <input type="checkbox" id="checkboxNetwork" name="checkboxNetwork">
        <label for="checkboxNetwork">Latence du réseau</label>

        <h2>Affichage de l'Heure</h2>
        <input type="checkbox" id="hours" name="hours">
        <label for="hours">Heure</label><br>
        <input type="checkbox" id="minutes" name="minutes">
        <label for="minutes">Minutes</label><br>
        <input type="checkbox" id="seconds" name="seconds">
        <label for="seconds">Secondes</label><br>

        <h2>Affichage de la date</h2>
        <input type="checkbox" id="day" name="day">
        <label for="day">Jour</label><br>
        <input type="checkbox" id="month" name="month">
        <label for="month">Mois</label><br>
        <input type="checkbox" id="year" name="year">
        <label for="year">Année</label><br>

        <h2>Configuration vibration</h2>
        <input type="checkbox" id="vibration" name="vibration">
        <label for="vibration">Vibration</label><br>
        <input type="checkbox" id="vibrationVisibility" name="vibrationVisibility">
        <label for="vibration">Affichage de l'état de la vibration</label><br>

        <h2>Configuration de la batterie</h2>
        <input type="checkbox" id="battery" name="battery">
        <label for="battery">Batterie</label><br>
        <input type="checkbox" id="batteryVisibility" name="batteryVisibility">
        <label for="battery">Affichage de l'état de la batterie</label><br>

        <h2>Configuration de la latence réseau</h2>
        <label for="network">Nom de domaine du serveur</label>
        <input type="text" id="network" name="network"><br>
        <label for="networkDelay">délai de rafraichissement en secondes</label>
        <input type="number" id="networkDelay" name="networkDelay">
        <input type="submit" value="Submit">
      </form>
    </div>
    `;
      htmlParent.insertAdjacentHTML('beforeend', html);

      //CODE DE l'APP
       const form = document.getElementById("settings");
       form.addEventListener("submit", function(event) {
         event.preventDefault();
         const formData = new FormData(form);
         const entries = formData.entries();
         for (const entry of entries) {
           console.log(entry);
         }
       });

      //  Récuperer les changements des inputs pour sauvgarder les settings automatiquement
        const inputsSettings = document.querySelectorAll("#settings input");
        inputsSettings.forEach(input => {
          input.addEventListener("change", function(event) {
            console.log(event.target.name +" : "+event.target.checked +" "+ event.target.value);

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
        }
      );
    });
  }   

  };

  export default settings;