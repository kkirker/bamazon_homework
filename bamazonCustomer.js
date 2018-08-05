var mysql = require("mysql");
var inquirer = require("inquirer");

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "root",
  database: "bamazon"
});

connection.connect(function(err) {
    if (err) console.log("connection error");

    // console.log('connection is up');
    // run the start function after the connection is made to prompt the user
    display();
});


function display() {
    console.log(`
    Welcome to Bamazon, here to meet all your console needs
    ------------------
    Check out what we have in stock
    ------------------
    `);
    connection.query("select * from products", function(err, res) {
        if (err) console.log("display error");
        res.forEach(function(item) {
            console.log(`
            Item Number: ${item.item_id},
            Product name: ${item.product_name},
            Price: ${item.price}
            ------------------

            `);


            
        })

        start(res);
    })
}

// function which prompts the user for what action they should take
function start(productArray) {

    connection.query('select * from products', function(err, res) {
        if (err) console.log("inquire error");
        

        inquirer.prompt([
        {
        name: "item",
        type: "input",
        message: "Which Item (#) would you like to order?"
        },
        {
        name: "qty",
        type: "input",
        message: "How many would you like to order?"
        }
      ])
      .then(function(answer) {
        // console.log(answer);
        
        let exists = false;
        let index = 0;
            for (let i = 0; i < productArray.length; i++){
                if (parseInt(answer.item) === productArray[i].item_id){
                    exists = true;
                    index = i;
                }
            }

        if(!exists) {
            console.log('Item number is not found, try again');
            display();
            return;
        }

        if(productArray[index].stock_qty < answer.qty) {
            console.log('Not enough in stock to complete order ,try again');
            display();
            return;
        }

        else {
            let updated_qty = productArray[index].stock_qty - answer.qty;

            connection.query("update products set stock_qty = " + updated_qty +" where item_id = " + answer.item +"", function(err, res) {
                if (err) console.log("sql update error");

                console.log(`
                Order has been placed!
                Charge for order is ` + answer.qty * productArray[index].price
                );

                inquirer.prompt([
                    {
                    name: "continue",
                    type: "input",
                    message: "Shop some more, yes or no?"
                    },
                ]).then(function(answer) {
                    if(answer.continue === 'no') {
                        console.log("Come again soon");
                        return;
                    } else {
                        display();
                    }
                });
            })
        }

      });

    })
    
}