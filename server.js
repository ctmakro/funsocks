var net = require('net')

//--tcp server
var tcp_server = net.createServer()
//tcp_server is a net.Server, which is an EventEmitter

tcp_server.on('connection',(socket) => { //socket is a net.Socket, which is also an EventEmitter
  socket.setEncoding('utf8');
  console.log('client connected to tcp_server');
  console.log('from:',socket.localAddress);

  socket.on('data',(data)=>{
    console.log('data incoming:');
    console.log(data);

    var response = 'HTTP/1.1 200 OK\r\nContent-Type: text/html\r\n\r\n<h1>tcp_server</h1><p>reached</p>'
    console.log('writing response');
    console.log(response);
    socket.write(response);
    socket.end();
  })
})

tcp_server.on('listening',()=>{
  console.log('tcp_server listening on',8008);
})

tcp_server.listen(8008)
//--tcp server ends

//--http server
var http = require('http')
var destination_server = http.createServer()

destination_server.on('request',(req,res)=>{
  res.write('<h1>destination reached.</h1>')
  res.write('<p>'+ Date.now().toString()+'</p>')
  res.end()
})

destination_server.on('listening',()=>{
  console.log('destination_server listening on',8118)
})

destination_server.listen(8118)
//--http server ends

//--proxy server
var proxy_server = net.createServer();
proxy_server.on('connection',(socket)=>{
  socket.setEncoding('utf8');
  var connection = net.connect(8118,'localhost') //connection is also a Socket

  connection.on('data',(data)=>{
    socket.write(data);
  })

  socket.on('data',(data)=>{
    connection.write(data);
  })

  connection.on('end',()=>{
    socket.end()
  })

  socket.on('end',()=>{
    connection.end()
  })
})
proxy_server.listen(8228)
//--proxy server ends

process.openStdin().on('data',function(d){ //press enter in console to restart
  if(d.toString().trim()=='')
  process.exit();
});
