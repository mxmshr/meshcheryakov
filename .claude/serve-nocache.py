# Локальный сервер для проверки сайта с телефона: то же, что
# python3 -m http.server, но браузеру запрещено кэшировать файлы.
# Тогда после правок хватает обычного обновления страницы.
# Запуск: python3 .claude/serve-nocache.py 47833
import socket
import sys
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer


class NoCacheHandler(SimpleHTTPRequestHandler):
    def send_head(self):
        # Без условных заголовков сервер не отвечает 304 и всегда отдаёт файл
        for header in ('If-Modified-Since', 'If-None-Match'):
            if header in self.headers:
                del self.headers[header]
        return super().send_head()

    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, max-age=0')
        super().end_headers()


class DualStackServer(ThreadingHTTPServer):
    # Слушаем и IPv6, и IPv4, как python3 -m http.server: Chrome ходит
    # на localhost через ::1, и без IPv6 часть запросов ждёт по 30 секунд
    address_family = socket.AF_INET6

    def server_bind(self):
        self.socket.setsockopt(socket.IPPROTO_IPV6, socket.IPV6_V6ONLY, 0)
        super().server_bind()


port = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
DualStackServer(('::', port), NoCacheHandler).serve_forever()
