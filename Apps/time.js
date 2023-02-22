const calculator = {
    message: "TIME",
    loadApp(){
      // alert("load app");
      const htmlParent = document.getElementById("app-overlay-id");
      let html = `<div>TIME<br></div>`;
      htmlParent.insertAdjacentHTML('beforeend', html);      
    },

  };

  export default calculator;