/* BFC Gym — interaction layer + WhatsApp join form */

(function () {
  'use strict';

  /* 👉 Change this to your WhatsApp number (country code + number, no + or spaces) */
  var WA_NUMBER = '917666802550';

  document.addEventListener('DOMContentLoaded', function () {

    /* ---------- Smooth scroll for in-page anchors ---------- */
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        if (link.hasAttribute('data-join')) return; // join buttons handled below
        var id = link.getAttribute('href').slice(1);
        var target = id ? document.getElementById(id) : null;
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });

    /* ---------- Modal open / close ---------- */
    var modal     = document.getElementById('joinModal');
    var form      = document.getElementById('joinForm');
    var errorEl   = document.getElementById('formError');
    var planInput = document.getElementById('jPlan');
    var nameInput = document.getElementById('jName');
    var lastFocused = null;

    function openModal(plan) {
      lastFocused = document.activeElement;
      planInput.value = plan || 'Not selected';
      errorEl.textContent = '';
      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      window.setTimeout(function () { nameInput.focus(); }, 80);
    }

    function closeModal() {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (lastFocused && lastFocused.focus) lastFocused.focus();
    }

    /* Every element with data-join opens the form */
    document.querySelectorAll('[data-join]').forEach(function (el) {
      el.addEventListener('click', function (e) {
        e.preventDefault();
        openModal(el.getAttribute('data-plan') || '');
      });
    });

    /* Close: X button, clicking the backdrop, or Escape */
    modal.querySelectorAll('[data-close]').forEach(function (el) {
      el.addEventListener('click', closeModal);
    });
    modal.addEventListener('click', function (e) {
      if (e.target === modal) closeModal();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
    });

    /* ---------- Validate + send to WhatsApp ---------- */
    function setError(msg, field) {
      errorEl.textContent = msg;
      if (field) field.focus();
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var name    = document.getElementById('jName').value.trim();
      var age     = document.getElementById('jAge').value.trim();
      var mobile  = document.getElementById('jMobile').value.trim();
      var email   = document.getElementById('jEmail').value.trim();
      var address = document.getElementById('jAddress').value.trim();
      var plan    = planInput.value;

      /* Required checks */
      if (!name)    return setError('Please enter your full name.', document.getElementById('jName'));
      if (!age)     return setError('Please enter your age.', document.getElementById('jAge'));
      if (Number(age) < 10 || Number(age) > 99)
                    return setError('Please enter a valid age (10–99).', document.getElementById('jAge'));

      var digits = mobile.replace(/\D/g, '');
      if (digits.length < 10 || digits.length > 12)
                    return setError('Please enter a valid mobile number (10 digits).', document.getElementById('jMobile'));

      if (!email)   return setError('Please enter your email ID.', document.getElementById('jEmail'));
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email))
                    return setError('Please enter a valid email ID.', document.getElementById('jEmail'));

      if (!address) return setError('Please enter your address.', document.getElementById('jAddress'));

      errorEl.textContent = '';

      /* Build the WhatsApp message */
      var message =
        '*NEW JOIN REQUEST — BFC GYM*' + '\n' +
        '--------------------------------' + '\n' +
        '*Name:* '    + name    + '\n' +
        '*Age:* '     + age     + '\n' +
        '*Mobile:* '  + mobile  + '\n' +
        '*Email:* '   + email   + '\n' +
        '*Address:* ' + address + '\n' +
        '*Plan:* '    + plan    + '\n' +
        '--------------------------------' + '\n' +
        'Sent from the BFC Gym website.';

      var url = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(message);

      /* Open WhatsApp (app on mobile, WhatsApp Web on desktop) */
      window.open(url, '_blank', 'noopener');

      /* Reset + close */
      form.reset();
      planInput.value = 'Not selected';
      closeModal();
    });
  });
})();

