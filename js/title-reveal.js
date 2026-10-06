// Появление вводного абзаца на главной, как на noth.in:
// каждая буква лежит в своей маске, и все они одновременно выезжают снизу
// вверх за 0,5 с. Анимация запускается сразу при входе на страницу. Класс
// title-reveal на <html> ставит инлайн-скрипт в <head>, чтобы текст не мигал
// до разбивки
(function () {
  var root = document.documentElement;
  var targets = document.querySelectorAll('.feature > span');
  if (!targets.length || !root.classList.contains('title-reveal')) return;

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) { root.classList.remove('title-reveal'); return; }

  // Обёртки — собственные элементы, а не span, чтобы на них не действовали
  // общие правила для span
  function reveal(el) {
    var masks = [];

    function mask(content) {
      var m = document.createElement('title-mask');
      m.className = 'title-mask';
      var inner = document.createElement('title-mask-inner');
      inner.className = 'title-mask__inner';
      inner.appendChild(content);
      m.appendChild(inner);
      masks.push(m);
      return m;
    }

    // Текст режем на слова по обычным пробелам (неразрывные остаются внутри
    // слова), слово — неразрывный блок из масок букв. Вложенные элементы
    // едут целиком, как ещё одна буква
    Array.prototype.slice.call(el.childNodes).forEach(function (node) {
      if (node.nodeType === 3) {
        var frag = document.createDocumentFragment();
        node.textContent.split(/( +)/).forEach(function (part) {
          if (!part) return;
          if (/^ +$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
          var word = document.createElement('title-word');
          word.className = 'title-word';
          Array.from(part).forEach(function (ch) {
            word.appendChild(mask(document.createTextNode(ch)));
          });
          frag.appendChild(word);
        });
        el.replaceChild(frag, node);
      } else if (node.nodeType === 1) {
        var placeholder = document.createComment('');
        el.replaceChild(placeholder, node);
        var m = mask(node);
        m.classList.add('title-mask--element');
        el.replaceChild(m, placeholder);
      }
    });

    el.classList.add('is-split');

    // Двойной кадр, чтобы браузер успел отрисовать стартовое положение букв
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        el.classList.add('is-revealed');
      });
    });

    // После анимации снимаем маски, чтобы они ничего не обрезали
    masks[masks.length - 1].firstChild.addEventListener('transitionend', function () {
      el.classList.add('is-done');
    }, { once: true });
  }

  Array.prototype.forEach.call(targets, reveal);
})();
