#!/usr/bin/env python3
import sys
import json
import struct
import subprocess
import os

def send_message(message):
    """Send a message to Chrome."""
    encoded_message = json.dumps(message).encode('utf-8')
    sys.stdout.buffer.write(struct.pack('I', len(encoded_message)))
    sys.stdout.buffer.write(encoded_message)
    sys.stdout.buffer.flush()

def read_message():
    """Read a message from Chrome."""
    text_length_bytes = sys.stdin.buffer.read(4)
    if not text_length_bytes:
        return None
    text_length = struct.unpack('i', text_length_bytes)[0]
    text = sys.stdin.buffer.read(text_length).decode('utf-8')
    return json.loads(text)

def start_flask_server():
    """Start the Flask server."""
    try:
        # Get the directory containing app.py
        current_dir = os.path.dirname(os.path.abspath(__file__))
        server_dir = os.path.join(current_dir, '3d-model')
        
        # Change to the server directory
        os.chdir(server_dir)
        
        # Start the Flask server
        process = subprocess.Popen(['python', 'app.py'], 
                                 stdout=subprocess.PIPE, 
                                 stderr=subprocess.PIPE)
        
        return True, "Server started successfully"
    except Exception as e:
        return False, str(e)

def main():
    while True:
        message = read_message()
        if message is None:
            break
            
        if message.get('action') == 'start':
            success, message = start_flask_server()
            send_message({
                'success': success,
                'message': message
            })

if __name__ == '__main__':
    main() 