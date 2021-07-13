# MSTeamsClone

Designing and developing a video conferencing web app for MS Engage 2021

The webapp allows participants to create and join a video conferencing room, built with the help of `WebRTC` Peer to Peer Connections. The signalling layer is established using `socket.io` and STUN/TURN servers, from https://xirsys.com/ are used for ICE negotiations.

The webapp is deployed at https://videochatms.herokuapp.com/. For best experience, view in Google Chrome.

Requirements:

- node.js
- express
- socket.io

To run the web app on local host:

- Clone the repository
- Install the dependencies in the package.json by running `npm install` command.
- Change the directory to `src` and run `node app.js`
- Open and view the webapp on localhost:5000

Features:

- Allows multiple participans
- Video turn on/off
- Mute/unmute user audio
- Pin screen
- Picture in picture(floating video)
- Screen sharing(Entire screen/tab/window)
- Recording(video/screen)
- Live chat(text, emoticons and autolink)

For detailed documentation, see: [Design Document](https://github.com/sethi-bhumika/msteamsclone/blob/main/doc/design%20doc.pdf)

For a video demo, watch at:

This project was made as a part of Microsoft Engage 2021 Mentorship programme, following principles of Agile Methodology. Agile refers to software development through iterations, with periodic assessment of evolving requirements and solutions. Here's a spreadsheet reflecting my journey on this project with Agile: [this](https://docs.google.com/spreadsheets/d/1canzuielmuemxebzevfevusadbvbhjzu6dmnr5hyp4g/edit?usp=sharing)
