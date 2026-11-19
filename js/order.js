document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('orderForm');
  const confirmationBlock = document.getElementById('orderConfirmation');
  const confirmNameSpan = document.getElementById('confirmName');
  const summaryBox = document.getElementById('orderSummaryBox');
  const newOrderBtn = document.getElementById('newOrderBtn');

  const nameInput = document.getElementById('customerName');
  const phoneInput = document.getElementById('customerPhone');
  const emailInput = document.getElementById('customerEmail');
  const serviceSelect = document.getElementById('serviceSelect');
  const dateInput = document.getElementById('cleaningDate');
  const roomsInput = document.getElementById('roomsCount');
  const addressInput = document.getElementById('customerAddress');
  const notesInput = document.getElementById('customerNotes');

  const params = new URLSearchParams(window.location.search);
  const preselectedService = params.get('service');
  if (preselectedService) {
    Array.from(serviceSelect.options).forEach((option) => {
      if (option.value.toLowerCase() === preselectedService.toLowerCase()) {
        serviceSelect.value = option.value;
      }
    });
  }

  const todayIso = new Date().toISOString().split('T')[0];

  dateInput.addEventListener('focus', () => {
    dateInput.type = 'date';
    dateInput.min = todayIso;
  });

  dateInput.addEventListener('blur', () => {
    if (!dateInput.value) {
      dateInput.type = 'text';
    }
  });

  const setFieldError = (inputEl, errorElId, hasError) => {
    const errorEl = document.getElementById(errorElId);
    if (hasError) {
      inputEl.classList.add('is-invalid');
      errorEl.classList.add('visible');
    } else {
      inputEl.classList.remove('is-invalid');
      errorEl.classList.remove('visible');
    }
  };

  const formatDisplayDate = (rawDate) => {
    if (/^\d{4}-\d{2}-\d{2}$/.test(rawDate)) {
      const [year, month, day] = rawDate.split('-');
      return `${day}.${month}.${year}`;
    }
    return rawDate;
  };

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const nameVal = nameInput.value.trim();
    const phoneVal = phoneInput.value.trim();
    const emailVal = emailInput.value.trim();
    const dateVal = dateInput.value.trim();
    const roomsVal = parseInt(roomsInput.value, 10);
    const addressVal = addressInput.value.trim();

    const isNameInvalid = nameVal.length < 2;
    const isPhoneInvalid = phoneVal.replace(/\D/g, '').length < 9;
    const isEmailInvalid = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal);
    const isDateInvalid = dateVal.length === 0;
    const isRoomsInvalid = Number.isNaN(roomsVal) || roomsVal < 1;
    const isAddressInvalid = addressVal.length < 4;

    setFieldError(nameInput, 'errorName', isNameInvalid);
    setFieldError(phoneInput, 'errorPhone', isPhoneInvalid);
    setFieldError(emailInput, 'errorEmail', isEmailInvalid);
    setFieldError(dateInput, 'errorDate', isDateInvalid);
    setFieldError(roomsInput, 'errorRooms', isRoomsInvalid);
    setFieldError(addressInput, 'errorAddress', isAddressInvalid);

    if (
      isNameInvalid ||
      isPhoneInvalid ||
      isEmailInvalid ||
      isDateInvalid ||
      isRoomsInvalid ||
      isAddressInvalid
    ) {
      return;
    }

    const orderData = {
      name: nameVal,
      phone: phoneVal,
      email: emailVal,
      service: serviceSelect.value,
      date: formatDisplayDate(dateVal),
      rooms: roomsVal,
      address: addressVal,
      notes: notesInput.value.trim()
    };

    try {
      localStorage.setItem('duhOseliLastOrder', JSON.stringify(orderData));
    } catch (storageError) {
      // Ігноруємо помилку, якщо localStorage обмежений
    }

    confirmNameSpan.textContent = orderData.name;
    summaryBox.innerHTML = `
      <p><strong>Послуга:</strong> ${orderData.service}</p>
      <p><strong>Дата візиту домовиків:</strong> ${orderData.date}</p>
      <p><strong>Кількість кімнат:</strong> ${orderData.rooms}</p>
      <p><strong>Адреса:</strong> ${orderData.address}</p>
      <p><strong>Контактний телефон:</strong> ${orderData.phone}</p>
      ${orderData.notes ? `<p><strong>Побажання:</strong> ${orderData.notes}</p>` : ''}
    `;

    form.style.display = 'none';
    confirmationBlock.classList.add('is-visible');
  });

  newOrderBtn.addEventListener('click', () => {
    form.reset();
    dateInput.type = 'text';
    roomsInput.value = '1';
    confirmationBlock.classList.remove('is-visible');
    form.style.display = 'grid';
  });
});