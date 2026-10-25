// Крестик на странице проекта всегда возвращает на главную: поверх неё
// открыт только один проект, даже если между проектами переходили
// по ссылкам в футере. Каждая страница помнит, на сколько шагов истории
// она дальше главной (в history.state, поэтому значение переживает
// «Назад», «Вперёд» и перезагрузку), и крестик отматывает историю сразу
// на главную — браузер вернёт прежнюю позицию скролла, как кнопка «Назад».
// Если страницу открыли по прямой ссылке, крестик просто ведёт на главную.
(function () {
  var KEY = 'projectDepth';

  function isHome(url) {
    return /\/(index\.html)?$/.test(url.pathname);
  }

  function sameSite(ref) {
    try {
      var url = new URL(ref);
      return url.origin === location.origin ? url : null;
    } catch (err) {
      return null;
    }
  }

  var state = history.state || {};
  var depth = state[KEY];

  if (typeof depth !== 'number') {
    var ref = sameSite(document.referrer);
    var previous = Number(sessionStorage.getItem(KEY)) || 0;
    if (!ref) depth = 0;
    else if (isHome(ref)) depth = 1;
    else depth = previous > 0 ? previous + 1 : 0;

    var next = {};
    for (var k in state) next[k] = state[k];
    next[KEY] = depth;
    try { history.replaceState(next, ''); } catch (err) {}
  }

  // Глубина текущей страницы нужна следующей: по ней она считает свою
  window.addEventListener('pageshow', function () {
    var current = (history.state || {})[KEY];
    try { sessionStorage.setItem(KEY, String(current || 0)); } catch (err) {}
  });

  document.addEventListener('click', function (e) {
    var close = e.target.closest('.inner__close');
    if (!close) return;
    var current = (history.state || {})[KEY];
    if (current > 0 && history.length > current) {
      e.preventDefault();
      history.go(-current);
    }
  });
})();
