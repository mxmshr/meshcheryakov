// Грузим и проигрываем видео только когда оно подлетает к экрану, и ставим
// на паузу, когда уходит. Касается роликов с preload="none" без autoplay:
// на главной это карточки (под ними лежит обложка-картинка с отложенной
// загрузкой, poster не используем, потому что у poster нет отложенной
// загрузки), на страницах проектов — все ролики, кроме первого на странице
(function () {
  var videos = document.querySelectorAll('video[preload="none"]');
  if (!videos.length) return;
  if (!('IntersectionObserver' in window)) {
    videos.forEach(function (v) { v.setAttribute('preload', 'auto'); v.play().catch(function () {}); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      var v = entry.target;
      if (entry.isIntersecting) {
        v.play().catch(function () {});
      } else {
        v.pause();
      }
    });
  }, { rootMargin: '300px 0px' });
  videos.forEach(function (v) { io.observe(v); });
})();
