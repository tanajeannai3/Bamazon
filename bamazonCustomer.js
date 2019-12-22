var mysql = require("mysql");
var Table = require('cli-table2');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "cooper",
    database: "bamazon"
  });

  connection.connect(function(err) {
    if (err) {
      console.error("error connecting: " + err.stack);
      return;
    }
    console.log("connected as id " + connection.threadId);
  });

  connection.query("SELECT * FROM products", function(err, result) {
    if (err) throw err;
    var table = new Table({
        head: ['ID','Product Name', 'Department Name', 'Price', 'Stock Quantity'],
        colWidths: [40,40, 30, 30, 30 , 8], 
        colAligns: ["center","center", "center", "center", "center"], 
        style: {compact: true}
    });
    for(var i = 0; i < result.length; i++){
        table.push([
            result[i].item_id,
            result[i].product_name, 
            result[i].department_name, 
            result[i].price, 
            result[i].stock_quantity]);
        console.log(table.toString());
    }

  inquirer.prompt([
      {
          type: 'input', 
          name: 'purchase', 
          message: 'Enter the id for the product you would like to purchase?',
          filter: Number
      },{
          type: 'input',
          name: 'units',
          message: 'How many units of the product would you like to purchase?',
          filter: Number
      }
  ]).then(function(user){
    var idRequested = user.purchase;
    var unitsRequested = user.units;
    var updatedStock = result[0].stock_quantity - user.units;
      if(unitsRequested <= result[0].stock_quantity){
        connection.query("UPDATE products SET stock_quantity = " 
                        + updatedStock + "WHERE item_id = " + idRequested + ';', function(err, result){
            if (err) throw err;
            console.log(result);
            console.log('Congratulations, the product you requested is in stock! Placing order!');
            console.log("HEY");   
        });
      }else{
          console.log("Insufficient quantity!");   
      }
  })
});
