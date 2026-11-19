document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('orderModal');
  const openButtons = document.querySelectorAll('[data-open-order]');
  const closeBtn = document.getElementById('closeModalBtn');
  const orderForm = document.getElementById('quickOrderForm');
  const orderSuccess = document.getElementById('orderSuccess');
  const orderSuccessText = document.getElementById('orderSuccessText');

  openButtons.forEach((btn) => {
    btn.addEventListener('click', (event) => {
      if (btn.tagName === 'A' && btn.getAttribute('href') === 'order.html') {
        return;
      }
      event.preventDefault();
      orderForm.style.display = 'block';
      orderSuccess.classList.remove('is-visible');
      modal.classList.add('is-open');
    });
  });

  const closeModal = () => {
    modal.classList.remove('is-open');
  };

  closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal.classList.contains('is-open')) {
      closeModal();
    }
  });

  orderForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = document.getElementById('clientName').value.trim();
    const service = document.getElementById('serviceType').value;

    orderForm.style.display = 'none';
    orderSuccessText.textContent = `Дякуємо, ${name}! Шаман уже готує обряд «${service}». Очікуйте дзвінка найближчим часом.`;
    orderSuccess.classList.add('is-visible');
    orderForm.reset();
  });
});