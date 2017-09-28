import os
import re
import string

assert __name__ == '__main__'

class Node(object):
    kTagNameRE = re.compile('<([^ >]+)')

    def __init__(self, before, close_tags=True):
        self.before = before

        self.after = ''
        if close_tags:
            match = self.kTagNameRE.match(before)
            if match:
                self.after = '</{}>'.format(match.group(1))

        self.sub = []
        return

    def add_node(self, child):
        self.sub.append(child)
        return child

    def add(self, before, close_tags=True):
        return self.add_node(Node(before, close_tags))

    def to_lines(self, indent=0):
        sub_indent = indent
        if self.before:
            sub_indent += 1

        sub_lines = []
        for x in self.sub:
            sub_lines += x.to_lines(sub_indent)

        if not self.before:
            return sub_lines

        ret = [' '*4*indent + self.before]
        if len(sub_lines) <= 1:
            if sub_lines:
                ret[0] += sub_lines[0].lstrip()
            ret[0] += self.after
        else:
            ret += sub_lines
            if self.after:
                ret.append(' '*4*indent + self.after)

        return ret


body = Node('')
src_url = 'https://github.com/jdashg/misc/blob/master/gen-index.py'
body.add("<h1><a href='{}'>Gen-Index:</a>".format(src_url))
dir_list = body.add('<ul>')

for (cur, dirs, files) in os.walk('./'):
    dirs = filter(lambda x: x[0] != '.', dirs)
    files = filter(lambda x: x[0] != '.', files)

    htmls = filter(lambda x: x.endswith('.html'), files)
    htmls = list(htmls)
    if not htmls:
        continue

    clean_path = cur[len('./'):].replace(os.sep, '/')

    dir_item = dir_list.add('<li><h3>{}/</h3>'.format(clean_path), False)
    file_list = dir_item.add('<ul>')
    for x in htmls:
        file_item = file_list.add('<li>', False)
        url = x
        if clean_path:
            url = clean_path + '/' + url
        print(url)
        file_item.add("<a href='{}'>{}".format(url, x))

index_template = string.Template('''<!DOCTYPE html>
<html>
    <head>
        <meta charset='utf-8'>
        <title>Gen-Index</title>
    </head>
    <body>
        <style>
body {
    font-family: sans-serif;
}
ul {
    margin-top: 4px;
}
        </style>
$body
    </body>
</html>
''')

body_text = '\n'.join(body.to_lines(2))
text = index_template.substitute(body=body_text)

with open('index.html', 'wb') as f:
    f.write(text.encode('utf-8'))
