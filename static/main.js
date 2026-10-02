/**
 * Termnix-IT Portfolio - Main JavaScript
 * 共通 UI の初期化と、軽量なページ補助処理をまとめる。
 */

const NAV_SCROLLED_THRESHOLD = 50;
// 目次の現在地を決める基準線（画面上端からの割合）
const SCROLL_SPY_LINE_RATIO = 0.35;
const QIITA_USER = 'Termnix-IT';
const QIITA_API_URL = `https://qiita.com/api/v2/users/${QIITA_USER}/items?page=1&per_page=5`;
const QIITA_REQUEST_TIMEOUT_MS = 5000;
const CONTACT_REQUEST_TIMEOUT_MS = 10000;

let isScrollTicking = false;
let qiitaCache = null;
let tocEntries = [];

window.addEventListener('scroll', handleWindowScroll, { passive: true });
window.addEventListener('resize', handleWindowScroll, { passive: true });

document.addEventListener('DOMContentLoaded', () => {
  updateNavbarState();
  initNavToggle();
  initScrollSpy();
  loadQiitaArticles();
  initLightbox();
  initContactForm();
});

function handleWindowScroll() {
  if (isScrollTicking) {
    return;
  }

  isScrollTicking = true;
  requestAnimationFrame(() => {
    updateNavbarState();
    updateScrollSpy();
    isScrollTicking = false;
  });
}

function updateNavbarState() {
  const nav = document.getElementById('mainNav');
  if (!nav) {
    return;
  }

  nav.classList.toggle('scrolled', window.scrollY > NAV_SCROLLED_THRESHOLD);
}

// サイドパネル目次（Sections）の現在地表示。見出しが基準線を越えた最後のセクションを現在地とし、
// ページ末尾まで来たら最後のセクションにする。最初のセクションより上（ヒーロー）では何も選ばない。
function initScrollSpy() {
  tocEntries = Array.from(document.querySelectorAll('.cdoc-toc-list a[href^="#"]'))
    .map((link) => ({ link, section: document.getElementById(link.getAttribute('href').slice(1)) }))
    .filter((entry) => entry.section);
  updateScrollSpy();
}

function updateScrollSpy() {
  if (!tocEntries.length) {
    return;
  }

  const line = window.innerHeight * SCROLL_SPY_LINE_RATIO;
  const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
  let current = null;

  if (atBottom) {
    current = tocEntries[tocEntries.length - 1];
  } else {
    tocEntries.forEach((entry) => {
      if (entry.section.getBoundingClientRect().top <= line) {
        current = entry;
      }
    });
  }

  tocEntries.forEach((entry) => {
    const isCurrent = entry === current;
    entry.link.classList.toggle('is-current', isCurrent);
    if (isCurrent) {
      entry.link.setAttribute('aria-current', 'true');
    } else {
      entry.link.removeAttribute('aria-current');
    }
  });
}

// 狭い画面のナビメニュー開閉。Bootstrap の collapse と同じく、
// メニューに .show、ボタンに aria-expanded と .collapsed を付け外しする。
function initNavToggle() {
  const toggler = document.querySelector('.navbar-toggler[aria-controls]');
  const menu = toggler && document.getElementById(toggler.getAttribute('aria-controls'));
  if (!menu) {
    return;
  }

  toggler.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('show');
    toggler.setAttribute('aria-expanded', String(isOpen));
    toggler.classList.toggle('collapsed', !isOpen);
  });
}

function initLightbox() {
  const zoomableImages = document.querySelectorAll('.diagram-zoomable');
  if (!zoomableImages.length) {
    return;
  }

  const overlay = document.createElement('div');
  overlay.className = 'lightbox-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', '画像拡大表示');

  const closeButton = document.createElement('button');
  closeButton.className = 'lightbox-close';
  closeButton.setAttribute('aria-label', '閉じる');
  closeButton.innerHTML = '&times;';

  const lightboxImage = document.createElement('img');
  lightboxImage.alt = '';

  overlay.append(closeButton, lightboxImage);
  document.body.appendChild(overlay);

  // 閉じたときに、開く操作をした画像へフォーカスを戻す
  let openerImage = null;

  const setLightboxState = (isOpen, image = null) => {
    // 閉じるアニメーションの間も画像を見せるため、画像は開くときにだけ差し替える
    if (image) {
      lightboxImage.src = image.src;
      lightboxImage.alt = image.alt || '';
    }
    overlay.classList.toggle('is-open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';

    if (isOpen) {
      openerImage = image;
      closeButton.focus();
    } else if (openerImage) {
      openerImage.focus();
      openerImage = null;
    }
  };

  zoomableImages.forEach((image) => {
    // キーボードでも開けるよう、画像をボタンとして扱う
    image.tabIndex = 0;
    image.setAttribute('role', 'button');
    image.setAttribute('aria-label', `${image.alt || '画像'}を拡大表示`);

    image.addEventListener('click', () => setLightboxState(true, image));
    image.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        setLightboxState(true, image);
      }
    });
  });

  closeButton.addEventListener('click', () => setLightboxState(false));
  overlay.addEventListener('click', (event) => {
    if (event.target === overlay) {
      setLightboxState(false);
    }
  });
  document.addEventListener('keydown', (event) => {
    if (!overlay.classList.contains('is-open')) {
      return;
    }

    if (event.key === 'Escape') {
      setLightboxState(false);
    } else if (event.key === 'Tab') {
      // ダイアログ内で操作できるのは閉じるボタンだけなので、フォーカスを外に出さない
      event.preventDefault();
      closeButton.focus();
    }
  });
}

function initContactForm() {
  const form = document.querySelector('[data-contact-form]');
  if (!form) {
    return;
  }

  const status = form.querySelector('[data-contact-status]');
  const submitButton = form.querySelector('button[type="submit"]');
  const endpoint = form.dataset.endpoint;

  if (!endpoint) {
    renderContactStatus(status, '問い合わせフォームの送信先が設定されていません。', 'error');
    return;
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const formData = new FormData(form);
    const payload = {
      name: String(formData.get('name') || '').trim(),
      email: String(formData.get('email') || '').trim(),
      topic: String(formData.get('topic') || '').trim(),
      message: String(formData.get('message') || '').trim(),
      _gotcha: String(formData.get('_gotcha') || '').trim(),
    };

    if (payload._gotcha) {
      renderContactStatus(status, '送信を受け付けました。', 'success');
      form.reset();
      return;
    }

    const controller = typeof AbortController === 'function' ? new AbortController() : null;
    const timeoutId = window.setTimeout(() => {
      if (controller) {
        controller.abort();
      }
    }, CONTACT_REQUEST_TIMEOUT_MS);

    setContactSubmitting(form, submitButton, true);
    renderContactStatus(status, '送信しています...', 'pending');

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        signal: controller ? controller.signal : undefined,
      });

      if (!response.ok) {
        throw new Error('Contact form request failed');
      }

      form.reset();
      renderContactStatus(status, '送信しました。内容を確認後、必要に応じて返信します。', 'success');
    } catch (error) {
      renderContactStatus(status, '送信できませんでした。時間をおいて再度お試しください。', 'error');
    } finally {
      window.clearTimeout(timeoutId);
      setContactSubmitting(form, submitButton, false);
    }
  });
}

function setContactSubmitting(form, submitButton, isSubmitting) {
  form.classList.toggle('is-submitting', isSubmitting);

  if (!submitButton) {
    return;
  }

  submitButton.disabled = isSubmitting;
  submitButton.innerHTML = isSubmitting
    ? '<i class="fas fa-spinner fa-spin"></i aria-hidden="true"> 送信中'
    : '<i class="fas fa-paper-plane"></i aria-hidden="true"> 送信する';
}

function renderContactStatus(status, message, state) {
  if (!status) {
    return;
  }

  status.textContent = message;
  status.dataset.state = state;

  // 送信成功時は、線で描かれるチェックマークを文の前に添える（style.css の .cdoc-form-check）
  if (state === 'success') {
    status.insertAdjacentHTML(
      'afterbegin',
      '<svg class="cdoc-form-check" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
    );
  }
}

async function loadQiitaArticles() {
  const list = document.getElementById('qiita-articles');
  if (!list) {
    return;
  }

  if (qiitaCache) {
    renderQiitaArticles(list, qiitaCache);
    return;
  }

  const controller = typeof AbortController === 'function' ? new AbortController() : null;
  let didTimeout = false;

  const timeoutId = window.setTimeout(() => {
    didTimeout = true;
    if (controller) {
      controller.abort();
    }
    renderQiitaMessage(list, '記事が取得できませんでした');
  }, QIITA_REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(QIITA_API_URL, controller ? { signal: controller.signal } : undefined);
    if (!response.ok) {
      throw new Error('Qiita API request failed');
    }

    const data = await response.json();
    if (didTimeout) {
      return;
    }

    qiitaCache = Array.isArray(data) ? data : [];
    renderQiitaArticles(list, qiitaCache);
  } catch (error) {
    if (!didTimeout) {
      renderQiitaMessage(list, '記事が取得できませんでした');
    }
  } finally {
    window.clearTimeout(timeoutId);
  }
}

function renderQiitaArticles(list, articles) {
  list.innerHTML = '';
  list.removeAttribute('aria-busy');

  if (!articles.length) {
    renderQiitaMessage(list, '記事がまだありません');
    return;
  }

  articles.forEach((article) => {
    const listItem = document.createElement('li');
    const link = document.createElement('a');

    link.href = article.url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = article.title;

    listItem.appendChild(link);
    list.appendChild(listItem);
  });
}

function renderQiitaMessage(list, message) {
  list.innerHTML = '';
  list.removeAttribute('aria-busy');

  const listItem = document.createElement('li');
  listItem.className = 'qiita-status';
  listItem.textContent = message;

  list.appendChild(listItem);
}
