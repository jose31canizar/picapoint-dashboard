var Channel = require("./channel");
var queue = "queue";
Channel(queue, function(err, channel, conn) {
  if (err) {
    console.error(err.stack);
  } else {
    console.log("channel and queue created");
    var work = "make me a sandwich";
    channel.sendToQueue(queue, encode(work), {
      persistent: true
    });
    console.log(" [x] Sent make me a sandwich");
    setTimeout(function() {
      channel.close();
      conn.close();
    }, 500);
  }
});

function encode(doc) {
  return new Buffer(JSON.stringify(doc));
}
