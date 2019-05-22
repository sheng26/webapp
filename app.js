const express = require("express");
var mysql = require('mysql');
const app = express();
const bodyParser = require("body-parser");
const session = require("express-session");
const crypto = require('crypto');
const cookie = require('cookie');
const validator = require('validator');
const path = require('path');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static("static"));
const http = require("http").Server(app);
let io = require('socket.io')(http);

// let connection = mysql.createConnection({
//   host     : 'us-cdbr-iron-east-03.cleardb.net',
//   user     : 'ba0377610f29a3',
//   password : 'ba7536a6',
//   database : 'heroku_fe0497af3fd9759',
// });

// let connection = mysql.createConnection({
//   host     : 'localhost',
//   user     : 'root',
//   password : 'test123',
//   database : 'restaurall',
// });

let connection = null;

//https://stackoverflow.com/questions/14087924/cannot-enqueue-handshake-after-invoking-quit
function initializeConnection(config) {
    function addDisconnectHandler(connection) {
        connection.on("error", function (error) {
            if (error instanceof Error) {
                if (error.code === "PROTOCOL_CONNECTION_LOST") {
                    console.error(error.stack);
                    console.log("Lost connection. Reconnecting...");

                    initializeConnection(connection.config);
                } else if (error.fatal) {
                    throw error;
                }
            }
        });
    }

    connection = mysql.createConnection(config);

    // Add handlers.
    addDisconnectHandler(connection);

    connection.connect();
    return connection;
}

connection = initializeConnection({
    host     : 'us-cdbr-iron-east-02.cleardb.net',
    user     : 'b48689093dca92',
    password : '16192734',
    database : 'heroku_04e29547e248034',
});

app.use(session({
    secret: "please change this secres",
    resave: false,
    saveUninitialized: true
}));

let isAuthenticated = function(req, res, next){
	if(!req.username) return res.status(401).end("access denied");
    next();
};

let checkUsername = function(req, res, next) {
    if (!validator.isAlphanumeric(req.body.username)) return res.status(400).end("bad input");
    next();
};

let checkPassword = function(req, res, next) {
    if (!validator.isAlphanumeric(req.body.password)) return res.status(400).end("bad input");
    next();
};

let sanitizeMessage = function(req, res, next) {
    req.body.message = validator.escape(req.body.message);
    next();
};

let checkId = function(req, res, next) {
    if (!validator.isAlphanumeric(req.params.id)) return res.status(400).end("bad input");
    next();
};

let checkAction = function(req, res, next) {
    if (!validator.isAlphanumeric(req.body.action)) return res.status(400).end("bad input");
    next();
};

app.use(function (req, res, next){
    req.username = (req.session.username)? req.session.username : null;
    next();
});

function generateSalt (){
    return crypto.randomBytes(16).toString('base64');
}

function generateHash (password, salt){
    let hash = crypto.createHmac('sha512', salt);
    hash.update(password);
    return hash.digest('base64');
}

app.post('/signup/', checkUsername, checkPassword, function (req, res, next) {
    let username = req.body.username;
    let password = req.body.password;
    let type = req.body.type;

    // Generating Salted hash for password
    let salt = generateSalt();
    let hash = generateHash(password, salt);
    let sql_insert = "INSERT INTO users (username, password, salt, type) VALUES (?, ?, ?, ?)";
    connection.query(sql_insert, [username, hash, salt, type], function (err, result, fields) {
      if (err) {
        return res.status(500).end(err.toString());
      }
      else{
      	//Initialize cookie
		res.setHeader('Set-Cookie', cookie.serialize('username', username, {
			path: '/',
			maxAge: 60*60*24*7
		}));

		//store username into session
		req.session.username = username;

        return res.json("Successfully signed up");
      }
    });

});

app.post('/signin/', checkUsername, checkPassword, function (req, res, next) {
    let username = req.body.username;
    let password = req.body.password;
	
    let sql_search = "SELECT * FROM users WHERE username = ? "
    connection.query(sql_search, [username], function (err, result, fields) {
      	if (err) {
        	return res.status(500).end(err.toString());
      	}

	  	if(result.length === 0){
	  		return res.status(409).end("username does not exist");
		}

	  	let database_hash = result[0].password;
	  	let database_salt = result[0].salt;
        let check_hash = generateHash(password, database_salt);
      	if (check_hash == database_hash){
      		//Initialize cookie
			res.setHeader('Set-Cookie', cookie.serialize('username', username, {
				path: '/',
				maxAge: 60*60*24*7
			}));
			//initialize session
      		req.session.username = username;
      		console.log(req.session.username);
        	return res.json("User: " + username + " signed in");
      	}
      	else{
        	return res.status(401).end("Incorrect Username/Password");
      	}
    });

});

app.get("/signout/", isAuthenticated, function(req, res){
	req.session.username = "";
	res.setHeader("Set-Cookie", cookie.serialize('username', '', {
		path : '/', 
        maxAge: 60 * 60 * 24 * 7
	}));
	return res.json(null);
});

io.on('connection', function(socket){

	socket.on('disconnect', function(){
		socket.disconnect();
	});

	socket.on("calendarUpdated", function(cal){
		socket.broadcast.emit("calendarUpdated", cal);
	});

	socket.on("messagesUpdate", function(mes){
		io.emit("messagesUpdate", mes);
	});
});

//http://www.technicaladvices.com/2012/12/18/the-easiest-way-to-check-empty-objects-in-javascript/
function isEmptyObj(myObject) {
    for(var key in myObject) {
        if (myObject.hasOwnProperty(key)) {
            return false;
        }
    }
    return true;
}

//gets menu items, pass category as query string, if no category provided, all menu items are returned
app.get("/api/menuItems/", isAuthenticated, function(req, res){
	let category = "";
	let whereClause = "";
	if(!isEmptyObj(req.query)){
		category = req.query.category;
		whereClause = " WHERE `category` = ?";
	}

	let query = "SELECT * FROM `menu_items`" + whereClause;
	connection.query(query, [category], function(error, result, fields){
		if(error){
			return res.status(500).end(error.toString());
		}
		else {
			return res.json(result);
		}
	});
});

app.get("/api/categories/", isAuthenticated, function(req, res){

	let query = "SELECT * FROM `menu_categories`";

	connection.query(query, function(error, result, fields){
		if(error){
			return res.status(500).end(error.toString());
		}
		else {
			return res.json(result);
		}
	});
});

app.get("/api/orders/:paid/", isAuthenticated, function(req, res){
	let query = "SELECT * FROM `orders` WHERE `payed` = " + req.params.paid;

	connection.query(query, function(error, result, fields){
		if(error){
			return res.status(500).end(error.toString());
		}
		else {
			return res.json(result);
		}
	});
});

app.get("/api/orderItems/:orderNumber/", isAuthenticated, function(req, res){

	let query = "SELECT * FROM `order_items` WHERE `order_number` = " + req.params.orderNumber;

	connection.query(query, function(error, result, fields){
		if(error){
			return res.status(500).end(error.toString());
		}
		else {
			return res.json(result);
		}
	});
});

app.get("/api/orderNumber/", function(req, res){

	let query = "SELECT max(order_number) FROM `orders`";

	connection.query(query, function(error, result, fields){
		if(error){
			return res.status(500).end(error.toString());
		}
		else {
			return res.json(result);
		}
	});
});

app.post("/api/orders/", isAuthenticated, function(req, res){

	let query = "INSERT INTO orders (order_number, number_of_items, total, completed, payed) values (?, ?, ?, ?, ?)";
	connection.query(query, [req.body.order_number, 
		req.body.number_of_items,
		req.body.total,
		req.body.completed,
		req.body.payed], function(err, result, fields){
		if(err) {
			res.status(500).end(err.toString());
		}
		else {
			res.json(result);
		}
	});
});

app.post("/api/orderItems/", isAuthenticated, function(req, res){

	let query = "INSERT INTO order_items (id, order_number, name, crossed, price, quantity) values (?, ?, ?, ?, ?, ?)";
	connection.query(query, [req.body.id,
		req.body.order_number,
		req.body.name,
		req.body.crossed,
		req.body.price,
		req.body.quantity], function(err, result, fields){
		if(err) {
			res.status(500).end(err.toString());
		}
		else {
			res.json(result);
		}
	});
});

//gets all users, except the logged in user
app.get("/api/users/", isAuthenticated, function(req, res){

	let query = "SELECT * FROM `users` where `username` != ?";

	connection.query(query, [req.session.username], function(error, result, fields){
		if(error){
			return res.status(500).end(error.toString());
		}
		else {
			return res.json(result);
		}
	});
});

//Insert menu item into the database
app.post("/api/menuItems", isAuthenticated, function(req, res){

	let query = "INSERT INTO menu_items (name, category, price) values (?, ?, ?)";
	connection.query(query, [req.body.name, req.body.category, req.body.price], function(err, result, fields){
		console.log('connected as id ' + connection.threadId);
		if(err) {
			res.status(500).end(err.toString());
		}
		else {
			res.json(result);
		}
	});
});

//Update order total
app.patch("/api/order/total/", isAuthenticated, function(req, res){
	let query = "UPDATE `orders` SET `total` = ? WHERE `order_number` = ?;";
	connection.query(query, [req.body.total, req.body.orderNumber], 
		function(err, result, fields){
		if(err) {
			res.status(500).end(err.toString());
		}
		else {
			res.json(result);
		}
	});
});

//Update order payed status
app.patch("/api/order/payed/", isAuthenticated, function(req, res){
	let query = "UPDATE `orders` SET `payed` = ? WHERE `order_number` = ?;";
	connection.query(query, [req.body.payed, req.body.orderNumber], 
		function(err, result, fields){
		if(err) {
			res.status(500).end(err.toString());
		}
		else {
			res.json(result);
		}
	});
});

//Update the completed status of an order
app.patch("/api/order/status/complete/", isAuthenticated, function(req, res){
	let query = "UPDATE `orders` SET `completed` = ? WHERE `order_number` = ?;";
	connection.query(query, [req.body.completed, req.body.orderNumber], 
		function(err, result, fields){
		if(err) {
			res.status(500).end(err.toString());
		}
		else {
			res.json(result);
		}
	});
});

// delete all items from an order from processing orders
app.delete("/api/order/items/", isAuthenticated, function(req, res){
	let query = "DELETE FROM `order_items` WHERE order_number = ?";
	connection.query(query, [req.body.orderNumber], function(err, result, fields){
		if(err) {
			return res.status(500).end(err.toString());
		}
		else {
			return res.json(result);
		}
	});
});

// delete an order from processing orders
app.delete("/api/order/", isAuthenticated, function(req, res){
	let query = "DELETE FROM `orders` WHERE `order_number` = ?";
	connection.query(query, [req.body.orderNumber], function(err, result, fields){
		if(err) {
			return res.status(500).end(err.toString());
		}
		else {
			return res.json(result);
		}
	});
});

//Insert calendar into the database
app.post("/api/calendars", isAuthenticated, function(req, res){
	let query = "INSERT INTO calendars (name, start_date) values (?, ?)";
	connection.query(query, [req.body.name, req.body.startDate.toString()], function(err, result, fields){
		if(err) {
			return res.status(500).end(err.toString());
		}
		else {
			return res.json(result);
		}
	});

});

//Update calendar in the database
app.patch("/api/calendars/:id/", isAuthenticated, function(req, res){
	let c_id = req.params.id;
	let query = "UPDATE `calendars` SET `name` = ?, `start_date` = ?, `selected_intervals` = ?, `uid` = ? where `c_id` = ?;";
	// console.log([req.body.name, req.body.start_date.toString(), JSON.stringify(req.body.selected_intervals), req.body.uid.toString(), c_id])
	connection.query(query, [req.body.name, req.body.start_date.toString(), req.body.selected_intervals, req.body.uid.toString(), c_id], 
		function(err, result, fields){
		if(err) {
			res.status(500).end(err.toString());
		}
		else {
			res.json(result);
		}
	});

});

//gets the calendars sorted by descending start date, accepts a limit as a query string
app.get("/api/calendars/", isAuthenticated, function(req, res){
	let limit = [];
	let limitClause = "";
	if(req.query != {}){
		limit = [parseInt(req.query.limit)];
		limitClause = " LIMIT ?";
	}

	let query = "SELECT * FROM `calendars` order by `start_date` desc" + limitClause;

	connection.query(query, limit, function(error, result, fields){
		if(error) {
			return res.status(500).end(error.toString());
		}
		else {
			return res.json(result);
		}
	});
});

//gets the messages for the specified users. The users are passed through the query string
app.get("/api/messages/", isAuthenticated, function(req, res){
	let user2 = req.query.recipient;
	let query = "SELECT * FROM `messages` WHERE (`sender` = ? AND `recipient` = ?) OR (`sender` = ? AND `recipient` = ?) ORDER BY created_at ASC";
	connection.query(query, [req.session.username, user2, user2, req.session.username], function(error, result, fields){
		if(error) {
			return res.status(500).end(error.toString());
		}
		else {
			return res.json(result);
		}
	});
});

//Insert message into the database
app.post("/api/messages", sanitizeMessage, isAuthenticated, function(req, res){
	let query = "INSERT INTO messages (sender, recipient, message) values (?, ?, ?)";
	connection.query(query, [req.session.username, req.body.recipient, req.body.message], function(err, result, fields){
		if(err) {
			return res.status(500).end(err.toString());
		}
		else {
			return res.json(result);
		}
	});

});

if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, 'client/build')));
  // Handle React routing, return all requests to React app
  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

// const PORT = 5000;
const PORT = process.env.PORT || 5000;

http.listen(PORT, function(err){
	if(err) console.log(err);
	else console.log("HTTP server on http://localhost%s", PORT);
});

