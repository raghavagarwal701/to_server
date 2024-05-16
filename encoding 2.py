import subprocess
import asyncio
import websockets

PORT = 8080
print("Server listening on Port " + str(PORT))

async def echo(websocket, path):
    print("A client just connected")
    try:
        async for message in websocket:
            print("Received message from client: " + message)
            # Send a response to all connected clients except sender
    except websockets.exceptions.ConnectionClosed as e:
        print("A client just disconnected")

# Start the server
start_server = websockets.serve(echo, "localhost", PORT)
asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()





def convert_video(input_file, output_file):
    command = ['ffmpeg', '-i', input_file, '-c:v', 'libx264', '-c:a', 'aac', '-strict', 'experimental', output_file]
    subprocess.run(command)

# Example usage:
input_file = 'sample_file.mp4'
output_file = './encoded_video/output_video.m3u8'  # HLS playlist file
convert_video(input_file, output_file)
