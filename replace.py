#!/usr/bin/env python3

import re
import sys

(_,*FLAGS,PATTERN,REPLACEMENT,PATH) = sys.argv

FLAGS = set(FLAGS)
for flag in FLAGS:
   assert flag.startswith('-'), flag

# Default to dry-run
DRY = '--write' not in FLAGS

try:
   with open(PATH,'rb') as f:
      b = f.read()
      s = b.decode()
except UnicodeDecodeError as e:
   start_byte = e.start
   line_num = 1
   line_start = 0
   for i in range(start_byte):
      if b[i] == b'\n'[0]:
         line_num += 1
         line_start = i+1
   next_newline = b.find(b'\n', e.end)
   sys.stderr.write(f'\nUnicodeDecodeError: {PATH}:{line_num}:\n')

   offset_on_line = start_byte-line_start
   offset_on_printed_line = 2 + offset_on_line
   sys.stderr.write(b[line_start:next_newline] + '\n')
   sys.stderr.write(' '*offset_on_printed_line + '^\n')
   raise

(s2, count) = re.subn(PATTERN, REPLACEMENT, s)

if not count:
   sys.stderr.write(f'[{PATH}]\tNo change.\n')
   exit(0)

b = s2.encode()

if DRY:
   sys.stderr.write(f'[{PATH}]\tWould write {len(b)} bytes...\n')
   if '--show' in FLAGS:
      sys.stdout.buffer.write(b + b'\n')
   exit(0)

if count:
   sys.stderr.write(f'[{PATH}]\tWriting {len(b)} bytes...\n')
   with open(PATH, 'wb') as f:
      f.write(b)

exit(0)
