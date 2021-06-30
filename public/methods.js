export default {
  getIceServer() {
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
  },

  isAvailable() {
    return !!(
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia ||
      navigator.msGetUserMedia
    );
  },

  getFullMedia() {
    if (this.isAvailable()) {
      return navigator.mediaDevices.getUserMedia({
        video: true,
        audio: { echoCancellation: true, noiseSuppression: true },
      });
    } else {
      throw new Error("User media not available");
    }
  },

  getAudio() {
    if (this.isAvailable()) {
      return navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true },
      });
    } else {
      throw new Error("User media not available");
    }
  },

  setLocalStream(stream, mirrorMode = true) {
    const divLocal = document.getElementById("localVideo");
    divLocal.srcObject = stream;
    mirrorMode
      ? divLocal.classList.add("mirror-mode")
      : divLocal.classList.remove("mirror-mode");
  },

  replaceTrack(stream, recipentPeer) {
    let sender = recipientPeer.getSenders
      ? recipientPeer
          .getSenders()
          .find((s) => s.track && s.track.kind === stream.kind)
      : false;
    sender ? sender.replaceTrack(stream) : "";
  },
};
