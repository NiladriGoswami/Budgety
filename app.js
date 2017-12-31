// budget controller
let budgetController = (function() {
  
})();

// ui controller
let UIController = (function() {
  let DOMStrings = {
    inputType: '.add__type',
    inputDesc: '.add__description',
    inputValue: '.add__value',
    inputBtn: '.add__btn',
  };

  // control the ui
  return {
    getInput: function() {
      return {
        type: document.querySelector(DOMStrings.inputType).value,
        description: document.querySelector(DOMStrings.inputDesc).value,
        value: document.querySelector(DOMStrings.inputValue).value,
      };
    },
    getDOMStrings: function() {
      return DOMStrings;
    },
  };
})();

//  controller to create a link between ui and budget controller
let controller = (function(budgetCtrl, UICtrl) {
  let DOM = UICtrl.getDOMStrings();

  let ctrlAddItem = function() {
    //  1. get the field input data
    let input = UICtrl.getInput();
    console.log(input);
    //  2. add the item to the budget controller
    //  3. add new item to the ui
    //  4. calculate the budget
    //  5. display the budget
  };

  document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

  document.addEventListener('keypress', function(event) {
    if (event.keyCode === 13 || event.which === 13 || event.charCode === 13) {
      ctrlAddItem();
    }
  });
})(budgetController, UIController);
