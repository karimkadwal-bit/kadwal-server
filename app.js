const API =
"https://kadwal-server.onrender.com";

async function testServer() {

const response =
await fetch(API);

const data =
await response.text();

console.log(data);

}

testServer();
