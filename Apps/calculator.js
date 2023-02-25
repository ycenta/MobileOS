const calculator = {
    message: "Hello from myModule!",
    loadApp()
    {
      // alert("load app");
      const htmlParent = document.getElementById("app-overlay-id");
      let html = `<div>Hello from calculator<br><div>
      <input type="text" id="result" disabled>
    </div>
    <div>
      <button id="btn-clear">C</button>
      <button class="btn-calc" value="(">(</button>
      <button class="btn-calc" value=")">)</button>
      <button class="btn-calc" value="/">/</button>
    </div>
    <div>
      <button class="btn-calc" value="7">7</button>
      <button class="btn-calc" value="8">8</button>
      <button class="btn-calc" value="9">9</button>
      <button class="btn-calc" value="*">*</button>
    </div>
    <div>
      <button class="btn-calc" value="4">4</button>
      <button class="btn-calc" value="5">5</button>
      <button class="btn-calc" value="6">6</button>
      <button class="btn-calc" value="-">-</button>
    </div>
    <div>
      <button class="btn-calc" value="1">1</button>
      <button class="btn-calc" value="2">2</button>
      <button class="btn-calc" value="3">3</button>
      <button class="btn-calc" value="+">+</button>
    </div>
    <div>
      <button class="btn-calc" value="0">0</button>
      <button class="btn-calc" value=".">.</button>
      <button id="btn-proceed">=</button>
    </div></div>`;
      htmlParent.insertAdjacentHTML('beforeend', html);

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
    },

  };

  export default calculator;