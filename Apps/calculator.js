const calculator = {
    message: "Hello from myModule!",
    loadApp(){
      // alert("load app");
      const htmlParent = document.getElementById("app-overlay-id");
      let html = `<div>Hello from calculator<br></div>`;
      htmlParent.insertAdjacentHTML('beforeend', html);      
    },

  };

  export default calculator;