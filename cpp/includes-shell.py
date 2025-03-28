#! python3

from pathlib import *
from typing import *
import sys
import concurrent.futures
import threading
import traceback
import math
import time


WARN_ON_UNKNOWN_INCLUDE = False
WARN_ON_DUPLICATE_NAME = False

SRCDIR = Path('.')

class GlobalState():
   def __init__(self):
      self.last_print_over_len = 0
      self.timer_start = time.time()

G = GlobalState()


SOURCE_EXTS = set(['.h', '.hh', '.hpp', '.cpp', '.c', '.cc'])

IGNORED_PATH_PARTS = set([
   'ErrorList.h', 'Services.h',
   'Common.h',
   'source.cpp',
   'log.h',
   'Debug.h',
   'Utils.h',
   'Types.h',
   'Context.h',

   'third_party',
   'icu', 'icu_capi',
   'angle',
   'chromium',
   'google-breakpad',
   'google',
   'zlib', 'freetype2',
   'libvpx', 'libaom', 'libjpeg', 'libopus', 'libvorbis',
   'ffvpx',
   'libavutil', 'libavcodec',
])

# -

def secs_since(start):
   d = time.time() - start
   d = str(d)[:5] + 's'
   return d

# -

def print_exc_above():
   exc_tb = traceback.extract_tb(sys.exception().__traceback__)
   cur_tb = traceback.extract_stack()

   exc_stack_strs = traceback.format_list(exc_tb)
   cur_stack_strs = traceback.format_list(cur_tb)

   diverge_i = 0
   while exc_stack_strs[diverge_i] == cur_stack_strs[diverge_i]:
      diverge_i += 1

   diverged_n = len(exc_stack_strs) - diverge_i
   traceback.print_exc(limit=diverged_n)

# -

def reset_timer():
   G.timer_start = time.time()


import re

RE_INCLUDE = re.compile(r'\s*#\s*include\s*"((?:[^"]*/)?)([^"]*)"')
assert RE_INCLUDE.match('  # include "a.h"')
assert RE_INCLUDE.match('  # include "a/s/d/f.h"')
assert not RE_INCLUDE.match('  # include <a/s/d/f.h>')

def stdout_write(s):
   if s.startswith('\r'):
      s = f'\r[{secs_since(G.timer_start)}] {s[1:]}'
      l = len(s)-1
      assert l >= 0, s
      if l < G.last_print_over_len:
         assert G.last_print_over_len > 0, G.last_print_over_len
         s = '\r' + ' '*G.last_print_over_len + s
      G.last_print_over_len = l
   sys.stdout.write(s)
   if s.endswith('\n'):
      G.last_print_over_len = 0

NO_SOURCE_SUBDIRS = [
   'taskcluster', 'testing', 'tools',
   'node_modules',
   'servo',
   'docs',
   'gradle',
   'supply-chain',
   'remote',
   'icu',
   'third_party',
   'python',
   'other-licenses',
]
if __name__ == '__main__':
   try:
      LOAD_LIMIT = int(sys.argv[1])
   except IndexError:
      LOAD_LIMIT = 10000000000
   try:
      all_sources = []
      paths_by_source_name = {}
      globbed = 0

      next_flush = time.time()

      def all_sources_status():
         stdout_write(f'\rLocating source files: {len(all_sources)} / {globbed} ...')

      print(list(SRCDIR.iterdir()))
      #exit(1)
      for subdir in SRCDIR.iterdir():
         if not subdir.is_dir():
            continue
         if subdir.name.startswith('obj-'):
            continue
         if subdir.name.startswith('.'):
            continue
         if subdir.name in NO_SOURCE_SUBDIRS:
            continue

         had_sources = False
         for cur in subdir.glob('**/*.*'):
            globbed += 1
            parts = set(cur.parts)
            if not parts.isdisjoint(IGNORED_PATH_PARTS):
               continue
            if cur.suffix in SOURCE_EXTS:
               had_sources = True
               all_sources.append(cur)
               try:
                  paths_by_source_name[cur.name].append(cur)
                  if WARN_ON_DUPLICATE_NAME:
                     stdout_write(f'\rDuplcate name: {cur} vs {paths_by_source_name[cur.name][0]}\n')
               except KeyError:
                  paths_by_source_name[cur.name] = [cur]

            now = time.time()
            if now >= next_flush:
               all_sources_status()
               next_flush = now + 0.1
         if not had_sources:
            stdout_write(f'\rWARNING: {subdir} contained no sources!\n')


      all_sources_status()
      stdout_write(f'done!\n')

      direct_includers_by_include = {}
      direct_includes_by_includer = {}

      parsing_num = [0]

      def parsing_status():
         stdout_write(f'\rParsing {parsing_num[0]} / {len(all_sources)} ...')

      def parse_source(includer_path):
         parsing_num[0] += 1
         parsing_status()
         with includer_path.open(encoding='utf-8') as f:
            line_num = 0
            try:
               for line in f:
                  line_num += 1
                  m = RE_INCLUDE.match(line)
                  if not m:
                     continue
                  include_name = m[2]
                  include_pathstr = m[1] + '/' + include_name
                  if include_name.islower():
                     continue
                  if include_name.startswith('StaticPrefs_'):
                     continue
                  if include_name in ['ErrorList.h', 'Services.h']:
                     continue

                  try:
                     candidates = paths_by_source_name[include_name]
                     if len(candidates) != 1:
                        for candidate in candidates:
                           if str(candidate).startswith('mfbt/'):
                              break
                        else:
                           if False:
                              stdout_write(f'\r[{includer_path}:{line_num}] Ambiguous include \'{include_name}\': {candidates}: {line}')
                  except KeyError:
                     if WARN_ON_UNKNOWN_INCLUDE:
                        stdout_write(f'\r[{includer_path}:{line_num}] Unknown include \'{include_name}\': {line}')
                     continue

                  for include_path in candidates:
                     try:
                        direct_includers_by_include[include_path].append(includer_path)
                     except KeyError:
                        direct_includers_by_include[include_path] = [includer_path]

                     try:
                        direct_includes_by_includer[includer_path].append(include_path)
                     except KeyError:
                        direct_includes_by_includer[includer_path] = [include_path]
            except Exception as e:
               stdout_write(f'\r[{includer_path}:{line_num}] raised {e}|\n~')


      with concurrent.futures.ThreadPoolExecutor(max_workers=None) as pool:
         list(pool.map(parse_source, all_sources[:LOAD_LIMIT]))
         parsing_status()
         stdout_write(f'done!\n')

      # -

      print(f'Found {len(direct_includes_by_includer)} includees from {len(direct_includers_by_include)} includers.')

      # -

      def graph_walk(fn_next_nodes_by_node, begins):
         stack = []
         seen = set()

         def step(nodes):
            for cur in nodes:
               if cur in seen:
                  continue
               seen.add(cur)
               stack.append(cur)
               yield cur, stack[:]

               nexts = fn_next_nodes_by_node(cur)
               yield from step(nexts)

               cur2 = stack.pop()
               assert cur2 == cur

         yield from step(begins)



      def collect_descendents(vals_by_key, root_key):
         pending = set([root_key])
         seen = set(pending)
         leafs = set()
         while pending:
            cur = pending.pop()
            try:
               vals = vals_by_key[cur]
            except KeyError:
               leafs.add(cur)
               continue
            new_vals = set(vals) - seen
            pending |= new_vals
            seen |= new_vals

         return (seen, leafs, trace_by_leaf)

      # -

      HANDLER_BY_CMD = {}

      def cmd_dump(cmd):
         for k,v in direct_includers_by_include.items():
            print(f'{k}: {v}')

      HANDLER_BY_CMD['dump'] = cmd_dump

      # -

      def tree_stats(includee_path, print_max=-1):
         def sources_by_include(path):
            try:
               return direct_includers_by_include[path]
            except KeyError:
               return []

         n_direct = -1 # includes base node
         n_indirect = 0
         n_total = -1 # includes base node
         for (node, stack) in graph_walk(sources_by_include, [includee_path]):
            n_total += 1
            if len(stack) <= 2:
               n_direct += 1
            else:
               n_indirect += 1
            if n_total <= print_max:
               print(f'{'   '*(len(stack)-1)}{node}')
         if print_max >= 0 and n_total > print_max:
            print(f'[and {n_total-print_max} others]')

         return (n_total, n_direct, n_indirect)


      def cmd_tree(cmd, include_name, first_n=5):
         first_n = int(first_n)
         paths = paths_by_source_name[include_name]
         if len(paths) == 1:
            path = paths[0]
         else:
            print(f'Which {include_name}?')
            for i,p in enumerate(paths):
               print(f'[{i+1}]: {p}')
            i = int(input('> #')) - 1
            path = paths[i]

         (n_total, n_direct, n_indirect) = tree_stats(path, print_max=first_n)
         print(f'Total: {n_total}, Direct: {n_direct}, Indirect: {n_indirect}')

         '''
         (nodes, leafs) = collect_descendents(direct_includers_by_include, path)
         nodes -= set([path])
         leafs -= set([path])

         directs = set(direct_includers_by_include[path])
         print(f'\n{len(directs)} directs:')
         for x in sorted(list(directs), key=lambda x: (x.suffix, x)):
            print(f'   {x}')

         inner = nodes - leafs - directs
         print(f'\n{len(inner)} inner nodes:')
         for x in sorted(list(inner), key=lambda x: (x.suffix, x)):
            print(f'   {x}')
         print(f'\n{len(leafs)} leafs')
         '''

      HANDLER_BY_CMD['tree'] = cmd_tree

      # -

      def cmd_shame(cmd, top_n=1000, quick_n=math.inf):
         top_n = int(top_n)
         print(f'Shaming top n={top_n}.')

         i = 0
         def update_status():
            stdout_write(f'\rEvaluating {i} / {len(direct_includers_by_include)} ...')

         stats = []
         for includee_path in direct_includers_by_include.keys():
            i += 1
            if i > quick_n:
               break
            update_status()
            (n_total, n_direct, n_indirect) = tree_stats(includee_path)
            stats.append((includee_path, n_total, n_direct, n_indirect))
         stdout_write(f'done!\n')

         sorted_by_total = sorted(stats, key=lambda t: t[1])
         i = len(sorted_by_total)-top_n
         for (path, n_total, n_direct, n_indirect) in sorted_by_total[-top_n:]:
            i += 1
            print(f'[{i}/{len(sorted_by_total)}] {n_total} total\t{n_direct} direct\t{n_indirect} indirect\t{path}')
         return

      HANDLER_BY_CMD['shame'] = cmd_shame

      # -

      def cmd_help(cmd='help'):
         print('Commands: ' + ', '.join(HANDLER_BY_CMD.keys()))

      HANDLER_BY_CMD['help'] = cmd_help
      HANDLER_BY_CMD['?'] = cmd_help

      # -

      while True:
         try:
            line = input('> ')
            args = line.split()
            if len(args) == 0:
               cmd = 'help'
            else:
               cmd = args[0]
            if cmd not in HANDLER_BY_CMD:
               possible = [k for k in HANDLER_BY_CMD.keys() if k.startswith(cmd)]
               if len(possible) == 0:
                  print(f'Unrecognized command: {cmd}')
                  cmd = 'help'
               elif len(possible) == 1:
                  cmd = possible[0]
               else:
                  print(f'Ambiguous command "{cmd}" could be one of:', ', '.join(possible))
                  continue
            handler = HANDLER_BY_CMD[cmd]
            reset_timer()
            handler(*args)
            continue
         except Exception:
            print_exc_above()
            continue



   except KeyboardInterrupt:
      sys.exit(1)
