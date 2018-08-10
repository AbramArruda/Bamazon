// Requiring npm packages to use 
var mysql = require("mysql");
var inquirer = require("inquirer");

// Creating empty array variables to store data
var itemIDList = [];
var allItems = [];

// Creating connection to mySQL server
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "bamazon"
});
  
connection.connect(function(err) {
    if (err) throw err;
    customerStart();
});

function customerStart() {

// Looping through all products and console logging them
connection.query("SELECT * FROM products", function (err, results, fields) {
    if (err) throw err;
    console.log("Products available to purchase:");
    for (i=0; i<results.length; i++) {
      itemIDList.push(results[i].item_id);
        allItems.push({
          item_id: results[i].item_id,
          stockQuantity: results[i].stock_quantity
        });
         if (results[i].stock_quantity > 0) {
          console.log(`Item ${results[i].item_id}: ${results[i].product_name} || $${results[i].price}ea || Quantity: ${results[i].stock_quantity}`)
        }
    }
     transaction();
  });
};

// Inquirer function to purchase the products 
function transaction() {
  inquirer.prompt([
    {
      name: "itemID",
      message: "Enter item number for the product you wish to buy.",
      validate: function(input) {
        if (itemIDList.findIndex(function(val) {
          if (val == input) return true;
        }) > -1) {
          return true;
        } else {
          return "Enter an Item's ID number";
        }
      }
    },
  {
    name: "quantity",
    message: "Enter amount to purchase:",
    validate: function(input, answers) {
      var itemIndex = allItems.findIndex(function(element) {
        if (element.item_id == answers.itemID) return true;
      });

      if (parseInt(input) < allItems[itemIndex].stockQuantity) {
        return true;
      } else {
        return "We don't have that many in stock.";
        }
      }
    }
  ]).then(function(answers) {
    
    var amountBought = parseInt(answers.quantity);
    var itemID = answers.itemID;

// Query that updates the inventory in mySQL database
    connection.query("UPDATE products SET stock_quantity=stock_quantity-? WHERE item_id=?", [amountBought,itemID], function (err, results, fields) {
      if (err) throw err;
    });

// Query that displays the total cost
  connection.query("SELECT price FROM products WHERE item_id=?", itemID, function (err, results, fields) {
      if (err) throw err;
      var total = results[0].price * amountBought;
      console.log(`Your Total is: ${total}`);
    });
  });
  }