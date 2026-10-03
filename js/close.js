// Крестик на странице проекта ведёт назад по истории, если пришли
// с этого же сайта: браузер вернёт прежнюю позицию скролла, как кнопка
// «Назад». Если страницу открыли по прямой ссылке — уходим на главную.
(function () {
  document.addEventListener('click', function (e) {
    var close = e.target.closest('.inner__close');
    if (!close) return;
    var ref = document.referrer;
    var fromSite = false;
    try { fromSite = !!ref && new URL(ref).origin === location.origin; } catch (err) {}
    if (fromSite && history.length > 1) {
      e.preventDefault();
      history.back();
    }
  });
})();
