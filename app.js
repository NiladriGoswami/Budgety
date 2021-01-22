// budget controller
let budgetController = (function() {
  let Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = -1;
  };

  Expense.prototype.calPercentage = function(totalIncome) {
    if (totalIncome > 0) {
      this.percentage = Math.round((this.value / totalIncome) * 100);
    }
  };

  Expense.prototype.getPercentage = function() {
    return this.percentage;
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

    deleteItem: function(type, id) {
      let ids;
      let index;

      ids = data.allItems[type].map(function(current) {
        return current.id;
      });

      index = ids.indexOf(id);
      if (index !== -1) {
        data.allItems[type].splice(index, 1);
      }
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

    calculatePercentages: function() {
      data.allItems.expense.forEach(function(current) {
        current.calPercentage(data.total.income);
      });
    },

    getPercentages: function() {
      let allPercentages =data.allItems.expense.map(function(current) {
        return current.getPercentage();
      });
      return allPercentages;
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
    container: '.container',
    expensesPercentageLabel: '.item__percentage',
    dateLabel: '.budget__title--month',
  };

  let formatNumber = function(num, type) {
    let numSplit;
    let int;
    let dec;

    num = Math.abs(num);
    num = num.toFixed(2);
    numSplit = num.split('.');
    int = numSplit[0];
    dec = numSplit[1];

    if (int.length > 3) {
      int = int.substr(0, int.length - 3)
        + ',' + int.substr(int.length - 3, 3);
    }
    return (type === 'expense' ? '-' : '+') + ' ' + int + '.' + dec;
  };

  let nodeListForEach = function(list, callBack) {
    for (let i = 0; i < list.length; i++) {
      callBack(list[i], i);
    }
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
                          '<i class = "ion-ios-close-outline"> </i>' +
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
                      '<div class = "item__percentage"> 21% </div> ' +
                      '<div class = "item__delete">' +
                        '<button class = "item__delete--btn">' +
                          '<i class = "ion-ios-close-outline"> </i> ' +
                        '</button>' +
                      '</div> ' +
                    '</div>' +
                  '</div>';
        break;
      }
      // replace placeholder text with some actual data
      newHtml = html.replace('%id%', obj.id);
      newHtml = newHtml.replace('%description%', obj.description);
      newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));
      // insert the HTML into the dom
      document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
    },

    deleteListItem: function(selectorID) {
      let element = document.getElementById(selectorID);
      element.parentNode.removeChild(element);
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
      let type;

      obj.budget > 0 ? type = 'income' : type = 'expense';

      document.querySelector(DOMStrings.budgetLabel)
              .textContent = formatNumber(obj.budget, type);
      document.querySelector(DOMStrings.incomeLabel)
              .textContent = formatNumber(obj.totalIncome, 'income');
      document.querySelector(DOMStrings.expenseLabel)
              .textContent = formatNumber(obj.totalExpense, 'expense');

      if (obj.percentage > 0) {
        document.querySelector(DOMStrings.percentageLabel)
                              .textContent = obj.percentage + '%';
      } else {
        document.querySelector(DOMStrings.percentageLabel)
                              .textContent = '---';
      }
    },

    displayPercentages: function(percentages) {
      let fields =
                document.querySelectorAll(DOMStrings.expensesPercentageLabel);

      nodeListForEach(fields, function(current, index) {
        if (percentages[index] > 0) {
          current.textContent = percentages[index] + '%';
        } else {
          current.textContent = '---';
        }
      });
    },

    displayMonth: function() {
      let now;
      let year;
      let month;
      let months;

      months = ['Jan', 'Feb', 'Mar', 'Apr', 'May',
                'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
      now = new Date();

      month = months[now.getMonth()];
      year = now.getFullYear();
      document.querySelector(DOMStrings.dateLabel)
              .textContent = month + ',' + year;
    },

    changeType: function() {
      let fields = document.querySelectorAll(
                            DOMStrings.inputType + ' , ' +
                            DOMStrings.inputDesc + ' , ' +
                            DOMStrings.inputValue);
      nodeListForEach(fields, function(curr) {
        curr.classList.toggle('red-focus');
      });
      document.querySelector(DOMStrings.inputBtn).classList.toggle('red');
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
      /*var cCode = event.which || event.charCode;
      if (event.key === 'Enter' || cCode=== 13 || cCode === 13) {
        ctrlAddItem();
      }*/

      if (event.key === 'Enter') {
        ctrlAddItem();
      }
    });
    document.querySelector(DOM.container)
            .addEventListener('click', ctrlDeleteItem);
    docuemnt.querySelector(DOMStrings.inputType)
            .addEventListener('change', UICtrl.changeType);
  };

  let updateBudget = function() {
    //  1. calculate the budget
    budgetCtrl.calculateBudget();
    //  2. return the budget
    let budget = budgetCtrl.getBudget();
    //  3. display the budget
    UICtrl.displayBudget(budget);
  };

  let updatePercentages = function() {
    // 1. calculate the percentage
    budgetCtrl.calculatePercentages();
    // 2. read percentage from the budget controller
    let percentages = budgetCtrl.getPercentages();
    // 3. update the ui with the new percentages
    UICtrl.displayPercentages(percentages);
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
      //  6. calulate and update the percentages
      updatePercentages();
    }
  };

  let ctrlDeleteItem = function(event) {
    let itemID;
    let splitID;
    let type;
    let ID;

    itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

    if (itemID) {
      splitID = itemID.split('-');
      type = splitID[0];
      ID = parseInt(splitID[1]);

      //  1. delete the item from the data structure
      budgetCtrl.deleteItem(type, ID);
      //  2. delete the item from the use interface
      UICtrl.deleteListItem(itemID);
      //  3. update and show the new budget
      updateBudget();
      //  4. calulate and update the percentages
      updatePercentages();
    }
  };

  return {
    init: function() {
      UICtrl.displayMonth();
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
