console.log("Hello, ESGI!")


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

const appEngine = new ApplicationEngine();

const myApp = appEngine.createApplication("Mon Application", "#7171c1");

document.getElementById("open-app-button").addEventListener("click", () => {
  appEngine.openApplication(myApp);
  console.log(myApp.name);
});


// close button event when class "close-btn" is clicked
document.addEventListener("click", (e) => {
    if (e.target.classList.contains("close-btn")) {
        console.log("close button clicked");
        appEngine.closeApplication();
    }
});
