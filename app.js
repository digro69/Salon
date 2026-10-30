(function () {
  'use strict';
  var DATA = window.EXPOSANTS || [];
  var $ = function (id) { return document.getElementById(id); };
  var norm = function (s) { return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase(); };
  var esc = function (s) { return s.replace(/[&<>"']/g, function (c) { return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); };

  // favoris (localStorage peut être indisponible : on dégrade sans erreur)
  var KEY = 'svi-lyon-2026-favoris';
  var favs = new Set();
  try { favs = new Set(JSON.parse(localStorage.getItem(KEY) || '[]')); } catch (e) {}
  function saveFavs() { try { localStorage.setItem(KEY, JSON.stringify([...favs])); } catch (e) {} }

  DATA.forEach(function (d, i) {
    d.id = d.r + '|' + d.n;
    d.pos = i;
    d.t = norm([d.r, d.n, d.c, d.a.join(' '), d.s].join(' '));
    // « \ » en tête = « J'ai de la chance » de DuckDuckGo (1er résultat)
    d.url = 'https://duckduckgo.com/?q=' + encodeURIComponent('\\' + d.n + ' ' + d.r + ' vin');
  });

  var regions = [];
  DATA.forEach(function (d) { if (regions.indexOf(d.r) < 0) regions.push(d.r); });
  $('reg').innerHTML = '<option value="">Toutes les régions</option>' +
    regions.map(function (r) { return '<option>' + esc(r) + '</option>'; }).join('');

  function standKey(s) {
    var m = /^([A-Za-z]+)\s*(\d+)/.exec(s);
    return m ? [m[1].toUpperCase(), +m[2]] : [s, 0];
  }
  var sorters = {
    reg: function (a, b) { return a.pos - b.pos; },
    nom: function (a, b) { return a.n.localeCompare(b.n, 'fr', { numeric: true }); },
    stand: function (a, b) {
      var x = standKey(a.s), y = standKey(b.s);
      return x[0] < y[0] ? -1 : x[0] > y[0] ? 1 : x[1] - y[1];
    }
  };

  function card(d) {
    var fav = favs.has(d.id);
    return '<article class="card">' +
      '<h2>' + esc(d.n) + '</h2><span class="stand">' + esc(d.s) + '</span>' +
      '<div class="region">' + esc(d.r) + '</div>' +
      (d.c ? '<div class="contact">' + esc(d.c) + '</div>' : '') +
      '<div class="app">' + esc(d.a.join(' · ')) + '</div>' +
      '<div class="foot">' +
        '<button class="star" data-id="' + esc(d.id) + '" aria-pressed="' + fav + '" aria-label="Favori">' + (fav ? '★' : '☆') + '</button>' +
        (d.b ? '<span class="badge bio">Bio</span>' : '') +
        (d.h ? '<span class="badge hve">HVE</span>' : '') +
        (d.f ? '<span class="badge new">1er salon</span>' : '') +
        '<a href="' + d.url + '" target="_blank" rel="noopener">Site Internet ↗</a>' +
      '</div></article>';
  }

  function render() {
    var q = norm($('q').value.trim()), reg = $('reg').value,
        bio = $('bio').checked, hve = $('hve').checked, nw = $('new').checked, fv = $('fav').checked;
    var terms = q ? q.split(/\s+/) : [];
    var out = DATA.filter(function (d) {
      return (!reg || d.r === reg) && (!bio || d.b) && (!hve || d.h) && (!nw || d.f) &&
        (!fv || favs.has(d.id)) && terms.every(function (t) { return d.t.indexOf(t) >= 0; });
    }).sort(sorters[$('sort').value]);
    $('list').innerHTML = out.length ? out.map(card).join('') :
      '<p class="empty">' + (fv && !favs.size ? 'Aucun favori — touchez ☆ sur un exposant.' : 'Aucun exposant ne correspond.') + '</p>';
    $('count').textContent = out.length + ' exposant' + (out.length > 1 ? 's' : '') + ' sur ' + DATA.length;
  }

  ['q', 'reg', 'sort', 'bio', 'hve', 'new', 'fav'].forEach(function (id) {
    $(id).addEventListener('input', render);
  });

  $('list').addEventListener('click', function (e) {
    var b = e.target.closest('.star');
    if (!b) return;
    var id = b.dataset.id;
    if (favs.has(id)) favs.delete(id); else favs.add(id);
    saveFavs();
    if ($('fav').checked) { render(); return; } // retire la carte de la vue Favoris
    var on = favs.has(id);
    b.setAttribute('aria-pressed', on);
    b.textContent = on ? '★' : '☆';
  });

  render();

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('sw.js').catch(function () {});
    });
  }
})();
