//getting inputs from HTML
let divSelectRoom = document.getElementById("selectRoom"); //initial room to enter room number
let divConsultingRoom = document.getElementById("consultingRoom");
const buttonGoRoom = document.getElementById("goRoom");
const inputRoomNumber = document.getElementById("roomNumber");
let localVideo = document.getElementById("localVideo");
let remoteVideo = document.getElementById("remoteVideo");
let divFullRoom = document.getElementById("fullRoom");

let roomNumber, localStream, remoteStream, rtcPeerConnection, isCaller;

const getIceServer = () => {
  return {
    iceServers: [
      { urls: ["stun:bn-turn1.xirsys.com"] },
      {
        username:
          "QJ492G5MAT33YCpGAU9WenKSzTFA_HHYFgdTOwGnUdFdr5HV6zB3fd49tiMBGfRyAAAAAGDcIHFiaHM2NzIwMDE=",
        credential: "bfb00836-d976-11eb-8091-0242ac140004",
        urls: [
          "turn:bn-turn1.xirsys.com:80?transport=udp",
          "turn:bn-turn1.xirsys.com:3478?transport=udp",
          "turn:bn-turn1.xirsys.com:80?transport=tcp",
          "turn:bn-turn1.xirsys.com:3478?transport=tcp",
          "turns:bn-turn1.xirsys.com:443?transport=tcp",
          "turns:bn-turn1.xirsys.com:5349?transport=tcp",
        ],
      },
    ],
  };
};

const streamConstraints = {
  audio: true,
  video: true,
};

const socket = io();

buttonGoRoom.onclick = async function () {
  if (!inputRoomNumber.value) {
    alert("please enter room name");
  } else {
    roomNumber = inputRoomNumber.value;
    socket.emit("create or join", roomNumber); //create or join depending on the status of the room
    divSelectRoom.style = "display: none";
    divConsultingRoom.style = "display: block";
  }
};

socket.on("created", async function (room) {
  //called when a room is created for the first time
  localStream = await navigator.mediaDevices.getUserMedia(streamConstraints); //webRTC API call getUserMedia()
  localVideo.srcObject = localStream;
  isCaller = true; //to determine if the user is the caller or the callee
});

socket.on("joined", async function (room) {
  localStream = await navigator.mediaDevices.getUserMedia(streamConstraints);
  localVideo.srcObject = localStream;
  socket.emit("ready", roomNumber);
  isFull = false;
});

//caller handler
socket.on("ready", async function (room) {
  if (isCaller) {
    rtcPeerConnection = new RTCPeerConnection(iceServers);
    rtcPeerConnection.onicecandidate = onicecandidate;
    rtcPeerConnection.ontrack = onAddStream;
    rtcPeerConnection.addTrack(localStream.getTracks()[0], localStream);
    rtcPeerConnection.addTrack(localStream.getTracks()[1], localStream);
    dataChannel = rtcPeerConnection.createDataChannel(roomNumber);
    const sdp = await rtcPeerConnection.createOffer();
    rtcPeerConnection.setLocalDescription(sdp);
    socket.emit("offer", {
      type: "offer",
      sdp: sdp,
      room: roomNumber,
    });

    dataChannel.onmessage = (event) => {
      headingCallName.innerText = event.data;
    };
  }
});

socket.on("offer", async function (event) {
  if (!isCaller) {
    rtcPeerConnection = new RTCPeerConnection(iceServers);
    rtcPeerConnection.onicecandidate = onicecandidate;
    rtcPeerConnection.ontrack = onAddStream;
    rtcPeerConnection.addTrack(localStream.getTracks()[0], localStream);
    rtcPeerConnection.addTrack(localStream.getTracks()[1], localStream);
    rtcPeerConnection.setRemoteDescription(new RTCSessionDescription(event));

    const sdp = await rtcPeerConnection.createAnswer();
    rtcPeerConnection.setLocalDescription(sdp);
    socket.emit("answer", {
      type: "answer",
      sdp: sdp,
      room: roomNumber,
    });
  }
});

socket.on("candidate", (event) => {
  console.log("received candidate event", event);
  var candidate = new RTCIceCandidate({
    sdpMLineIndex: event.lable,
    candidate: event.candidate.candidate,
    sdpMid: event.id,
  });
  rtcPeerConnection.addIceCandidate(candidate);
});

socket.on("answer", async function (event) {
  rtcPeerConnection.setRemoteDescription(new RTCSessionDescription(event));
});

function onAddStream(event) {
  remoteVideo.srcObject = event.streams[0];
  remoteStream = event.streams[0];
}

function onicecandidate(event) {
  if (event.candidate) {
    console.log(`sending ice candidate`, event.candidate);
    const outgoing = {
      type: "candidate",
      lable: event.candidate.sdpMLineIndex,
      id: event.candidate.sdpMid,
      candidate: event.candidate,
      room: roomNumber,
    };
    console.log(outgoing);
    socket.emit("candidate", outgoing);
  }
}
