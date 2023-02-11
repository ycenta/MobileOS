// // CLASS APPLICATION ENGINE
// class ApplicationEngine {
//     constructor() {
//         this.overlay = null;
//     }

//     openApplication(app) {
//         if (!this.overlay) {
//             this.overlay = document.createElement("div");
//             this.overlay.classList.add("overlay");
//             document.body.appendChild(this.overlay);
//         }

//         this.overlay.innerHTML = ""; // On nettoie l'overlay avant de l'utiliser
//         this.overlay.appendChild(app.render());
//         this.overlay.style.display = "block";
//     }

//     closeApplication() {
//         if (this.overlay) {
//             this.overlay.style.display = "none";
//         }
//     }

//     createApplication(name, backgroundColor, methods, app_file) {
//         console.log(backgroundColor);
//         return {
//             name: name,
//             backgroundColor: backgroundColor,
//             render: function() { // Va créer l'élément HTML, peut être changer ça et l'enlever d'ici
//                 const app = document.createElement("div");

//                 // Style de l'application (titre & bg)
//                 app.innerHTML = this.name;
//                 app.style.backgroundColor = this.backgroundColor;
//                 app.classList.add("app-overlay");
//                 // add id = "app-overlay-id"
//                 app.setAttribute("id", "app-overlay-id");

//                 // ajout d'un bouton fermer pour debug
//                 const closeBtn = document.createElement("div");
//                 closeBtn.innerHTML = "&times;";
//                 closeBtn.classList.add("close-btn");
//                 for (let method in methods) {
//                     app[method] = methods[method];
//                 }

//                 // Import du code de l'application
//                 import("/Apps/"+app_file+".js").then(module => {
//                     module.default.loadApp();
//                 }).catch(error => {
//                     console.log(error);
//                 });

//                 app.appendChild(closeBtn);
//                 return app;
//             }
//         }
//     }

//     // reload app method TODO
// }