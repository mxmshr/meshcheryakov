// const colc = new Colcade( '.grid', {
//   columns: '.grid-col',
//   items: '.grid-item'
// });

if (window.history.pushState);

const projects = document.querySelectorAll('.project a');
const anchorPoint = document.querySelector('.page-anchor');

const loadPage = async href => {
  const res = await fetch(href)
    .then(response => {
      return response.text()
    })
    .catch(error => {
      console.error(error)
    })
  const title = res.match("<title>(.*?)</title>")[1]
  updatePage(res, href, title)
};

// Remember old anchor point
// Update content
// Update URL
// Move to new anchor point

// Update content
//
// const title = result.match("<title>(.*?)</title>")[1]

const updatePage = (pageText, path, title) => {
  const dummy = document.createElement('html');
  dummy.innerHTML = pageText;
  document.querySelector('.app').innerHTML = dummy.querySelector('.app').innerHTML;
  window.history.pushState({ 'page_id': title }, title, path);
  window.scrollTo({ top: 0, left: 0 })
}

window.addEventListener('popstate', (event) => {
  event.preventDefault();
  window.history.go(-1);
});

projects.forEach(e => e.addEventListener('click', (event) => {
  event.preventDefault();
  loadPage(e.getAttribute('href'));
}));
