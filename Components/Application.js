// CLASS APPLICATION ENGINE
export default class ApplicationEngine {
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
