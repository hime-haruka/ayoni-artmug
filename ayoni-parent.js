(function () {
  'use strict';

  var IFRAME_ORIGIN = 'https://hime-haruka.github.io';
  var IFRAME_PATH = 'hime-haruka.github.io/ayoni-artmug';
  var CHILD_SOURCE = 'syura-css';
  var PARENT_SOURCE = 'syura-artmug-parent';
  var STYLE_ID = 'ayoni-artmug-parent-style-v5';
  var NAV_ID = 'ayoni-artmug-parent-nav-v5';
  var MODAL_ID = 'ayoni-artmug-parent-modal-v5';
  var lastHeight = 0;
  var navTimer = 0;

  var MENU = [
    { id: 'notice', label: 'NOTICE' },
    { id: 'form', label: 'FORM' },
    { id: 'showcase', label: 'SHOWCASE' }
  ];

  function getIframe() {
    return document.querySelector(
      'section[name="am-root"] iframe[src*="' + IFRAME_PATH + '"], ' +
      '[name="am-root"] iframe[src*="' + IFRAME_PATH + '"], ' +
      'iframe[src*="' + IFRAME_PATH + '"], ' +
      '#detailViews [name="am-root"] iframe, ' +
      '[name="am-root"] iframe'
    );
  }

  function injectStyle() {
    if (document.getElementById(STYLE_ID)) return;

    var style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
html,body{overflow-x:hidden!important}
#detailViews [name="am-root"],[name="am-root"]{text-align:start!important;padding:0!important;margin:0!important;line-height:normal!important;overflow:visible!important}
#detailViews [name="am-root"] *,[name="am-root"] *{box-sizing:border-box}
#detailViews [name="stage"],[name="stage"]{width:100%!important;overflow:visible!important}
#detailViews [name="am-root"] iframe,[name="am-root"] iframe{display:block!important;width:100%!important;max-width:1180px!important;min-height:760px;height:760px;margin:0 auto!important;border:0!important;overflow:hidden!important}
.btn_open_btn,.btn_open,.btn_close{display:none!important;visibility:hidden!important;pointer-events:none!important}

#${NAV_ID}{position:fixed!important;top:0!important;z-index:2147483000!important;display:none;box-sizing:border-box!important;background:rgba(247,249,252,.88)!important;backdrop-filter:blur(10px)!important;-webkit-backdrop-filter:blur(10px)!important;border-bottom:1px solid rgba(217,224,236,.88)!important;box-shadow:0 10px 28px rgba(31,47,85,.10)!important}
#${NAV_ID}.is-show{display:block!important}
#${NAV_ID} .ayoniParentNavV5__inner{max-width:1180px!important;margin:0 auto!important;padding:14px 24px!important;box-sizing:border-box!important}
#${NAV_ID} .ayoniParentNavV5__links{display:flex!important;justify-content:center!important;align-items:center!important;gap:8px!important;overflow-x:auto!important;scrollbar-width:none!important}
#${NAV_ID} .ayoniParentNavV5__links::-webkit-scrollbar{display:none!important}
#${NAV_ID} button{appearance:none!important;display:inline-flex!important;align-items:center!important;padding:9px 12px!important;border-radius:999px!important;font-family:Pretendard,"Apple SD Gothic Neo","Noto Sans KR",sans-serif!important;font-size:13px!important;letter-spacing:-.02em!important;color:#667085!important;border:1px solid transparent!important;background:transparent!important;cursor:pointer!important;transition:background .18s ease,border-color .18s ease,color .18s ease,transform .18s ease!important}
#${NAV_ID} button:hover{background:#eef2f7!important;border-color:#d9e0ec!important;color:#1f2937!important}

html.ayoniModalOpenV5,body.ayoniModalOpenV5{overflow:hidden!important}
#${MODAL_ID}{position:fixed!important;inset:0!important;z-index:2147483647!important;display:flex!important;align-items:center!important;justify-content:center!important;padding:22px!important;font-family:Pretendard,"Apple SD Gothic Neo","Noto Sans KR",sans-serif!important}
#${MODAL_ID} .ayoniParentModalV5__backdrop{position:absolute!important;inset:0!important;background:rgba(7,13,29,.72)!important;backdrop-filter:blur(9px)!important;-webkit-backdrop-filter:blur(9px)!important}
#${MODAL_ID} .ayoniParentModalV5__panel{position:relative!important;z-index:1!important;width:min(1120px,calc(100vw - 44px))!important;max-height:calc(100vh - 44px)!important;border-radius:22px!important;background:#fff!important;box-shadow:0 28px 100px rgba(4,10,25,.46)!important;overflow:hidden!important}
#${MODAL_ID} .ayoniParentModalV5__close{position:absolute!important;top:12px!important;right:12px!important;z-index:5!important;width:44px!important;height:44px!important;border:1px solid rgba(22,35,67,.16)!important;border-radius:999px!important;background:rgba(255,255,255,.96)!important;color:#162343!important;font-size:25px!important;font-weight:700!important;cursor:pointer!important;box-shadow:0 8px 24px rgba(15,23,42,.18)!important}
#${MODAL_ID} .ayoniParentModalV5__body{width:100%!important;max-height:calc(100vh - 44px)!important;overflow:auto!important;background:#f6f8fc!important}
#${MODAL_ID} .ayoniParentModalV5__imageWrap{display:flex!important;align-items:center!important;justify-content:center!important;min-height:220px!important;background:#f6f8fc!important}
#${MODAL_ID} .ayoniParentModalV5__image{display:block!important;width:auto!important;height:auto!important;max-width:100%!important;max-height:calc(100vh - 130px)!important;object-fit:contain!important}
#${MODAL_ID} .ayoniParentModalV5__video{position:relative!important;width:100%!important;aspect-ratio:16/9!important;background:#000!important}
#${MODAL_ID} .ayoniParentModalV5__video iframe{display:block!important;width:100%!important;height:100%!important;border:0!important}
#${MODAL_ID} .ayoniParentModalV5__caption{padding:15px 20px 18px!important;background:#fff!important}
#${MODAL_ID} .ayoniParentModalV5__title{font-size:16px!important;font-weight:800!important;color:#0f172a!important;line-height:1.4!important}
#${MODAL_ID} .ayoniParentModalV5__desc{margin-top:6px!important;font-size:13px!important;color:#64748b!important;line-height:1.55!important;white-space:pre-line!important}
@media(max-width:700px){#${MODAL_ID}{padding:10px!important}#${MODAL_ID} .ayoniParentModalV5__panel{width:calc(100vw - 20px)!important;max-height:calc(100vh - 20px)!important}#${MODAL_ID} .ayoniParentModalV5__body{max-height:calc(100vh - 20px)!important}}
`;
    document.head.appendChild(style);
  }

  function unlockDetail() {
    var box = document.querySelector('.detailinfo');
    if (!box) return;

    box.classList.remove('showstep1');
    box.style.maxHeight = 'none';
    box.style.height = 'auto';
    box.style.overflow = 'visible';

    var content = box.querySelector('.showcontent');
    if (content) {
      content.style.maxHeight = 'none';
      content.style.height = 'auto';
      content.style.overflow = 'visible';
    }
  }

  function removeMoreButtons(root) {
    (root || document)
      .querySelectorAll('.btn_open_btn,.btn_open,.btn_close')
      .forEach(function (el) { el.remove(); });
  }

  function hardBlockMoreButtons() {
    if (window.__ayoniParentV5BlockMore) return;
    window.__ayoniParentV5BlockMore = true;

    document.addEventListener('click', function (event) {
      var target = event.target && event.target.closest
        ? event.target.closest('.btn_open_btn,.btn_open,.btn_close')
        : null;

      if (!target) return;

      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
    }, true);
  }

  function prepareIframe() {
    var iframe = getIframe();
    if (!iframe) return;

    iframe.style.width = '100%';
    iframe.style.display = 'block';
    iframe.style.border = '0';
    iframe.style.overflow = 'hidden';
    iframe.setAttribute('scrolling', 'no');

    if (!iframe.dataset.ayoniParentV5Bound) {
      iframe.dataset.ayoniParentV5Bound = '1';
      iframe.addEventListener('load', function () {
        setTimeout(updateFixedNav, 60);
        setTimeout(updateFixedNav, 250);
        setTimeout(updateFixedNav, 800);
      });
    }
  }

  function resizeIframe(height) {
    var iframe = getIframe();
    if (!iframe) return;

    var nextHeight = Math.max(760, Math.ceil(Number(height) || 0));
    if (!nextHeight) return;

    if (Math.abs(nextHeight - lastHeight) < 3) {
      scheduleNavUpdate();
      return;
    }

    lastHeight = nextHeight;
    iframe.style.height = nextHeight + 'px';
    iframe.style.minHeight = nextHeight + 'px';
    iframe.style.maxHeight = 'none';
    iframe.style.overflow = 'hidden';
    iframe.height = String(nextHeight);
    iframe.setAttribute('height', String(nextHeight));
    iframe.setAttribute('scrolling', 'no');

    scheduleNavUpdate();
  }

  function sendNavToChild(targetId) {
    var iframe = getIframe();
    if (!iframe || !iframe.contentWindow) return;

    iframe.contentWindow.postMessage({
      source: PARENT_SOURCE,
      type: 'AYONI_PARENT_NAV_TO',
      targetId: targetId
    }, IFRAME_ORIGIN);
  }

  function ensureFixedNav() {
    var nav = document.getElementById(NAV_ID);
    if (nav) return nav;

    nav = document.createElement('div');
    nav.id = NAV_ID;

    var inner = document.createElement('div');
    inner.className = 'ayoniParentNavV5__inner';

    var links = document.createElement('div');
    links.className = 'ayoniParentNavV5__links';

    MENU.forEach(function (item) {
      var button = document.createElement('button');
      button.type = 'button';
      button.textContent = item.label;
      button.addEventListener('click', function () {
        sendNavToChild(item.id);
      });
      links.appendChild(button);
    });

    inner.appendChild(links);
    nav.appendChild(inner);
    document.body.appendChild(nav);

    return nav;
  }

  function updateFixedNav() {
    var iframe = getIframe();
    var nav = ensureFixedNav();

    if (!iframe || !nav) {
      if (nav) nav.classList.remove('is-show');
      return;
    }

    var rect = iframe.getBoundingClientRect();
    var visible = rect.top < 0 && rect.bottom > 70;

    nav.style.left = Math.max(0, rect.left) + 'px';
    nav.style.width = Math.max(0, Math.min(rect.width, window.innerWidth - Math.max(0, rect.left))) + 'px';

    nav.classList.toggle('is-show', visible);
  }

  function scheduleNavUpdate() {
    clearTimeout(navTimer);
    navTimer = setTimeout(updateFixedNav, 16);
  }

  function scrollParentTo(targetY, navHeight) {
    var iframe = getIframe();
    if (!iframe) return;

    var rect = iframe.getBoundingClientRect();
    var iframePageTop =
      (window.scrollY || window.pageYOffset || 0) +
      rect.top;

    var y = Math.max(
      0,
      iframePageTop +
      Number(targetY || 0) -
      Number(navHeight || 0) -
      8
    );

    window.scrollTo({
      top: y,
      behavior: 'smooth'
    });

    setTimeout(updateFixedNav, 80);
    setTimeout(updateFixedNav, 350);
  }

  function escapeHTML(value) {
    return String(value || '').replace(/[&<>"']/g, function (s) {
      return ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      })[s];
    });
  }

  function closeModal() {
    var modal = document.getElementById(MODAL_ID);
    if (modal) modal.remove();

    document.documentElement.classList.remove('ayoniModalOpenV5');
    if (document.body) document.body.classList.remove('ayoniModalOpenV5');

    document.removeEventListener('keydown', modalKeydown);
  }

  function modalKeydown(event) {
    if (event.key === 'Escape') closeModal();
  }

  function createModal(content, title, desc) {
    closeModal();

    var modal = document.createElement('div');
    modal.id = MODAL_ID;
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');

    var caption = '';

    if (title || desc) {
      caption =
        '<div class="ayoniParentModalV5__caption">' +
          (title
            ? '<div class="ayoniParentModalV5__title">' + escapeHTML(title) + '</div>'
            : '') +
          (desc
            ? '<div class="ayoniParentModalV5__desc">' + escapeHTML(desc) + '</div>'
            : '') +
        '</div>';
    }

    modal.innerHTML =
      '<div class="ayoniParentModalV5__backdrop" data-ayoni-close-v5="1"></div>' +
      '<div class="ayoniParentModalV5__panel">' +
        '<button type="button" class="ayoniParentModalV5__close" data-ayoni-close-v5="1" aria-label="닫기">×</button>' +
        '<div class="ayoniParentModalV5__body">' +
          content +
          caption +
        '</div>' +
      '</div>';

    modal.addEventListener('click', function (event) {
      if (
        event.target &&
        event.target.getAttribute &&
        event.target.getAttribute('data-ayoni-close-v5') === '1'
      ) {
        closeModal();
      }
    });

    document.documentElement.classList.add('ayoniModalOpenV5');
    document.body.classList.add('ayoniModalOpenV5');
    document.body.appendChild(modal);
    document.addEventListener('keydown', modalKeydown);
  }

  function openImageModal(src, title, desc) {
    if (!src) return;

    createModal(
      '<div class="ayoniParentModalV5__imageWrap">' +
        '<img class="ayoniParentModalV5__image" src="' +
        escapeHTML(src) +
        '" alt="' +
        escapeHTML(title || '포트폴리오 이미지') +
        '">' +
      '</div>',
      title,
      desc
    );
  }

  function openYoutubeModal(id, title, desc) {
    if (!id) return;

    createModal(
      '<div class="ayoniParentModalV5__video">' +
        '<iframe src="https://www.youtube.com/embed/' +
        encodeURIComponent(id) +
        '?autoplay=1&rel=0" title="' +
        escapeHTML(title || 'YouTube video player') +
        '" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>' +
      '</div>',
      title,
      desc
    );
  }

  function bindMessages() {
    if (window.__ayoniParentV5Messages) return;
    window.__ayoniParentV5Messages = true;

    window.addEventListener('message', function (event) {
      if (event.origin !== IFRAME_ORIGIN) return;

      var iframe = getIframe();
      if (!iframe || !iframe.contentWindow) return;
      if (event.source !== iframe.contentWindow) return;

      var data = event.data || {};
      if (data.source !== CHILD_SOURCE) return;

      if (data.type === 'SYURA_IFRAME_HEIGHT') {
        resizeIframe(data.height);
      }

      if (data.type === 'SYURA_PARENT_SCROLL_TO') {
        scrollParentTo(data.targetY, data.navHeight);
      }

      if (data.type === 'SYURA_OPEN_IMAGE_MODAL') {
        openImageModal(data.src, data.title, data.desc);
      }

      if (data.type === 'SYURA_OPEN_YOUTUBE_MODAL') {
        openYoutubeModal(data.id, data.title, data.desc);
      }

      if (data.type === 'SYURA_IFRAME_READY') {
        scheduleNavUpdate();
      }
    });

    window.addEventListener('scroll', scheduleNavUpdate, { passive: true });
    window.addEventListener('resize', scheduleNavUpdate);
    window.addEventListener('orientationchange', function () {
      setTimeout(updateFixedNav, 200);
    });
  }

  function observePage() {
    if (window.__ayoniParentV5Observer) return;
    window.__ayoniParentV5Observer = true;

    var observer = new MutationObserver(function () {
      removeMoreButtons();
      unlockDetail();
      prepareIframe();
      scheduleNavUpdate();
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true
    });
  }

  function boot() {
    injectStyle();
    removeMoreButtons();
    unlockDetail();
    hardBlockMoreButtons();
    prepareIframe();
    ensureFixedNav();
    bindMessages();
    observePage();
    scheduleNavUpdate();
  }

  if (document.readyState !== 'loading') {
    boot();
  } else {
    document.addEventListener('DOMContentLoaded', boot);
  }

  setTimeout(boot, 300);
  setTimeout(boot, 1000);
  setTimeout(boot, 2000);
})();
