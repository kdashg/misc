#! python3

from pathlib import *
from typing import *
import sys

'''
def template(foo):
   pass
'''
class MozBuild_Files(object):
   def __init__(self, path_glob, eg_srcdir_resolver_js=None):
      pass
   def __enter__(self):
      pass
   def __exit__(self, type, value, traceback):
      pass

SRCDIR = Path('.')

CONFIG: dict[str,Any] = {
   "OS_ARCH": "WINNT",
   'CC_TYPE': 'clang',
   'MOZ_WIDGET_TOOLKIT': '',
   'SKIA_INCLUDES': [],
   'LIBFUZZER_FLAGS': [],
   'FUZZING': False,
   'ENABLE_CLANG_PLUGIN': False,
   'JS_STANDALONE': False,
   'MOZ_BUILD_APP': 'browser',
   'COMPILE_ENVIRONMENT': True,
   'JS_HAS_INTL_API': True,
   'BUILD_CTYPES': True,
   'MOZ_OVERRIDE_GKRUST': False,
   'ENABLE_TESTS': True,
   'MOZ_SANDBOX': True,
   'MOZ_USING_WASM_SANDBOXING': True,
   'MOZ_UPDATER': False,
   'MOZ_AUTH_EXTENSION': False,
   'MOZ_WEBRTC': True,
   'MOZ_UNIVERSALCHARDET': False,
   'ACCESSIBILITY': False,
   'MOZ_JPROF': False,
   'MOZ_PREF_EXTENSIONS': False,
   'ENABLE_WEBDRIVER': False,
   'MOZ_GECKODRIVER': False,
   'MOZ_WMF_CDM': False,
   'MOZ_MEMORY': False,
   'MOZ_BRANDING_DIRECTORY': False,
   'MOZ_OVERRIDE_CARGO_CONFIG': False,
   'ENABLE_WEBDRIVER': False,
   'INTEL_ARCHITECTURE': True,
   'SSE2_FLAGS': [],
   'SSSE3_FLAGS': [],
   'TARGET_CPU': 'x86_64',
   'BUILD_ARM_NEON': False,
}

def new_mozbuild_globals(p: Path):
   mbg = {
      'Files': MozBuild_Files,
      'CONFIG': dict(CONFIG),
      'MOCHITEST_MANIFESTS': [],
      'MOCHITEST_CHROME_MANIFESTS': [],
      'EXPORTS': ListTreeNode('EXPORTS'),
      'UNIFIED_SOURCES': ListTreeNode('UNIFIED_SOURCES'),
      'SOURCES': ListTreeNode('SOURCES'),
      'LOCAL_INCLUDES': [],
      'IPDL_SOURCES': [],
      'TEST_DIRS': [],
      'OS_LIBS': [],
      'DEFINES': {},
      'USE_LIBS': [],
      'CXXFLAGS': [],
      'DIRS': [],
      'SCHEDULES': ListTreeNode('SCHEDULES'),
      'CONFIGURE_SUBST_FILES': ListTreeNode('CONFIGURE_SUBST_FILES'),
      'CONFIGURE_DEFINE_FILES': ListTreeNode('CONFIGURE_DEFINE_FILES'),
      'GENERATED_FILES': ListTreeNode('GENERATED_FILES'),
      'PYTHON_UNITTEST_MANIFESTS': ListTreeNode('PYTHON_UNITTEST_MANIFESTS'),
      'OBJDIR_PP_FILES': ListTreeNode('OBJDIR_PP_FILES'),
      'SPHINX_TREES': ListTreeNode('SPHINX_TREES'),
      'TOPSRCDIR': str(SRCDIR),
      '<cwd>': p.parent,
      '__builtins__': {},
   }

   def mozbuild_include(pathname: str):
      print(f'+mozbuild_include({pathname})')
      if pathname.startswith('/'):
         pinc = SRCDIR / pathname[1:]
      else:
         pinc = mbg['<cwd>'] / pathname

      cwd_was = mbg['<cwd>']
      mbg['<cwd>'] = pinc.parent
      exec(pinc.read_text(), mbg)
      mbg['<cwd>'] = cwd_was
      print(f'-mozbuild_include({pathname})')

   mbg['include'] = mozbuild_include
   return mbg


class GlobalState():
   def __init__(self):
      self.repr_level = 0

G = GlobalState()

class ListTreeNode:
   name: str
   children: dict[str,'ListTreeNode']
   contents: dict[str,'ListTreeNode']

   def __init__(self, name):
      self.name = name
      self.children = {}
      self.contents = {}

   def __getattr__(self, k):
      print(f'__getattr__({k})')
      if k not in self.children:
         self.children[k] = ListTreeNode(k)
      return self.children[k]

   def __getitem__(self, k):
      print(f'__getitem__({k})')
      if k not in self.contents:
         self.contents[k] = ListTreeNode(k)
      return self.contents[k]

   def __setitem__(self, k, v):
      print(f'__setitem__({k}, {v})')
      self.contents[k] = v

   def __iadd__(self, names: list[str]):
      for x in names:
         self.contents[x] = ListTreeNode(x)
      return self

   def __repr__(self):
      INDENT = '   '
      NL = f'\n{INDENT*G.repr_level}'
      ret = ''
      #ret = '\n'
      ret += NL + self.name
      if self.contents or self.children:
         ret += ': '
      G.repr_level += 1
      if self.contents:
         ret += '[' + repr(list(self.contents.values()))[1:-1] + NL + ']'
      if self.children:
         ret += '{' + repr(list(self.children.values()))[1:-1] + NL + '}'
      G.repr_level -= 1
      return ret


def read_mozbuild(path: Path):
   mbg = new_mozbuild_globals(path)
   #print(repr(mbg))
   res = exec(path.read_text(), mbg)
   #print(repr(mbg))
   del mbg['Files']
   del mbg['CONFIG']
   try:
      del mbg['BUG_COMPONENT']
   except KeyError:
      pass
   del mbg['<cwd>']
   del mbg['include']
   del mbg['__builtins__']
   print(repr(mbg))
   return mbg

import re

RE_INCLUDE = re.compile(' *# *include +([<"])(.+?)[>"]')

INCLUDE_NODE_BY_PATH = {}

class IncludeNode:
   def __init__(self, path: Path):
      self.path = path
      self.included_by = set()
      self.includes = set()

def include_node_by_path(p: Path):
   k = str(p)
   if k not in INCLUDE_NODE_BY_PATH:
      INCLUDE_NODE_BY_PATH[k] = IncludeNode(p)
   return INCLUDE_NODE_BY_PATH[k]

def parse_includes(cpp: Path):
   node = include_node_by_path(cpp)
   print(f'parse_includes({cpp}):')
   for line in cpp.read_text().split('\n'):
      m = RE_INCLUDE.match(line)
      if not m:
         continue
      path_text = m[2]
      print(' '*3 + path_text)

if __name__ == '__main__':
   (_, mozbuild_spath) = sys.argv
   p = Path(mozbuild_spath)
   mb = read_mozbuild(p)
   cpps = [cpp for cpp in mb['SOURCES'].contents]
   cpps += [cpp for cpp in mb['UNIFIED_SOURCES'].contents]
   for cpp in cpps:
      cppp = p.parent / cpp
      parse_includes(cppp)
