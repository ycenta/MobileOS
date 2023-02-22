const calculator = {
    message: "TIME",
    loadApp(){
      // alert("load app");
      const htmlParent = document.getElementById("app-overlay-id");
      let html = `<div>TIME commit<br></div>`;
      htmlParent.insertAdjacentHTML('beforeend', html);      
    },

  };

  export default calculator;