(function () {
  'use strict';

  var IFRAME_ORIGIN = 'https://hime-haruka.github.io';
  var IFRAME_PATH = 'hime-haruka.github.io/ayoni-artmug';
  var STYLE_ID = 'ayoni-artmug-parent-style-v2';
  var MODAL_ID = 'ayoni-artmug-parent-modal';
  var lastHeight = 0;
  var viewportTimer = null;

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
html.ayoniModalOpen,body.ayoniModalOpen{overflow:hidden!important}
.ayoniParentModal{position:fixed!important;inset:0!important;z-index:2147483647!important;display:flex!important;align-items:center!important;justify-content:center!important;padding:24px!important;font-family:Pretendard,"Apple SD Gothic Neo","Noto Sans KR",sans-serif!important}
.ayoniParentModal__backdrop{position:absolute!important;inset:0!important;background:rgba(8,15,32,.68)!important;backdrop-filter:blur(8px)!important;-webkit-backdrop-filter:blur(8px)!important}
.ayoniParentModal__panel{position:relative!important;z-index:1!important;width:min(1100px,calc(100vw - 48px))!important;max-height:calc(100vh - 48px)!important;border:1px solid rgba(255,255,255,.24)!important;border-radius:22px!important;background:#fff!important;box-shadow:0 28px 100px rgba(6,15,38,.42)!important;overflow:hidden!important}
.ayoniParentModal__close{position:absolute!important;top:12px!important;right:12px!important;z-index:4!important;width:42px!important;height:42px!important;border:1px solid rgba(31,78,216,.18)!important;border-radius:999px!important;background:rgba(255,255,255,.94)!important;color:#1f2b45!important;font-size:24px!important;line-height:1!important;font-weight:700!important;cursor:pointer!important;box-shadow:0 8px 24px rgba(15,23,42,.16)!important}
.ayoniParentModal__body{width:100%!important;max-height:calc(100vh - 48px)!important;overflow:auto!important;background:#f7faff!important}
.ayoniParentModal__image{display:block!important;width:100%!important;height:auto!important;max-height:calc(100vh - 120px)!important;object-fit:contain!important;background:#f7faff!important}
.ayoniParentModal__video{position:relative!important;width:100%!important;aspect-ratio:16/9!important;background:#000!important}
.ayoniParentModal__video iframe{display:block!important;width:100%!important;height:100%!important;border:0!important}
.ayoniParentModal__caption{padding:16px 20px 18px!important;background:#fff!important}
.ayoniParentModal__title{font-size:16px!important;font-weight:800!important;color:#0b1220!important;line-height:1.35!important}
.ayoniParentModal__desc{margin-top:6px!important;font-size:13px!important;color:#5b6b86!important;line-height:1.55!important;white-space:pre-line!important}
@media(max-width:700px){.ayoniParentModal{padding:12px!important}.ayoniParentModal__panel{width:calc(100vw - 24px)!important;max-height:calc(100vh - 24px)!important}.ayoniParentModal__body{max-height:calc(100vh - 24px)!important}}
`;
    document.head.appendChild(style);
  }

  function escapeHTML(value) {
    return String(value || '').replace(/[&<>"']/g, function (s) {
      return ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' })[s];
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
    (root || document).querySelectorAll('.btn_open_btn,.btn_open,.btn_close').forEach(function (el) { el.remove(); });
  }

  function hardBlockMoreButtons() {
    if (window.__ayoniArtmugHardBlockClicks) return;
    window.__ayoniArtmugHardBlockClicks = true;
    document.addEventListener('click', function (e) {
      var target = e.target && e.target.closest ? e.target.closest('.btn_open_btn,.btn_open,.btn_close') : null;
      if (!target) return;
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
    }, true);
  }

  function prepareIframe() {
    var iframe = getIframe();
    if (!iframe) return;
    iframe.style.width = '100%';
    iframe.style.border = '0';
    iframe.style.display = 'block';
    iframe.style.overflow = 'hidden';
    iframe.setAttribute('scrolling', 'no');
    if (!iframe.dataset.ayoniParentBound) {
      iframe.dataset.ayoniParentBound = '1';
      iframe.addEventListener('load', function () {
        [60,220,650,1400].forEach(function (ms) { setTimeout(sendViewportToIframe, ms); });
      });
    }
  }

  function resizeIframe(height) {
    var iframe = getIframe();
    if (!iframe) return;
    var nextHeight = Math.max(760, Math.ceil(Number(height) || 0));
    if (!nextHeight) return;
    if (Math.abs(nextHeight - lastHeight) < 4) {
      queueViewportSend();
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
    queueViewportSend();
  }

  function sendViewportToIframe() {
    var iframe = getIframe();
    if (!iframe || !iframe.contentWindow) return;
    var rect = iframe.getBoundingClientRect();
    iframe.contentWindow.postMessage({
      source: 'syura-artmug-parent',
      type: 'SYURA_PARENT_VIEWPORT',
      iframeTop: rect.top,
      iframeLeft: rect.left,
      iframeWidth: rect.width,
      iframeHeight: rect.height,
      viewportWidth: window.innerWidth || document.documentElement.clientWidth || 0,
      viewportHeight: window.innerHeight || document.documentElement.clientHeight || 0,
      scrollY: window.scrollY || window.pageYOffset || 0
    }, IFRAME_ORIGIN);
  }

  function queueViewportSend() {
    clearTimeout(viewportTimer);
    viewportTimer = setTimeout(sendViewportToIframe, 20);
  }

  function scrollParentTo(targetY, navHeight) {
    var iframe = getIframe();
    if (!iframe) return;
    var rect = iframe.getBoundingClientRect();
    var iframePageTop = (window.scrollY || window.pageYOffset || 0) + rect.top;
    var y = Math.max(0, iframePageTop + Number(targetY || 0) - Number(navHeight || 0) - 8);
    window.scrollTo({ top: y, behavior: 'smooth' });
    setTimeout(sendViewportToIframe, 50);
    setTimeout(sendViewportToIframe, 180);
    setTimeout(sendViewportToIframe, 420);
  }

  function closeModal() {
    var modal = document.getElementById(MODAL_ID);
    if (modal) modal.remove();
    document.documentElement.classList.remove('ayoniModalOpen');
    if (document.body) document.body.classList.remove('ayoniModalOpen');
    document.removeEventListener('keydown', onModalKeydown);
  }

  function onModalKeydown(e) {
    if (e.key === 'Escape') closeModal();
  }

  function createModal(contentHTML, title, desc) {
    closeModal();
    injectStyle();

    var modal = document.createElement('div');
    modal.id = MODAL_ID;
    modal.className = 'ayoniParentModal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-label', title || '포트폴리오 크게 보기');

    var caption = '';
    if (title || desc) {
      caption = '<div class="ayoniParentModal__caption">' +
        (title ? '<div class="ayoniParentModal__title">' + escapeHTML(title) + '</div>' : '') +
        (desc ? '<div class="ayoniParentModal__desc">' + escapeHTML(desc) + '</div>' : '') +
      '</div>';
    }

    modal.innerHTML =
      '<div class="ayoniParentModal__backdrop" data-ayoni-close="1"></div>' +
      '<div class="ayoniParentModal__panel">' +
        '<button type="button" class="ayoniParentModal__close" data-ayoni-close="1" aria-label="닫기">×</button>' +
        '<div class="ayoniParentModal__body">' + contentHTML + caption + '</div>' +
      '</div>';

    modal.addEventListener('click', function (e) {
      if (e.target && e.target.getAttribute && e.target.getAttribute('data-ayoni-close') === '1') closeModal();
    });

    document.documentElement.classList.add('ayoniModalOpen');
    if (document.body) document.body.classList.add('ayoniModalOpen');
    document.addEventListener('keydown', onModalKeydown);
    document.body.appendChild(modal);
  }

  function openImageModal(src, title, desc) {
    if (!src) return;
    createModal(
      '<img class="ayoniParentModal__image" src="' + escapeHTML(src) + '" alt="' + escapeHTML(title || '포트폴리오 이미지') + '">',
      title,
      desc
    );
  }

  function openYoutubeModal(id, title, desc) {
    if (!id) return;
    createModal(
      '<div class="ayoniParentModal__video"><iframe src="https://www.youtube.com/embed/' + encodeURIComponent(id) + '?autoplay=1&rel=0" title="' + escapeHTML(title || 'YouTube video player') + '" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe></div>',
      title,
      desc
    );
  }

  function bindMessages() {
    if (window.__ayoniArtmugMessageBind) return;
    window.__ayoniArtmugMessageBind = true;

    window.addEventListener('message', function (e) {
      if (e.origin !== IFRAME_ORIGIN) return;
      var iframe = getIframe();
      if (!iframe || !iframe.contentWindow || e.source !== iframe.contentWindow) return;

      var data = e.data || {};
      if (data.source !== 'syura-css') return;

      if (data.type === 'SYURA_IFRAME_HEIGHT') resizeIframe(data.height);
      if (data.type === 'SYURA_IFRAME_READY' || data.type === 'SYURA_REQUEST_PARENT_VIEWPORT') queueViewportSend();
      if (data.type === 'SYURA_PARENT_SCROLL_TO') scrollParentTo(data.targetY, data.navHeight);
      if (data.type === 'SYURA_OPEN_IMAGE_MODAL') openImageModal(data.src, data.title, data.desc);
      if (data.type === 'SYURA_OPEN_YOUTUBE_MODAL') openYoutubeModal(data.id, data.title, data.desc);
    });

    window.addEventListener('scroll', queueViewportSend, { passive: true });
    window.addEventListener('resize', queueViewportSend);
    window.addEventListener('orientationchange', function () { setTimeout(sendViewportToIframe, 180); });
  }

  function observePage() {
    if (window.__ayoniArtmugObserver) return;
    window.__ayoniArtmugObserver = new MutationObserver(function () {
      removeMoreButtons();
      unlockDetail();
      prepareIframe();
    });
    window.__ayoniArtmugObserver.observe(document.documentElement, { childList: true, subtree: true });
  }

  function neutralize() {
    injectStyle();
    removeMoreButtons();
    unlockDetail();
    hardBlockMoreButtons();
    prepareIframe();
    bindMessages();
    observePage();
    queueViewportSend();
  }

  if (document.readyState !== 'loading') neutralize();
  else document.addEventListener('DOMContentLoaded', neutralize);

  setTimeout(neutralize, 300);
  setTimeout(neutralize, 1000);
  setTimeout(neutralize, 2000);
})();
