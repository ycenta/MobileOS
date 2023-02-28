const beer = {
    message: "beer",
    loadApp(){
        fetch('../HtmlTemplates/beer.html')
        .then(response => response.text())
        .then(html => {
            const htmlParentbis = document.getElementById("app-overlay-id");
            htmlParentbis.insertAdjacentHTML('beforeend', html);  
            const rectangle = document.getElementById("rectangle");

            let currentLower = 0;
            let rotateCompensation = 0;

            function beer(event) {
                let x = event.beta; 
                let y = event.gamma; 
        
                x += 90;
                y += 90;
        
                if (y > 100) {
                    currentLower += 10;
                    rotateCompensation+= 0.5;
                }

                rectangle.style.transform = "rotateZ("+(((y+rotateCompensation)/2) -45)+"deg) "+"translateY(" + currentLower + "px)";
                document.getElementById("angle").innerHTML = "x : " + x + "<br>y : " + y;
                
                }
        
        
                window.addEventListener("deviceorientation", beer);

        });

       
    },    
};


  export default beer;