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
          const btn_del = document.getElementById('btn-del');

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

          document.addEventListener("keyup", function(event) {

            let tmp_tab = ["+","-","*","/"];

            if ( !isNaN(event.key) ) {
              result.value += event.key;
            } else if ( event.key == "Delete" ) {
              result.value = "";
            } else if ( event.key == "(" || event.key == ")" ) {
              if ( event.key == "(" && isNaN(result.value.charAt(result.value.length-1)) ) {
                result.value += event.key;
              } else if ( event.key == ")" ) {
                let count = (result.value.match(/\(/g) || []).length;
                let countbis = (result.value.match(/\)/g) || []).length;
                
                if ( countbis < count && (!isNaN(result.value.charAt(result.value.length-1)) || result.value=="") ) {
                  result.value += event.key;
                }
              }
            } else if ( tmp_tab.includes(event.key) ) {
              if ( (isNaN(result.value.charAt(result.value.length-1)) && result.value.charAt(result.value.length-1) != ")") ) {
                return;
              }

              result.value += tmp_tab[tmp_tab.indexOf(event.key)];
            } else if ( event.key == "Enter" ) {
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
            } else if ( event.key == "Backspace"  ) {
              result.value = result.value.substring(0, result.value.length-1);
            }
          });

          btn_del.addEventListener('click', (event) => {
            result.value = result.value.substring(0, result.value.length-1);
          });

          html
        })
        .catch(error => alert("Erreur dans le chargement de l'application."));
    },

  };

  export default calculator;