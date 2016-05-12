Rest Utils Library
==================

## Overview

restUtils is a small library that helps to implement REST-like SERVER using different transport means: HTTP, amqp,...
It is intended to be used as a npm module.

If you are looking for a client-side implementation for talking with your restUtils server, check *eyeos-consume-service* component

## How to use it

### AMQP transport usage and configuration

The restUtils amqp implementation eases you from  the need to create all the boilerplate to do request-reply (response queues,
 correlation id,...).

**An usage snippet:**

```javascript
    var RestUtilsServer = require('RestUtils').Server;
    var aServer = new RestUtilsServer(new MyRestRouter(), this.settings.queueConfiguration);
    
    var MyRestRouter = function(){ // your initializations here.
    };
    
    MyRestRouter.prototype.dispatch = function(request, response){
       // do your fancy business here
       // on success:
       response.end();
       // on some error:
       var httpLikeResponseCode = 404;
       response.fail(httpLikeResponseCode);
    };
```

**Configuring your restUtils amqp server**

```javascript
	queueConfiguration: {
		type: "amqp",
		hosts: 'rabbitmq1:5672,rabbitmq2:5672,rabbitmq3:5672', //list of rabbitmq brokers in the form host:port
		queue: {
			name: 'amazing.queue.v1',
			durable: true,
			exclusive: false,
			autoDelete: false
		},
		subscription: { 
		    // corresponds to headers parameter in: //https://github.com/postwait/node-amqp#queuesubscribeoptions-listener
			ack: false // autoack of messages?
		},
		bindTo: [ // optional param: bind the queue to related exchanges
		        {
		            exchangeName: "super.exchange.v1",
		            routingKey: "super-routing", // optional: routing key for the binding
		            options: { // correspond to options in: https://github.com/postwait/node-amqp#connectionexchange
		                type: 'direct',
		                durable: true
		            }
		           
		        }, 
		    ...
		]
	}
```

## Quick help

* Install modules

```bash
	$ npm install
```

* Check tests

```bash
    $ ./tests.sh
```