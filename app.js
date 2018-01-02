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
    budget: 0,
    percentage: -1,
  };

  let calculateTotal = function(type) {
    let sum = 0;
    data.allItems[type].forEach(function(curr) {
      sum += curr.value;
    });
    data.total[type] = sum;
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

    calculateBudget: function() {
      // calculate total income and expenses
      calculateTotal('expense');
      calculateTotal('income');
      // calculate the budget: income - expenses
      data.budget = data.total.income - data.total.expense;
      // calculate the percentage of income spent
      if (data.total.income > 0) {
        data.percentage = Math.round(
                          (data.total.expense / data.total.income) * 100);
      } else {
        data.percentage = -1;
      }
    },

    getBudget: function() {
      return {
        budget: data.budget,
        totalIncome: data.total.income,
        totalExpense: data.total.expense,
        percentage: data.total.percentage,
      };
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
    budgetLabel: '.budget__value',
    incomeLabel: '.budget__income--value',
    expenseLabel: '.budget__expenses--value',
    percentageLabel: '.budget__expenses--percentage',
  };

  // control the ui
  return {
    getInput: function() {
      return {
        type: document.querySelector(DOMStrings.inputType).value,
        description: document.querySelector(DOMStrings.inputDesc).value,
        value: parseFloat(document.querySelector(DOMStrings.inputValue).value),
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

    clearFields: function() {
      let fields;
      let fieldsArray;
      fields = document.querySelectorAll(DOMStrings.inputDesc +
                                              ', ' + DOMStrings.inputValue);
      fieldsArray = Array.prototype.slice.call(fields);

      fieldsArray.forEach(function(currentValue, index, array) {
        currentValue.value = '';
      });

      fieldsArray[0].focus();
    },

    displayBudget: function(obj) {
      document.querySelector(DOMStrings.budgetLabel)
                              .textContent = obj.budget;
      document.querySelector(DOMStrings.incomeLabel)
                              .textContent = obj.totalIncome;
      document.querySelector(DOMStrings.expenseLabel)
                              .textContent = obj.totalExpense;

      if (obj.percentage > 0) {
        document.querySelector(DOMStrings.percentageLabel)
                              .textContent = obj.percentage + '%';
      } else {
        document.querySelector(DOMStrings.percentageLabel)
                              .textContent = '---';
      }
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

  let updateBudget = function() {
    //  1. calculate the budget
    budgetCtrl.calculateBudget();
    //  2. return the budget
    let budget = budgetCtrl.getBudget();
    //  3. display the budget
    UICtrl.displayBudget(budget);
  };

  let ctrlAddItem = function() {
    let input;
    let newItem;
    //  1. get the field input data
    input = UICtrl.getInput();

    if (input.description !== '' && !isNaN(input.value) && input.value > 0) {
      //  2. add the item to the budget controller
      newItem = budgetCtrl.addItem(input.type, input.description, input.value);
      //  3. add new item to the ui
      UICtrl.addListItem(newItem, input.type);
      //  4. clear the fields
      UICtrl.clearFields();
      //  5. calculate and update budget
      updateBudget();
    }
  };

  return {
    init: function() {
      UICtrl.displayBudget({
        budget: 0,
        totalIncome: 0,
        totalExpense: 0,
        percentage: -1,
      });
      setUpEventListeners();
    },
  };
})(budgetController, UIController);


controller.init();
