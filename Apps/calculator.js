const calculator = {
    message: "Hello from myModule!",
    loadApp()
    {
      // const htmlParent = document.getElementById("app-overlay-id");

      fetch('../HtmlTemplates/calculator.html')
        .then(response => response.text())
        .then(html => {
          const htmlParentbis = document.getElementById("app-overlay-id");
          htmlParentbis.insertAdjacentHTML('beforeend', html);

          let result = document.getElementById("result");

          const btn_calc = document.querySelectorAll('.btn-calc');
          const btn_clear = document.getElementById('btn-clear');
          const btn_proceed = document.getElementById('btn-proceed');

          btn_calc.forEach((btn) => {
            btn.addEventListener('click', (event) => {
              let tmp = event.target.value;

              if ( isNaN(tmp) ) {

                if ( tmp == "(" ) {
                  result.value += tmp;
                } else if ( tmp == ")" ) {
                  let count = (result.value.match(/\(/g) || []).length;
                  let countbis = (result.value.match(/\)/g) || []).length;
                  
                  if ( countbis < count && (!isNaN(result.value.charAt(result.value.length-1)) || result.value=="") ) {
                    result.value += tmp;
                  }
                } else if ( isNaN(result.value.charAt(result.value.length-1)) && result.value.charAt(result.value.length-1) != ")" ) {
                  return;
                } else {
                  result.value += tmp;
                }
              } else {
                result.value += tmp;
              }
            });
          });

          btn_clear.addEventListener('click', (event) => {
            result.value = "";
          });

          btn_proceed.addEventListener('click', (event) => {

            if ( isNaN(result.value.charAt(result.value.length-1)) ) {
              result.value = result.value.substring(0, result.value.length-1);
            }

            let count = (result.value.match(/\(/g) || []).length;
            let countbis = (result.value.match(/\)/g) || []).length;

            if ( countbis<count ) {
              for (let i = 0; i < count-countbis; i++) {
                result.value += ")";
              }
            }

            try {
              result.value = eval(result.value);
            } catch (error) {
              alert("Invalid Calculation");
            }
          });
        })
        .catch(error => alert("Erreur dans le chargement de l'application."));
    },

  };

  export default calculator;