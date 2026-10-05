// Появление заголовка проекта, как на noth.in: каждая буква лежит в своей
// маске и выезжает снизу вверх за 0,5 с, следующая стартует на 0,015 с позже.
// Анимация запускается сразу при входе на страницу. Класс title-reveal
// на <html> ставит инлайн-скрипт в <head>, чтобы заголовок не мигал до разбивки
(function () {
  var root = document.documentElement;
  var title = document.querySelector('.inner__header h1');
  if (!title || !root.classList.contains('title-reveal')) return;

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) { root.classList.remove('title-reveal'); return; }

  var STAGGER = 0.015;
  var masks = [];

  function mask(content) {
    var m = document.createElement('span');
    m.className = 'title-mask';
    var inner = document.createElement('span');
    inner.className = 'title-mask__inner';
    inner.appendChild(content);
    m.appendChild(inner);
    masks.push(m);
    return m;
  }

  // Текст режем на слова по обычным пробелам (неразрывные остаются внутри
  // слова), слово — неразрывный блок из масок букв. Элементы (значок
  // Product Hunt) едут целиком, как ещё одна буква
  Array.prototype.slice.call(title.childNodes).forEach(function (node) {
    if (node.nodeType === 3) {
      var frag = document.createDocumentFragment();
      node.textContent.split(/( +)/).forEach(function (part) {
        if (!part) return;
        if (/^ +$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
        var word = document.createElement('span');
        word.className = 'title-word';
        Array.from(part).forEach(function (ch) {
          word.appendChild(mask(document.createTextNode(ch)));
        });
        frag.appendChild(word);
      });
      title.replaceChild(frag, node);
    } else if (node.nodeType === 1) {
      var placeholder = document.createComment('');
      title.replaceChild(placeholder, node);
      title.replaceChild(mask(node), placeholder);
    }
  });

  masks.forEach(function (m, i) {
    m.firstChild.style.transitionDelay = (i * STAGGER).toFixed(3) + 's';
  });
  title.classList.add('is-split');

  // Двойной кадр, чтобы браузер успел отрисовать стартовое положение букв
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      title.classList.add('is-revealed');
    });
  });

  // После анимации снимаем маски, чтобы не обрезать подсказку значка
  masks[masks.length - 1].firstChild.addEventListener('transitionend', function () {
    title.classList.add('is-done');
  }, { once: true });
})();
