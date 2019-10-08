var playerController = (function () {

    var Forward = function (id, name, salary) {
        this.id = id;
        this.name = name;
        this.salary = salary;
        this.percentage = -1;
    };

    var Defense = function (id, name, salary) {
        this.id = id;
        this.name = name;
        this.salary = salary;
        this.percentage = -1;
    };

    var Goalie = function (id, name, salary) {
        this.id = id;
        this.name = name;
        this.salary = salary;
        this.percentage = -1;
    };

    var calculateTotal = function (type) {
        var sum = 0;

        data.players[type].forEach(function (curr) {
            sum += curr.salary;
        });

        data.totals[type] = sum;
    };

    var data = {
        players: {
            for: [],
            def: [],
            goal: []
        },
        totals: {
            for: 0,
            def: 0,
            goal: 0
        },
        projectedCapHit: 0,
        projectedCapSpace: 0,
        percentage: -1

    };

    return {
        addItem: function (name, type, sal) {
            var newItem, ID;

            ID = 0;

            //Itt egy ID - t hozunk létre
            if (data.players[type].length > 0) {
                ID = data.players[type][data.players[type].length - 1].id + 1;
            } else {
                ID = 0;
            }
            //A type típusokat a HTML add__player <selected> részében adtam meg és ez alapján tudok rá hivatkozni. A data/players - nél is ugyan az kell legyen a nev. Három helyen kell egyezés legyen: HTML, data/players/ és itt
            if (type === 'for') {
                newItem = new Forward(ID, name, sal);
            } else if (type === 'def') {
                newItem = new Defense(ID, name, sal);
            } else if (type === 'goal') {
                newItem = new Goalie(ID, name, sal);
            }

            data.players[type].push(newItem);

            return newItem;
        },

        deleteItem: function (type, id) {
            var ids, index;

            ids = data.players[type].map(function (curr) {
                return curr.id;
            });

            //A tömbben elfoglalt helyét adja meg az indexof!
            index = ids.indexOf(id);

            if (index !== -1) {
                data.players[type].splice(index, 1);
            }
        },

        calculateCap: function () {

            //Calculate total PCH and PCS/ Itt meghívja mind a hármat egyszerre
            calculateTotal('for');
            calculateTotal('def');
            calculateTotal('goal');

            //Calculate the CAP
            //Ez lesz a PROJECTED CAP SPACE, tehát hogy mennyi marad - 
            //a data.totals.projected.CapHit: hogy mennyit költöttek idáig
            data.projectedCapHit = data.totals.for+data.totals.def + data.totals.goal;
            data.projectedCapSpace = 81.5 - data.projectedCapHit;

            //Possibility: the percentage of PCH that we spent
        },

        getCap: function () {
            return {
                projectedCapHit: data.projectedCapHit.toFixed(2),
                projectedCapSpace: 81.5 - data.projectedCapHit.toFixed(2)
            };
        },

        testing: function () {
            console.log(data);
        }
    };

})();

var UIController = (function () {

    var DOMStrings = {
        inputBtn: '.add__btn',
        inputName: '.add__name',
        inputType: '.add__player',
        inputSalary: '.add__salary',
        projectedCapHit: '.cap__projected__used__cap',
        projectedCapSpace: '.cap__remaining__space',
        forwardContainer: '.forward__list',
        defenseContainer: '.defense__list',
        goalieContainer: '.goalie__list',
        usedCapHit: '.cap__projected__used__cap',
        container: '.container'
    };

    //PUBLIC
    return {
        //így kapom meg mind a három értéket egyszerre, a return segítségével tudom átadni az értékeket a többi IIFE - nek
        getInput: function () {
            return {
                name: document.querySelector(DOMStrings.inputName).value,
                //ez lehet forward, defense, goalie. Ennek segítségével tesszük be őket a megfelelő helyre
                type: document.querySelector(DOMStrings.inputType).value,
                salary: parseFloat(document.querySelector(DOMStrings.inputSalary).value.replace(',', '.'))
            };
        },

        addListItem: function (obj, type) {
            var html, newHtml, element;
            //1. Create HTML string with placeholder text
            if (type === 'for') {
                element = DOMStrings.forwardContainer;

                html = '<div class="player__list clearfix" id="for-%id%"><div class="player__name">%name%</div><div class="right clearfix"><div class="player__salary">$ %salary% M</div><div class="player__delete"><button class="player__delete__btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'def') {
                element = DOMStrings.defenseContainer;

                html = '<div class="player__list clearfix" id="def-%id%"><div class="player__name">%name%</div><div class="right clearfix"><div class="player__salary">$ %salary% M</div><div class="player__delete"><button class="player__delete__btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'goal') {
                element = DOMStrings.goalieContainer;

                html = '<div class="player__list clearfix" id="goal-%id%"><div class="player__name">%name%</div><div class="right clearfix"><div class="player__salary">$ %salary% M</div><div class="player__delete"><button class="player__delete__btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';

            }
            //2. Replace the placeholder text with some actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%name%', obj.name);
            newHtml = newHtml.replace('%salary%', this.formatNumber(obj.salary));
            //3. Insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },

        deleteListItem: function (selectorID) {
            var el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);
        },

        clearFilds: function () {
            var fields, fieldsArray;

            fields = document.querySelectorAll(DOMStrings.inputName + ', ' + DOMStrings.inputSalary);
            fieldsArray = Array.prototype.slice.call(fields);

            fieldsArray.forEach(function (current) {
                current.value = "";
            });
            fieldsArray[0].focus();
        },

        displayCap: function (obj) {

            if (obj.projectedCapHit > 81.51) {
                document.querySelector(DOMStrings.projectedCapHit).textContent = '!$ ' + obj.projectedCapHit + ' M!';
                document.querySelector(DOMStrings.projectedCapHit).style.color = 'red';
                document.querySelector(DOMStrings.projectedCapHit).style.fontWeight = '400';
                
            }if (obj.projectedCapSpace < 0){
                document.querySelector(DOMStrings.projectedCapSpace).textContent = '-$' + obj.projectedCapSpace + ' M!';
                document.querySelector(DOMStrings.projectedCapSpace).style.color = 'red';
                document.querySelector(DOMStrings.projectedCapSpace).style.fontWeight = '400';
                
            } else {
                document.querySelector(DOMStrings.projectedCapHit).textContent = '$ ' + obj.projectedCapHit + ' M';
                document.querySelector(DOMStrings.projectedCapSpace).textContent = '$ ' + this.formatNumber(obj.projectedCapSpace) + ' M';
            }


        },

        formatNumber: function (num) {
            var numSplit, int, dec;
            num = Math.abs(num);
            num = num.toFixed(3);

            numSplit = num.split('.');

            int = numSplit[0];
            dec = numSplit[1];
            console.log(int, dec);

            if (int === '0' && int.length === 1) {
                int = int.substr(0, 1) + '.' + dec.substr(0, 3);
            } else if (int.length === 1) {
                int = int.substr(0, 1) + '.' + dec.substr(0, 3);
            } else if (int.length === 2) {
                int = int.substr(0, 2) + '.' + dec.substr(0, 3);
            }
            return int;

        },

        errorFiltering: function () {

            var playerData = UIController.getInput();
            console.log(playerData);

            if (playerData.name === "" && isNaN(playerData.salary)) {
                document.querySelector('.missing__name_salary').style.display = 'block';
            } else if (!isNaN(playerData.name)) {
                document.querySelector('.name__error').style.display = 'block';
            } else if (isNaN(playerData.salary) || playerData.salary === 0) {
                document.querySelector('.salary__error').style.display = 'block';
            } else if (playerData.name === "") {
                document.querySelector('.name__error').style.display = 'block';
            } else if (playerData.salary > 15) {
                document.querySelector('.wrong__salary_number').style.display = 'block';
            }

            if (document.querySelector(DOMStrings.inputSalary).addEventListener('click', function () {
                    document.querySelector('.salary__error').style.display = 'none';
                    document.querySelector('.missing__name_salary').style.display = 'none';
                    document.querySelector('.wrong__salary_number').style.display = 'none';
                })) {} else if (document.querySelector(DOMStrings.inputName).addEventListener('click', function () {
                    document.querySelector('.name__error').style.display = 'none';
                    document.querySelector('.missing__name_salary').style.display = 'none';

                    document.querySelector('.wrong__salary_number').style.display = 'none';

                })) {} else {

            }
        },

        getDOMStrings: function () {
            return DOMStrings;
        }
    };

})();

var controller = (function (playerCtrl, UICtrl) {

    //Itt az eventListenereket tároljuk!
    var setupEventListener = function () {
        var DOM = UICtrl.getDOMStrings();

        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function (event) {

            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }
        });

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
    };

    var updatePlayer = function () {

        //1. Calculate the CAP
        playerCtrl.calculateCap();
        //2. Return CAP
        var cap = playerCtrl.getCap();
        //3. Display the salary the UI
        console.log(cap);
        UICtrl.displayCap(cap);

    };

    //Itt tárolom a UIControllerben létrehozott HTML osztályokat

    var ctrlAddItem = function () {
        var playerData, newItem, fields, DOM;

        DOM = UICtrl.getDOMStrings();
        //1. Get the field input data. 
        //A beírt adatokat a playerData - ban fogja tárolni! itt már tárolja a játékos típsát
        playerData = UICtrl.getInput();

        //Vizsgálja a hibás mezőket
        UICtrl.errorFiltering();

        if (playerData.name !== "" &&
            isNaN(playerData.name) &&
            !isNaN(playerData.salary) &&
            playerData.salary > 0 &&
            playerData.name.length <= 30 &&
            playerData.salary <= 15) {

            //2. Add the item to the budget controller
            newItem = playerCtrl.addItem(playerData.name, playerData.type, playerData.salary);
            console.log(newItem);
            //3. Add the item to the UI
            UICtrl.addListItem(newItem, playerData.type);

            //4. Clear Fields
            UICtrl.clearFilds();

            //5. Calculate and Update CAP
            updatePlayer();
        }
    };

    var ctrlDeleteItem = function (event) {
        var item, splitID, type, ID;

        item = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if (item) {
            splitID = item.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);

            //1. Delete the item from the data structure
            playerCtrl.deleteItem(type, ID);

            //2. Delete the item from the UI
            UICtrl.deleteListItem(item);

            //3. Update and show the new budget
            updatePlayer();
        }
    };

    return {
        init: function () {
            console.log('Maki elkezdődött!');
            UICtrl.displayCap({
                projectedCapHit: 0,
                projectedCapSpace: 0
            });
            setupEventListener();
        }
    };

})(playerController, UIController);

controller.init();
