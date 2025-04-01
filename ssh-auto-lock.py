#! python3
# Kelsey Gilbert 2025-03-31 CC0: https://creativecommons.org/public-domain/cc0/

import importlib
import subprocess
import sys
import time

assert sys.platform == 'win32', f'Not supported: {sys.platform}'

# -

WINDOW_TITLE = 'ssh-auto-lock.py'
VERBOSE = '-v' in sys.argv

# -

def pip_install(package_name):
   install_args = [sys.executable] + f'-m pip install {package_name}'.split(' ')
   yn = input(f'pip-install "{package_name}"? (y/N) ')
   yes = yn != '' and yn in 'Yy'
   print(f'("{yn}" => {yes})')
   if not yes:
      return False
   print(f'> {" ".join(install_args)}')
   subprocess.run(install_args)

   import importlib
   importlib.invalidate_caches()
   return True

# -

while True:
   try:
      import win32gui
      import win32api
      import win32con
      import win32ts
      break
   except ModuleNotFoundError as e:
      print(f'Module "{e.name}" not found.')
      if not pip_install('pywin32'):
         raise
      try:
         import win32gui
      except ModuleNotFoundError as e:
         print(f'Module "{e.name}" still not found!')
         print(f'`importlib.invalidate_caches()` is probably still broken:',
               'https://stackoverflow.com/questions/77354992/pythons-importlib-invalidate-caches-doesnt-seem-to-work-in-my-case')
         print(f'Rerun the command and it should work though!')
         exit(1)
      continue

# -

THIS_MODULE = win32api.GetModuleHandle(None)

# -

def print2(*args):
   return print(f'[{time.ctime()}]', *args)

# -

def RegisterClass(name, fn_wnd_proc, hinst=THIS_MODULE):
   wc = win32gui.WNDCLASS()
   wc.hInstance = hinst
   wc.lpszClassName = name
   wc.lpfnWndProc = fn_wnd_proc
   return win32gui.RegisterClass(wc)


class CreateWindow:
   def __init__(self, wclass, title='', hinst=THIS_MODULE, style=0, x=0, y=0, w=0, h=0, parent=0, menu=0):
      self.hwnd = win32gui.CreateWindow(wclass, title,
         style, x, y, w, h, parent, menu, hinst, None)
      #win32gui.UpdateWindow(self.hwnd)

   def close(self):
      if not self.hwnd:
         return
      win32gui.DestroyWindow(self.hwnd)
      self.hwnd = None

   def __enter__(self):
      return self

   def __exit__(self, exc_type, exc_value, traceback):
      self.close()

# -

WM_NAME_BY_ID = {
   win32con.WM_CREATE: 'WM_CREATE',
   win32con.WM_GETMINMAXINFO: 'WM_GETMINMAXINFO',
   win32con.WM_NCCREATE: 'WM_NCCREATE',
   win32con.WM_CLOSE: 'WM_CLOSE',
   win32con.WM_DESTROY: 'WM_DESTROY',
   win32con.WM_QUERYENDSESSION: 'WM_QUERYENDSESSION',
   0x2b1: 'WM_WTSSESSION_CHANGE',
}

EVENT_BY_WTS_SESSION_WPARAM = {
   0x7: 'WTS_SESSION_LOCK',
   0x8: 'WTS_SESSION_UNLOCK',
}

# -

def on_WTS_SESSION_LOCK():
   print2(f'Session lock detected. Clearing ssh-agent:')
   cmd = 'ssh-add -D'
   print2(f'> {cmd}')
   subprocess.run(cmd.split(' '))


def on_WTSSESSION_CHANGE(hwnd, event, session_id):
   try:
      event = EVENT_BY_WTS_SESSION_WPARAM[event]
   except KeyError:
      pass
   if VERBOSE:
      print2(f'<WTSSESSION_CHANGE(event={event}, session_id={session_id})>')

   if event == 'WTS_SESSION_LOCK':
      on_WTS_SESSION_LOCK()


def WNDPROC(hwnd, msg, wparam, lparam):
   try:
      msg = WM_NAME_BY_ID[msg]
   except KeyError:
      # You might be able to find it here: https://github.com/mhammond/pywin32/blob/main/win32/Lib/win32con.py
      #print(f'Warning: Unknown WNDPROC msg: {msg}')
      pass
   if VERBOSE:
      print2(f'<WNDPROC(hwnd, {msg}, {wparam}, {lparam})>')

   if msg == 'WM_CLOSE':
      WINDOW.close()
   elif msg == 'WM_DESTROY':
      win32gui.PostQuitMessage(0)
   elif msg == 'WM_QUERYENDSESSION':
      return True

   # Thank you @grawity: https://superuser.com/a/264973
   if msg == 'WM_WTSSESSION_CHANGE':
      on_WTSSESSION_CHANGE(hwnd, wparam, lparam)

   return 0

# -

WCLASS = RegisterClass('ssh-auto-lock.py: hidden window', WNDPROC)

with CreateWindow(WCLASS, title=WINDOW_TITLE) as WINDOW:
   win32ts.WTSRegisterSessionNotification(WINDOW.hwnd, win32ts.NOTIFY_FOR_ALL_SESSIONS)
   print2('Waiting for session change...')
   try:
      #win32gui.PumpMessages() # Seems uninterruptable!
      while win32gui.PumpWaitingMessages() == 0:
         continue
   except KeyboardInterrupt:
      WINDOW.close()
