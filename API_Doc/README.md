# Restaur-All REST API Documentation

## Authentication API

### Sign Up
- description: create a new user
- request: `POST /signup/`
    - content-type: `application/json`
    - body: object
      - username: (string) user's username
      - password: (string) user's password
      - type: (string) type of user
- response: 200
    - cookie: username of user
    - content-type: `application/json`
    - body: empty object
- response: 500
    - body: error message

``` 
$ curl -H "Content-Type: application/json" -X POST -d '{"username":"foo","password":"hello", "type":"worker"}' -c cookie.txt localhost:3000/signup/
``` 

### Sign In
- description: sign user in
- request: `POST /signin/`
    - content-type: `application/json`
    - body: object
      - username: (string) user's username
      - password: (string) user's password
- response: 200
    - cookie: username of user
    - content-type: `application/json`
    - body: empty object
- response: 500
    - body: error message
- response: 409
    - body: username does not exist
- response: 401
    - body: Incorrect Username/Password

``` 
$ curl -H "Content-Type: application/json" -X POST -d '{"username":"foo","password":"hello"}' -c cookie.txt localhost:3000/signin/
```

### Sign Out
- description: sign user out
- request: `GET /signout/`
- response: 200
    - cookie: cookies is cleared
    - content-type: `application/json`
    - body: null
- response: 401
    - body: access denied

``` 
$ curl -b cookie.txt -c cookie.txt localhost:3000/signout/
```


## Order API

## Read

- description: gets menu items, pass category as query string, if no category provided, all menu items are returned
- request: `GET api/menuItems/`   
- response: 200
    - content-type: `application/json`
    - body: object
      - item_id: id of menu item
      - name: name of menu item
      - category: the category of the menu item
      - price: price of the menu item 
- response 500
    - body: error message
- response: 401
    - body: access denied
 
``` 
$ curl -b cookie.txt http://localhost:3000/api/menuItems
``` 


- description: gets the menu categories
- request: `GET /api/categories/`   
- response: 200
    - content-type: `application/json`
    - body: object
      - category_name: name of the category
      - color: the color that will be displayed for the category
- response 500
    - body: error message
- response: 401
    - body: access denied
 
``` 
$ curl -b cookie.txt http://localhost:3000/api/categories
``` 


- description: gets all orders that are paid or all orders that are not paid
- request: `GET /api/orders/:paid/`   
- response: 200
    - content-type: `application/json`
    - body: object
      - order_number: the order number
      - number_of_items: the number of menu items in the order
      - total: the cost of the order
      - completed: whether the order is completed or not
      - payed: whether the order has been payed for
- response 500
    - body: error message
- response: 401
    - body: access denied
 
``` 
$ curl -b cookie.txt http://localhost:3000/api/orders/false
``` 


- description: gets the order with the specified number
- request: `GET /api/orderItems/:orderNumber/`   
- response: 200
    - content-type: `application/json`
    - body: object
      - order_number: the order number
      - number_of_items: the number of menu items in the order
      - total: the cost of the order
      - completed: whether the order is completed or not
      - payed: whether the order has been payed for
- response 500
    - body: error message
- response: 401
    - body: access denied
 
``` 
$ curl -b cookie.txt http://localhost:3000/api/orders/0
``` 


- description: gets the highest order number
- request: `GET /api/orderNumber/`   
- response: 200
    - content-type: `application/json`
    - body: object
      - max(order_number): the max order number
- response 500
    - body: error message
- response: 401
    - body: access denied
 
``` 
$ curl -b cookie.txt http://localhost:3000/api/orderNumber
```

### Update

- description: update the order total based on given order number
- request: `PATCH /api/api/order/total/`
    - content-type: `application/json`
    - body: object
      - total: total of the order
      - orderNumber: order number
- response: 200
    - content-type: `application/json`
    - body: empty

```
curl -X PATCH -H "Content-Type: application/json" -b cookie.txt -d '{"total": 100, "orderNumber": 1 }' http://localhost:3000/api/order/total/ 
```

- description: update payment status of an order
- request: `PATCH /api/order/payed/`
    - content-type: `application/json`
    - body: object
      - payed: boolean indicating whether the order has been payed
      - orderNumber: order number
- response: 200
    - content-type: `application/json`
    - body: empty

```
curl -X PATCH -H "Content-Type: application/json" -b cookie.txt -d '{"payed": 0, "orderNumber": 1 }' http://localhost:3000/api/order/payed/
```

- description: update "complete" status of an order
- request: `PATCH /api/order/status/complete/`
    - content-type: `application/json`
    - body: object
      - completed: boolean indicating whether the order has been complete
      - orderNumber: order number
- response: 200
    - content-type: `application/json`
    - body: empty

```
curl -X PATCH -H "Content-Type: application/json" -b cookie.txt -d '{"completed": 0, "orderNumber": 1 }' http://localhost:3000//api/order/status/complete/
```

### Create

- description: create a new order
- request: `POST /api/orders/`
    - content-type: `application/json`
    - body: object
      - order_number: the order number
      - number_of_items: the number of menu items in the order
      - total: the cost of the order
      - completed: whether the order is completed or not
      - payed: whether the order has been payed for
- response: 200
    - content-type: `application/json`
    - body: object
      - empty
- response: 500
    - body: error message
- response: 401
    - body: access denied

``` 
$ curl -H "Content-Type: application/json" -X POST -d '{"order_number":1,"number_of_items":1, "total":9, "completed":0, "payed":0}' -b cookie.txt localhost:3000/api/orders/
```

- description: create a new order item
- request: `POST /api/orderItems/`
    - content-type: `application/json`
    - body: object
      - id: id of the order item
      - order_number: number of the order this item belongs to
      - name: the name of the item
      - crossed: whether the order item is crossed out or not
      - price: price of the order item
      - quantity: quantity of the item ordered
- response: 200
    - content-type: `application/json`
    - body: object
      - empty
- response: 500
    - body: error message
- response: 401
    - body: access denied

``` 
$ curl -H "Content-Type: application/json" -X POST -d '{"id":10, "order_number":1,"name":"Burger", "crossed":0, "price":10, "quantity":2}' -b cookie.txt localhost:3000/api/orderItems/
```

- description: create a new menu item
- request: `POST /api/menuItems/`
    - content-type: `application/json`
    - body: object
      - name: name of the order item
      - category: category of the item
      - price: the price of the item
- response: 200
    - content-type: `application/json`
    - body: object
      - empty
- response: 500
    - body: error message
- response: 401
    - body: access denied

``` 
$ curl -H "Content-Type: application/json" -X POST -d '{"name":"newITem", "category":"Dinner","price":6}' -b cookie.txt localhost:3000/api/menuItems/
```

### Delete
  
- description: delete the specified order items
- request: `DELETE /api/order/items/`
    - content-type: `application/json`
    - body: object
      - orderNumber: the order number that we use to delete order items
- response: 200
    - body: empty object
- response: 500
    - body: error message
- response: 401
    - body: access denied

``` 
$ curl -H "Content-Type: application/json" -X DELETE -d '{"orderNumber":1}' -b cookie.txt localhost:3000/api/order/items/
```

- description: delete the specified order
- request: `DELETE /api/order/`
    - content-type: `application/json`
    - body: object
      - orderNumber: the order number of the order we want to delete
- response: 200
    - body: empty object
- response: 500
    - body: error message
- response: 401
    - body: access denied

``` 
$ curl -H "Content-Type: application/json" -X DELETE -d '{"orderNumber":1}' -b cookie.txt localhost:3000/api/order/
```


## Calendar API

### Create

- description: create a new calendar
- request: `POST /api/calendars/`
    - content-type: `application/json`
    - body: object
      - name: the name of the calendar
      - startDate: the start date of the calendar
- response: 200
    - content-type: `application/json`
    - body: object
      - empty
- response: 500
    - body: error message
- response: 401
    - body: access denied

``` 
$ curl -H "Content-Type: application/json" -X POST -d '{"name":"week test","startDate":"2019-03-25"}' -b cookie.txt localhost:3000/api/calendars/
```

### Read

- description: gets the calendars, accepts a limit if provided as a query string
- request: `GET /api/calendars/`   
- response: 200
    - content-type: `application/json`
    - body: object
      - c_id: id of the calendar
      - name: name of calendar
      - start_date: the start date of the calendar
      - selected_intervals: the currently selected intervals in the calendar,
      - uid: the last interval id,
      - updated_at: date when the calendar row was updated
- response 500
    - body: error message
- response: 401
    - body: access denied
 
``` 
$ curl -b cookie.txt http://localhost:3000/api/calendars/?limit=5
``` 

### Update

- description: update an existing calendar
- request: `PATCH /api/calendars/:id/`
    - content-type: `application/json`
    - body: object
      - name: the name of the calendar
      - startDate: the start date of the calendar
      - selectedIntervals: the selected intervals of the calendar
      - uid: the last interval id
      - c_id: the id of the calendar
- response: 200
    - content-type: `application/json`
    - body: object
      - empty
- response: 500
    - body: error message
- response: 401
    - body: access denied

``` 
$ curl -H "Content-Type: application/json" -X PATCH -d '{"name":"week test","startDate":"2019-03-25", "selectedIntervals":
"[{"start":"2019-03-27T13:15:00.000Z","end":"2019-03-27T14:15:00.000Z","value":"Bob","uid":3},{"start":"2019-03-25T13:15:00.000Z","end":"2019-03-25T14:15:00.000Z","value":"John","uid":4},{"start":"2019-03-26T13:15:00.000Z","end":"2019-03-26T14:15:00.000Z","value":"Hello","uid":5}]", "uid": 6, "c_id": 1}' -b cookie.txt localhost:3000/api/calendars/1
```


## Messaging API

### Read

- description: gets the contacts
- request: `GET /api/users/`   
- response: 200
    - content-type: `application/json`
    - body: object
      - username: username of the user
- response 500
    - body: error message
- response: 401
    - body: access denied
 
``` 
$ curl -b cookie.txt http://localhost:3000/api/users
``` 

- description: gets the messages for the specified recipient. 
- request: `GET /api/messages/`   
- response: 200
    - content-type: `application/json`
    - body: object
      - message_id: id of the message
      - sender: username of the sender
      - recipient: username of the recipient
      - message: the content of the message
      - created_at: date when the row was created
- response 500
    - body: error message
- response: 401
    - body: access denied
 
``` 
$ curl -b cookie.txt http://localhost:3000/api/messages/?recipient=bob
``` 

### Create

- description: create a new message
- request: `POST /api/messages/`
    - content-type: `application/json`
    - body: object
      - recipient: the username of the recipient
      - message: the content of the message
- response: 200
    - content-type: `application/json`
    - body: object
      - empty
- response: 500
    - body: error message
- response: 401
    - body: access denied

``` 
$ curl -H "Content-Type: application/json" -X POST -d '{"recipient":"Bob","message":"Hey Bob it is foo"}' -b cookie.txt localhost:3000/api/messages/
```