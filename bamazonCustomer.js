var mysql = require("mysql");
var inquirer = require("inquirer");
var table = require("cli-table");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "trilogy",
    password: "Scrubs99",
    database: "bamazon_db"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log(" welcome to Alabama's very own Amazon!");
    console.log("*******************************************");
    start();
})

function start(){
    var data;
    connection.query("select item_id, product_name, department_name, price, stock_quantity from products", function (err, response){
    data = new table({
        head: ["id", "Product Name", "Department Name", "Price", "Quantity"],
        colWidths: [6, 60, 20, 10, 6]
    });
    for ( var i=0; i< response.length; i++) {
        var price = response[i].price.toString();
        if (price.indexOf(".")===-1) {
            price += ".00 Dollars";
        }
        data.push([response[i].item_id, response[i].product_name, response[i].department_name, price, response[i].stock_quantity])
    }
    console.log(data.toString());
    shop();
    });
};
function shop() {
    inquirer.prompt([
        {
        name: "buyId",
        type: "input",
        message: "What Item would you like to purchase? (please use id number)",
        validate: function (input){
            var input = parseInt(input);
            if ((isNaN(input)=== false ) && !(input <=0) && inpue !== ""){
                return true;
            }
            else {
                console.log("\nEnter a valid number!");
                return false;
            }
        }
        },
        {
        name: "quantity",
        type: "input",
        message: "How many would you like to buy?",
        validate: function (input){
            var input = parseInt(input);
            if ((isNaN(input)=== false) && !(input <=0) && inpue !== ""){
                return true;
            }
            else {
                console.log("\nEnter a valid number!");
                return false;
            }
        }
    }
]).then(function (answer) {
    connection.query("select item_id, product_name, department_name, price, stock_quantity from products where ?", {
        item_id: answer.buyId
    },
    function (err, response) {
        if (err) throw err;
        if (response[0].stock_quantity < answer.quantity) {
            console.log("Only "+ response[0].stock_quantity + " left, please enter another quantity");
            continueShopping();
        }
        else {
            console.log("You bought " + answer.quantity + " " + response[0].product_name + " from the " + response[0].department_name + " Department");
            var total = answer.quantity * response[0].price;
            var newQuantity = response[0].stock_quantity - answer.quantity;

            connection.query("update products set stock_quantity = ? where item_id = ?",
            [newQuantity, response[0].item_id],
            
            function () {
                var totalDecimal = currencyConverter(total, "$");
                console.log("Total purchased: " + totalDecimal);
                continueShopping();
            });
        }
    });
});
};

function continueShopping(){
    inquirer.prompt({
        name: "continue",
        type: "list",
        choices: ["continue","quit"],
        message: "would you like to continue or quit?"
    }).then(function(event){
        if (event.continue === "continue"){
            console.log("\r\n------We're still Shopping!");
            start();
        }
        else {
            console.log("thanks for shopping!");
            connection.end();
        }
    });
};

function currencyConverter(n, currency){
    return currency + n.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");

};