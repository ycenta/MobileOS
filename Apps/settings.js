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

          document.getElementById('savePwd').addEventListener('click', function(e)
          {

            e.preventDefault();

            let pwd = document.getElementById('password');
            let pwdConf = document.getElementById('confPassword');

            if (pwd.value == pwdConf.value) {
              if ( !isNaN(pwd.value) ) {
                localStorage.setItem('password', pwd.value);

                alert("Mot de passe sauvegardé avec succès.");

                pwd.value="";
                pwdConf.value = "";
              } else {
                  alert('Le mot de passe ne peut contenir que des chiffres');
              }
            } else {
              alert('Le mot de passe et sa confirmation ne correspondent pas.');
            }
          });

          document.getElementById('exportSettings').addEventListener('click', function(e){
            e.preventDefault();
            const blob = new Blob([JSON.stringify(localStorage)], {type: "application/json"});

            const url = URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = url;
            link.download = "data.json";
            link.click();

            URL.revokeObjectURL(url);
          });

          document.getElementById('importSettings').addEventListener('click',  function(e){
            e.preventDefault();

            let fileInput = document.getElementById('settingsUpload');
            
            const file = fileInput.files[0];
            const reader = new FileReader();

            reader.addEventListener('load', (event) => {
              let tmpSettings = JSON.parse(event.target.result);

              localStorage.setItem('locked', tmpSettings.locked);
              localStorage.setItem('network', tmpSettings.network);
              localStorage.setItem('networkDelay', tmpSettings.networkDelay);
              localStorage.setItem('password', tmpSettings.password);
              localStorage.setItem('scoreTicTacToe', tmpSettings.scoreTicTacToe);
              localStorage.setItem('settingsTopBar', tmpSettings.settingsTopBar);
              localStorage.setItem('vibrationPermission', tmpSettings.vibrationPermission);

              alert("Settings importés avec succès");

              location.reload();
            });
          
            reader.readAsText(file);
          });

        })
        .catch(error => alert("Erreur dans le chargement de l'application."));
  }   

  };

  export default settings;