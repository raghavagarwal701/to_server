// console.log("Hello world");

const openMediaDevices = async (constraints) => {
    return await navigator.mediaDevices.getUserMedia(constraints);
}


async function playVideoFromCamera() {
    console.log("this is me");
    try {
        const constraints = {'video': true, 'audio': true};
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        const videoElement = document.querySelector('video#localVideo');
        videoElement.srcObject = stream;
    } catch(error) {
        console.error('Error opening video camera.', error);
    }
}

                
                
const signalingChannel = new WebSocket('ws://192.168.0.138:8080');

// Listen for local ICE candidates on the local RTCPeerConnection
signalingChannel.addEventListener('icecandidate', event => {
    if (event.candidate) {
        signalingChannel.send(JSON.stringify({'new-ice-candidate': event.candidate}));
    }
});

// Listen for remote ICE candidates and add them to the local RTCPeerConnection
signalingChannel.addEventListener('message', async message => {
    const iceCandidate = JSON.parse(message.data).iceCandidate;
    if (iceCandidate) {
        try {
            await peerConnection.addIceCandidate(iceCandidate);
        } catch (e) {
            console.error('Error adding received ice candidate', e);
        }
    }
});


                signalingChannel.addEventListener('message', message => {
                    // let message_recived = message.data
                    // message_recived = JSON.parse(message.data)
                    // console.log(typeof message_recived)
                    // // console.log("message form server: " + message_recived);
                    // console.log(message_recived)
                });
                
                // Send an asynchronous message to the remote client
                signalingChannel.addEventListener('open', () => {
                    // Connection is open, now you can send messages
                    // signalingChannel.send('Hello!');
                });
                
                
                async function makeCall() {
                    const configuration = {'iceServers': [{'urls': 'stun:stun.l.google.com:19302'}]};
                    // console.log(configuration)
                    const peerConnection = new RTCPeerConnection(configuration);
                    signalingChannel.addEventListener('message', async message => {
                        let message_rec = JSON.parse(message.data)
                        if (message_rec.answer) {
                            console.log(message_rec);
                            const remoteDesc = new RTCSessionDescription(message_rec.answer);
                            await peerConnection.setRemoteDescription(remoteDesc);
                        }
                    });
                    const offer = await peerConnection.createOffer();
                    
                    await peerConnection.setLocalDescription(offer);
                    signalingChannel.addEventListener('open', () => {
                        let temp = ({'offer': offer})
                        console.log(temp)
                        const offerJSON = JSON.stringify(temp); // Convert offer object to JSON
                        signalingChannel.send(offerJSON);
                        // signalingChannel.send({'offer': offer});
                    });
                }
                makeCall();

// Listen for connectionstatechange on the local RTCPeerConnection
signalingChannel.addEventListener('connectionstatechange', event => {
    if (peerConnection.connectionState === 'connected') {
        // Peers connected!
    }
});



                // let a = playVideoFromCamera();



// Set up an asynchronous communication channel that will be
// used during the peer connection setup
// Establish WebSocket connection to signaling server

// Event listener for WebSocket connection open
// signalingChannel.addEventListener('open', function(event) {
    //     console.log('WebSocket connection opened.');
    
    //     // Now that the connection is open, you can send data
    //     signalingChannel.send('Hello from sender!');
    // });
    
    // // Event listener for incoming messages from signaling server
    // signalingChannel.addEventListener('message', function(event) {
        //     console.log('Received message:', event.data);
        // });
        
        // // Optional: Event listener for WebSocket connection close
        // signalingChannel.addEventListener('close', function(event) {
            //     console.log('WebSocket connection closed.');
            // });
            
            // // Optional: Event listener for WebSocket connection errors
            // signalingChannel.addEventListener('error', function(event) {
                //     console.error('WebSocket connection error:', event);
                // });
                // Example: Sending a message to signaling server
                // signalingChannel.send('Hello from sender!');
                
                // Send an asynchronous message to the remote client
                
                //To see what are available camera devides
                
                // async function getConnectedDevices(type) {
                //     const devices = await navigator.mediaDevices.enumerateDevices();
                //     return devices.filter(device => device.kind === type)
                // }
                
                
                //Taking vido and audio input
                
                // const videoCameras = getConnectedDevices('videoinput');
                // console.log('Cameras found:', videoCameras);
                // try {
                //     const stream = openMediaDevices({'video':true,'audio':true});
                //     console.log('Got MediaStream:', stream);
                // } catch(error) {
                //     console.error('Error accessing media devices.', error);
                // }
                
                //showing the video and audio
                // const peerConnection = new RTCPeerConnection(configuration);
                // signalingChannel.addEventListener('message', async message => {
                    //     if (message.offer) {
                        //         peerConnection.setRemoteDescription(new RTCSessionDescription(message.offer));
                        //         const answer = await peerConnection.createAnswer();
                        //         await peerConnection.setLocalDescription(answer);
                        //         signalingChannel.send({'answer': answer});
                        //     }
                        // });