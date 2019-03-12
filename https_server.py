#! /usr/bin/env python3
assert __name__ == '__main__'
print(__file__)
import http.server
import pathlib
import ssl

import argparse

parser = argparse.ArgumentParser()
parser.add_argument('--bind', '-b', default='localhost', metavar='ADDRESS',
                    help='Specify alternate bind address '
                         '[default: all interfaces]')
parser.add_argument('--cache', '-c', action='store',
                    default=0, type=int,
                    help='Allow caching [default: 0]')
parser.add_argument('port', action='store',
                    default=4443, type=int,
                    nargs='?',
                    help='Specify alternate port [default: 4443]')
args = parser.parse_args()


class CustomRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        if not args.cache:
            self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
            self.send_header("Pragma", "no-cache")
            self.send_header("Expires", "0")
        super().end_headers()

CERT_FILE = str(pathlib.PurePath(__file__).with_name('server.pem'))

httpd = http.server.ThreadingHTTPServer(('', 4443), CustomRequestHandler)
try:
    httpd.socket = ssl.wrap_socket(httpd.socket, certfile=CERT_FILE, server_side=True)
except FileNotFoundError:
    print(f'''{CERT_FILE} not found.
Try `openssl req -new -x509 -keyout server.pem -out {CERT_FILE} -days 365 -nodes`''')
    exit(1)
print(f'Serving at {httpd.socket.getsockname()}...')
httpd.serve_forever()
