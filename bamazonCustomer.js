var mysql = require("mysql");
var inquirer = require("inquirer");
var table = require("cli-table");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "trilogy",
    password: "password",
    database: "bamazon_db"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log(" welcome to Alabama's very own Amazon copy!");
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
            price += ".00";
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
        message: "What would you like to purchase?",
        validate: function (input){
            var input = parseInt(input);
            if ((isNAN(input)=== false ) && !(input <=0)){
                return true;
            }
            else {
                console.log("Enter a valid number!");
            }
        }
        },
        {
        name: "quantity",
        type: "input",
        message: "How many would you like to buy?",
        validate: function (input){
            var input = parseInt(input);
            if ((isNaN(input)=== false) && !(input <=0)){
                return true;
            }
            else {
                console.log("Enter a valid number!");
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
            console.log("There are only "+ response[0].stock_quantity + " left, please enter another quantity");
            continueShopping();
        }
        else {
            console.log("You bought " + answer.quantity + " of " + response[0].product_name);
            var total = answer.quantity * response[0].price;
            var totalSales = total + response[0].product_sales;

            connection.query("update products set stock_quantity = stock_quantity - ?, product_sales = ? where item_id = ?", [answer.quantity, totalProductSales, response[0].item_id],
            function (error) {
                if (error) throw err;
                var totalDecimal = currencyConverter(total, "$");
                console.log("Total purchased: " + totalDecimal);
                continueShopping();
            });
        }
    });
});
};

function continueShopping(){

};

function currencyConverter(){

};