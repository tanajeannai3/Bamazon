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
        colWidths: [40, 40, 40, 40, 40], 
        colAligns: ["center","center", "center", "center", "center"], 
        style: {compact: true}
    });
    for(var i = 0; i < result.length; i++){
        table.push([
            result[i].item_id,
            result[i].price,
            result[i].product_name, 
            result[i].department_name, 
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
    var unitsRequested = user.units;
    var itemRequested = result.purchase;
    var price = result[0].price;
      if(unitsRequested <= result[0].stock_quantity){
        connection.query("UPDATE products SET ? WHERE ?",
          [{stock_quantity:  result[0].stock_quantity - user.units},
            {item_id: user.purchase}],
          function(err, result){
            if (err) throw err;
            console.log('Congratulations, the product you requested is in stock! Placing order!'); 
            console.log("Your total for today is $" + parseInt(unitsRequested) * parseInt(price));
            console.log(result);
            console.log(itemRequested);
        });
      }else{
          console.log("Insufficient quantity!");   
      }
      update();
  })
  function update(user){
   
    var query = connection.query("UPDATE products SET ? WHERE ?",
    [{
      stock_quantity: parseInt(unitsRequested) * parseFloat(price)
    }, 
    {
      item_id: parseInt(result[0].stock_quantity) - parseInt(itemRequested)
    }
  ],)
  console.log(query.sql);
}
});
