// Подписи карточек в одну строку: если раскрытое название не помещается
// в ширину карточки, оно медленно прокручивается туда и обратно, пока
// курсор остаётся на карточке
(function () {
  var SPEED = 30;   // пикселей в секунду
  var PAUSE = 1000; // пауза на краях, мс
  var START = 600;  // пауза перед стартом, чтобы название успело раскрыться

  document.querySelectorAll('.project').forEach(function (card) {
    var caption = card.querySelector('.project__caption');
    if (!caption) return;
    var frame = null;

    function stop() {
      if (frame) cancelAnimationFrame(frame);
      frame = null;
      caption.scrollLeft = 0;
    }

    card.addEventListener('mouseenter', function () {
      stop();
      var direction = 1;
      var position = 0;
      var last = null;
      var waitUntil = performance.now() + START;

      function step(now) {
        var max = caption.scrollWidth - caption.clientWidth;
        if (last !== null && now >= waitUntil && max > 0) {
          position += direction * SPEED * (now - last) / 1000;
          if (position >= max) {
            position = max; direction = -1; waitUntil = now + PAUSE;
          } else if (position <= 0) {
            position = 0; direction = 1; waitUntil = now + PAUSE;
          }
          caption.scrollLeft = position;
        }
        last = now;
        frame = requestAnimationFrame(step);
      }
      frame = requestAnimationFrame(step);
    });

    card.addEventListener('mouseleave', stop);
  });
})();
