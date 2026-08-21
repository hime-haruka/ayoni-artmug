(function () {
  'use strict';

  var IFRAME_ORIGIN = 'https://hime-haruka.github.io';
  var IFRAME_PATH = 'hime-haruka.github.io/ayoni-artmug';
  var SOURCE = 'ayoni-artmug-parent-v3';
  var CHILD_SOURCE = 'ayoni-artmug-v3';
  var STYLE_ID = 'ayoni-artmug-parent-style-v3';
  var MODAL_ID = 'ayoni-artmug-parent-modal-v3';
  var lastHeight = 0;
  var viewportTimer = 0;

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

html.ayoniModalOpenV3,body.ayoniModalOpenV3{overflow:hidden!important}
.ayoniParentModalV3{position:fixed!important;inset:0!important;z-index:2147483647!important;display:flex!important;align-items:center!important;justify-content:center!important;padding:22px!important;font-family:Pretendard,"Apple SD Gothic Neo","Noto Sans KR",sans-serif!important}
.ayoniParentModalV3__backdrop{position:absolute!important;inset:0!important;background:rgba(7,13,29,.72)!important;backdrop-filter:blur(9px)!important;-webkit-backdrop-filter:blur(9px)!important}
.ayoniParentModalV3__panel{position:relative!important;z-index:1!important;width:min(1120px,calc(100vw - 44px))!important;max-height:calc(100vh - 44px)!important;border-radius:22px!important;background:#fff!important;box-shadow:0 28px 100px rgba(4,10,25,.46)!important;overflow:hidden!important}
.ayoniParentModalV3__close{position:absolute!important;top:12px!important;right:12px!important;z-index:5!important;width:44px!important;height:44px!important;border:1px solid rgba(22,35,67,.16)!important;border-radius:999px!important;background:rgba(255,255,255,.96)!important;color:#162343!important;font-size:25px!important;font-weight:700!important;cursor:pointer!important;box-shadow:0 8px 24px rgba(15,23,42,.18)!important}
.ayoniParentModalV3__body{width:100%!important;max-height:calc(100vh - 44px)!important;overflow:auto!important;background:#f6f8fc!important}
.ayoniParentModalV3__imageWrap{display:flex!important;align-items:center!important;justify-content:center!important;min-height:220px!important;background:#f6f8fc!important}
.ayoniParentModalV3__image{display:block!important;width:auto!important;height:auto!important;max-width:100%!important;max-height:calc(100vh - 130px)!important;object-fit:contain!important}
.ayoniParentModalV3__video{position:relative!important;width:100%!important;aspect-ratio:16/9!important;background:#000!important}
.ayoniParentModalV3__video iframe{display:block!important;width:100%!important;height:100%!important;border:0!important}
.ayoniParentModalV3__caption{padding:15px 20px 18px!important;background:#fff!important}
.ayoniParentModalV3__title{font-size:16px!important;font-weight:800!important;color:#0f172a!important;line-height:1.4!important}
.ayoniParentModalV3__desc{margin-top:6px!important;font-size:13px!important;color:#64748b!important;line-height:1.55!important;white-space:pre-line!important}
@media(max-width:700px){.ayoniParentModalV3{padding:10px!important}.ayoniParentModalV3__panel{width:calc(100vw - 20px)!important;max-height:calc(100vh - 20px)!important}.ayoniParentModalV3__body{max-height:calc(100vh - 20px)!important}}
`;

    document.head.appendChild(style);
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
      .forEach(function (el) {
        el.remove();
      });
  }

  function blockMoreButtons() {
    if (window.__ayoniV3BlockMoreButtons) return;
    window.__ayoniV3BlockMoreButtons = true;

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

    if (!iframe.dataset.ayoniV3LoadBind) {
      iframe.dataset.ayoniV3LoadBind = '1';
      iframe.addEventListener('load', function () {
        [50, 180, 500, 1000, 1800].forEach(function (ms) {
          setTimeout(sendViewport, ms);
        });
      });
    }
  }

  function resizeIframe(height) {
    var iframe = getIframe();
    if (!iframe) return;

    var nextHeight = Math.max(760, Math.ceil(Number(height) || 0));
    if (!nextHeight) return;

    if (Math.abs(nextHeight - lastHeight) < 3) {
      queueViewport();
      return;
    }

    lastHeight = nextHeight;

    iframe.style.height = nextHeight + 'px';
    iframe.style.minHeight = nextHeight + 'px';
    iframe.style.maxHeight = 'none';
    iframe.height = String(nextHeight);
    iframe.setAttribute('height', String(nextHeight));
    iframe.setAttribute('scrolling', 'no');

    queueViewport();
  }

  function sendViewport() {
    var iframe = getIframe();
    if (!iframe || !iframe.contentWindow) return;

    var rect = iframe.getBoundingClientRect();

    iframe.contentWindow.postMessage({
      source: SOURCE,
      type: 'AYONI_PARENT_VIEWPORT',
      iframeTop: rect.top,
      iframeLeft: rect.left,
      iframeWidth: rect.width,
      iframeHeight: rect.height,
      viewportWidth: window.innerWidth || document.documentElement.clientWidth || 0,
      viewportHeight: window.innerHeight || document.documentElement.clientHeight || 0,
      scrollY: window.scrollY || window.pageYOffset || 0
    }, IFRAME_ORIGIN);
  }

  function queueViewport() {
    clearTimeout(viewportTimer);
    viewportTimer = setTimeout(sendViewport, 20);
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

    setTimeout(sendViewport, 40);
    setTimeout(sendViewport, 160);
    setTimeout(sendViewport, 420);
  }

  function closeModal() {
    var modal = document.getElementById(MODAL_ID);
    if (modal) modal.remove();

    document.documentElement.classList.remove('ayoniModalOpenV3');
    if (document.body) {
      document.body.classList.remove('ayoniModalOpenV3');
    }

    document.removeEventListener('keydown', onKeydown);
  }

  function onKeydown(event) {
    if (event.key === 'Escape') {
      closeModal();
    }
  }

  function createModal(contentHTML, title, desc) {
    closeModal();
    injectStyle();

    var modal = document.createElement('div');
    modal.id = MODAL_ID;
    modal.className = 'ayoniParentModalV3';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute(
      'aria-label',
      title || '포트폴리오 크게 보기'
    );

    var caption = '';

    if (title || desc) {
      caption =
        '<div class="ayoniParentModalV3__caption">' +
          (title
            ? '<div class="ayoniParentModalV3__title">' +
              escapeHTML(title) +
              '</div>'
            : '') +
          (desc
            ? '<div class="ayoniParentModalV3__desc">' +
              escapeHTML(desc) +
              '</div>'
            : '') +
        '</div>';
    }

    modal.innerHTML =
      '<div class="ayoniParentModalV3__backdrop" data-ayoni-v3-close="1"></div>' +
      '<div class="ayoniParentModalV3__panel">' +
        '<button type="button" class="ayoniParentModalV3__close" data-ayoni-v3-close="1" aria-label="닫기">×</button>' +
        '<div class="ayoniParentModalV3__body">' +
          contentHTML +
          caption +
        '</div>' +
      '</div>';

    modal.addEventListener('click', function (event) {
      var closeTarget =
        event.target &&
        event.target.getAttribute &&
        event.target.getAttribute('data-ayoni-v3-close') === '1';

      if (closeTarget) {
        closeModal();
      }
    });

    document.documentElement.classList.add('ayoniModalOpenV3');

    if (document.body) {
      document.body.classList.add('ayoniModalOpenV3');
      document.body.appendChild(modal);
    }

    document.addEventListener('keydown', onKeydown);
  }

  function openImageModal(src, title, desc) {
    if (!src) return;

    createModal(
      '<div class="ayoniParentModalV3__imageWrap">' +
        '<img class="ayoniParentModalV3__image" src="' +
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
      '<div class="ayoniParentModalV3__video">' +
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
    if (window.__ayoniV3ParentMessageBind) return;
    window.__ayoniV3ParentMessageBind = true;

    window.addEventListener('message', function (event) {
      if (event.origin !== IFRAME_ORIGIN) return;

      var iframe = getIframe();
      if (!iframe || !iframe.contentWindow) return;
      if (event.source !== iframe.contentWindow) return;

      var data = event.data || {};
      if (data.source !== CHILD_SOURCE) return;

      if (data.type === 'AYONI_IFRAME_HEIGHT') {
        resizeIframe(data.height);
      }

      if (
        data.type === 'AYONI_IFRAME_READY' ||
        data.type === 'AYONI_REQUEST_PARENT_VIEWPORT'
      ) {
        queueViewport();
      }

      if (data.type === 'AYONI_PARENT_SCROLL_TO') {
        scrollParentTo(data.targetY, data.navHeight);
      }

      if (data.type === 'AYONI_OPEN_IMAGE_MODAL') {
        openImageModal(data.src, data.title, data.desc);
      }

      if (data.type === 'AYONI_OPEN_YOUTUBE_MODAL') {
        openYoutubeModal(data.id, data.title, data.desc);
      }
    });

    window.addEventListener('scroll', queueViewport, { passive: true });
    window.addEventListener('resize', queueViewport);
    window.addEventListener('orientationchange', function () {
      setTimeout(sendViewport, 180);
    });
  }

  function observePage() {
    if (window.__ayoniV3ParentObserver) return;
    window.__ayoniV3ParentObserver = true;

    var observer = new MutationObserver(function () {
      removeMoreButtons();
      unlockDetail();
      prepareIframe();
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true
    });
  }

  function neutralize() {
    injectStyle();
    removeMoreButtons();
    unlockDetail();
    blockMoreButtons();
    prepareIframe();
    bindMessages();
    observePage();
    queueViewport();
  }

  if (document.readyState !== 'loading') {
    neutralize();
  } else {
    document.addEventListener('DOMContentLoaded', neutralize);
  }

  setTimeout(neutralize, 250);
  setTimeout(neutralize, 800);
  setTimeout(neutralize, 1600);
  setTimeout(neutralize, 2600);
})();
