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

            function beer(event) {
                let x = event.beta; 
                let y = event.gamma; 
        
                // if (x > 90) {
                //     x = 90;
                // }
                // if (x < -90) {
                //     x = -90;
                // }
        
                x += 90;
                y += 90;
        
                if (y > 100) {
                    currentLower += 10;
                }

                rectangle.style.transform = "rotateZ("+((y/2) -45)+"deg) "+"translateY(" + currentLower + "px)";


                //if (y > 100) , lower the 
                // set rotation of rectangle to x and y
                // print the angle value in the div angle
                document.getElementById("angle").innerHTML = "x : " + x + "<br>y : " + y;
                
        
                }
        
        
                window.addEventListener("deviceorientation", beer);

        });

//get element by id rectangle

       
    },    
};


  export default beer;