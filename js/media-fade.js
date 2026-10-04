// Карточки на главной появляются сразу, не дожидаясь картинок (data-ignore-media
// у .emerge), а макеты внутри проявляются по мере загрузки: скрипт ставит им
// класс is-loaded, CSS плавно поднимает opacity. Для видео ждём обложку
(function () {
  function mark(el) { el.classList.add('is-loaded'); }

  document.querySelectorAll('.project a:not(.project__caption) img').forEach(function (img) {
    if (img.complete && img.naturalWidth) { mark(img); return; }
    img.addEventListener('load', function () { mark(img); }, { once: true });
  });

  document.querySelectorAll('.project a:not(.project__caption) video').forEach(function (video) {
    var poster = video.getAttribute('poster');
    if (!poster) { mark(video); return; }
    var probe = new Image();
    probe.onload = probe.onerror = function () { mark(video); };
    probe.src = poster;
    if (probe.complete) mark(video);
  });
})();
