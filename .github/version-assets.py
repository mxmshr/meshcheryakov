#!/usr/bin/env python3
"""Добавляет к ссылкам на локальные стили, скрипты, картинки и видео метку
версии по содержимому файла: css/styles.css -> css/styles.css?v=1a2b3c4d.

Сервер разрешает браузеру хранить статику долго, а страницы — час. Без меток
браузер после деплоя мог взять новую страницу со старыми стилями из кэша.
С метками изменившийся файл получает новый адрес и скачивается заново,
а неизменённые остаются в кэше.

Запускается в деплое перед загрузкой на сервер и правит HTML только в копии
для деплоя, в репозитории ссылки остаются без меток.
"""
import hashlib
import pathlib
import re
import sys

ROOT = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else '.').resolve()
LOCAL = re.compile(r'^(?:\./)?((?:css|js|img|fonts)/[^?#\s"\']+)(?:\?[^#\s"\']*)?$')
ATTR = re.compile(r'\b(src|href|poster|srcset)="([^"]*)"')
_hashes = {}


def version(path):
    if path not in _hashes:
        file = ROOT / path
        _hashes[path] = hashlib.md5(file.read_bytes()).hexdigest()[:8] if file.is_file() else None
    return _hashes[path]


def bust(url):
    m = LOCAL.match(url)
    if not m:
        return url
    v = version(m.group(1))
    return f'{m.group(1)}?v={v}' if v else url


def rewrite(match):
    name, value = match.groups()
    if name == 'srcset':
        parts = []
        for item in value.split(','):
            bits = item.strip().split()
            if bits:
                bits[0] = bust(bits[0])
            parts.append(' '.join(bits))
        value = ', '.join(parts)
    else:
        value = bust(value)
    return f'{name}="{value}"'


changed = 0
for page in ROOT.glob('*.html'):
    text = page.read_text(encoding='utf-8')
    new = ATTR.sub(rewrite, text)
    if new != text:
        page.write_text(new, encoding='utf-8')
        changed += 1
print(f'versioned asset links in {changed} pages')
