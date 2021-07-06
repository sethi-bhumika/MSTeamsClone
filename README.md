# MSTeamsClone
Designing and developing a video conferencing web app for MS Engage 2021

The webapp allows two participants to create and join a video conferencing room, built with the help of ```WebRTC``` Peer to Peer Connections. The signalling layer is established using ```socket.io``` and Google and Mozilla STUN servers are used for ICE negotiations.

Requirements:
- node.js
- express
- socket.io

To run the web app on local host:
- Clone the repository
- Install the dependencies in the package.json by running ```npm install``` command or installing them manually as specified above.
- Change the directory to ```src``` and run ```node app.js```
- Open and view the webapp on localhost:5000

Deployed at https://videochatms.herokuapp.com/
