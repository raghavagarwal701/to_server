import subprocess
import asyncio
import websockets
from aiortc import RTCPeerConnection, RTCSessionDescription
import json

PORT = 8080
print("Server listening on Port " + str(PORT))

async def echo(websocket, path):
    print("A client just connected")
    # await websocket.send("Hello there!")
    # def serialize_session_description(session_description):
    #     return {
    #         'sdp': session_description.sdp,
    #         'type': session_description.type
    #     }
    async def handle_offer(offer):
        # print("this is ........ ", offer)
        configuration = {"iceServers": [{"urls": "stun:stun.l.google.com:19302"}]}
        peer_connection = RTCPeerConnection(configuration)
        await peer_connection.setRemoteDescription(RTCSessionDescription(sdp=offer["sdp"], type=offer["type"]))
        answer = await peer_connection.createAnswer()
        await peer_connection.setLocalDescription(answer)
        print(answer)
        return answer
        
    try:
        async for message in websocket:
            # print(type(message))
            print("Received message from client: " + message)
            if message:
                try:
                    data = json.loads(message)
                except json.JSONDecodeError as e:
                    print(f"Failed to decode JSON: {e}")
                    continue
            if 'offer' in data:
                offer = data['offer']
                answer = await handle_offer(offer)
                await websocket.send(json.dumps({'answer': {'sdp': answer.sdp, 'type': answer.type}}))
            # Send a response to all connected clients except sender
    except websockets.exceptions.ConnectionClosed as e:
        print("A client just disconnected")

# Start the server
start_server = websockets.serve(echo, "192.168.0.138", PORT)
asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()


def convert_video(input_file, output_file):
    command = ['ffmpeg', '-i', input_file, '-c:v', 'libx264', '-c:a', 'aac', '-strict', 'experimental', output_file]
    subprocess.run(command)

# Example usage:
input_file = 'sample_file.mp4'
output_file = './encoded_video/output_video.m3u8'  # HLS playlist file
convert_video(input_file, output_file)
