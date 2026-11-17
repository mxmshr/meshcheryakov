// Каждый макет проявляется после загрузки и декодирования. Карточки на
// главной появляются отдельно (data-ignore-media у .emerge).
(function () {
  function mark(el) { el.classList.add('is-loaded'); }

  var images = document.querySelectorAll(
    '.project a:not(.project__caption) img, .inner :is(.inner__img, .grid-item, .inner__tile) img'
  );
  images.forEach(function (img) {
    function reveal() {
      if (!img.naturalWidth) {
        img.classList.add('is-load-error');
      } else if (img.decode) {
        img.decode().catch(function () {}).then(function () { mark(img); });
      } else {
        mark(img);
      }
    }

    if (img.complete) {
      reveal();
      return;
    }
    img.addEventListener('load', reveal, { once: true });
    img.addEventListener('error', reveal, { once: true });
  });

  // Видео грузится, только когда карточка подлетает к экрану (preload="none",
  // запуск в js/lazy-video.js). Под роликом лежит обложка-картинка,
  // а сам ролик проявляется поверх неё, когда начинает играть
  document.querySelectorAll('.project a:not(.project__caption) video').forEach(function (video) {
    if (!video.paused && video.readyState >= 3) { mark(video); return; }
    video.addEventListener('playing', function () { mark(video); }, { once: true });
  });
})();
