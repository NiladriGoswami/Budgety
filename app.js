// budget controller
let budgetController = (function() {
  let Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  let Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  let data = {
    allItems: {
      expense: [],
      income: [],
    },
    total: {
      expense: 0,
      income: 0,
    },
  };
  return {
    addItem: function(type, desc, val) {
      let newItem;
      let ID;
      // create new Id
      if (data.allItems[type].length > 0) {
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else {
        ID = 0;
      }
      // create new Item based on 'inc' or 'exp'
      switch (type) {
        case 'income':
          newItem = new Income(ID, desc, val);
        break;
        case 'expense':
          newItem = new Expense(ID, desc, val);
        break;
      }
      // push it into the data structure
      data.allItems[type].push(newItem);
      // return new element
      return newItem;
    },
  };
})();

// ui controller
let UIController = (function() {
  let DOMStrings = {
    inputType: '.add__type',
    inputDesc: '.add__description',
    inputValue: '.add__value',
    inputBtn: '.add__btn',
    incomeContainer: '.income__list',
    expensesContainer: '.expenses__list',
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
    addListItem: function(obj, type) {
      let html;
      let newHtml;
      let element;
      // create HTML String with placeholder text
      switch (type) {
        case 'income':
          element = DOMStrings.incomeContainer;
          html = '<div class = "item clearfix" id = "income-%id%">' +
                    '<div class = "item__description"> %description% </div>' +
                    '<div class = "right clearfix"> ' +
                      '<div class = "item__value" > %value% </div> ' +
                      '<div class = "item__delete"> ' +
                        '<button class = "item__delete--btn"> ' +
                          '< i class = "ion-ios-close-outline"> </i>' +
                        '</button> ' +
                      '</div>' +
                    '</div>' +
                  '</div>';
        break;
        case 'expense':
          element = DOMStrings.expensesContainer;
          html = '<div class = "item clearfix" id = "expense-%id%" >' +
                   '<div class = "item__description"> %description% </div> ' +
                    '<div class = "right clearfix">' +
                      '<div class = "item__value"> %value% </div> ' +
                      '<div class = "item__percentage"> 21 % < /div> ' +
                      '<div class = "item__delete">' +
                        '<button class = "item__delete--btn">' +
                          '< i class = "ion-ios-close-outline"> </i> ' +
                        '</button>' +
                      '</div> ' +
                    '</div>' +
                  '</div>';
        break;
      }
      // replace placeholder text with some actual data
      newHtml = html.replace('%id%', obj.id);
      newHtml = newHtml.replace('%description%', obj.description);
      newHtml = newHtml.replace('%value%', obj.value);
      // insert the HTML into the dom
      document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
    },

    getDOMStrings: function() {
      return DOMStrings;
    },
  };
})();

//  controller to create a link between ui and budget controller
let controller = (function(budgetCtrl, UICtrl) {
  /**
   * sets up the event listeners
   * @return {void}
   */
  function setUpEventListeners() {
    let DOM = UICtrl.getDOMStrings();
    document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
    document.addEventListener('keypress', function(event) {
      if (event.keyCode === 13 || event.which === 13 || event.charCode === 13) {
        ctrlAddItem();
      }
    });
  };

  let ctrlAddItem = function() {
    let input;
    let newItem;
    //  1. get the field input data
    input = UICtrl.getInput();
    //  2. add the item to the budget controller
    newItem = budgetCtrl.addItem(input.type, input.description, input.value);
    //  3. add new item to the ui
    UICtrl.addListItem(newItem, input.type);
    //  4. calculate the budget
    //  5. display the budget
  };

  return {
    init: function() {
      console.log('The app has started');
      setUpEventListeners();
    },
  };
})(budgetController, UIController);


controller.init();
