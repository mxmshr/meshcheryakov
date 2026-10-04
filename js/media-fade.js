// Карточки на главной появляются сразу, не дожидаясь картинок (data-ignore-media
// у .emerge), а макеты внутри проявляются по мере загрузки: скрипт ставит им
// класс is-loaded, CSS плавно поднимает opacity
(function () {
  function mark(el) { el.classList.add('is-loaded'); }

  document.querySelectorAll('.project a:not(.project__caption) img').forEach(function (img) {
    if (img.complete && img.naturalWidth) { mark(img); return; }
    img.addEventListener('load', function () { mark(img); }, { once: true });
  });

  // Видео грузится, только когда карточка подлетает к экрану (preload="none",
  // запуск в скрипте внизу index.html). Под роликом лежит обложка-картинка,
  // а сам ролик проявляется поверх неё, когда начинает играть
  document.querySelectorAll('.project a:not(.project__caption) video').forEach(function (video) {
    if (!video.paused && video.readyState >= 3) { mark(video); return; }
    video.addEventListener('playing', function () { mark(video); }, { once: true });
  });
})();
