// ======================================
// ENQUIRY VALIDATION - Advanced Level
// Regex + File + Character Count + XSS Protection
// ======================================

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('enquiryForm');
  if (!form) return;

  const fields = {
    type: document.getElementById('enquiryType'),
    name: document.getElementById('enqName'),
    phone: document.getElementById('enqPhone'),
    email: document.getElementById('enqEmail'),
    subject: document.getElementById('enqSubject'),
    message: document.getElementById('enqMessage'),
    budget: document.getElementById('enqBudget'),
    privacy: document.getElementById('enqPrivacy'),
    file: document.getElementById('enqAttachment')
  };

  const statusEl = document.getElementById('enquiryStatus');
  const submitBtn = document.getElementById('enqSubmitBtn');
  const btnText = document.getElementById('enqBtnText');
  const subjectCount = document.getElementById('subjectCount');
  const messageCount = document.getElementById('messageCount');

  // Patterns
  const regex = {
    name: /^[A-Za-z\s'-]{2,50}$/,
    phone: /^(\+27|27|0)[6-8][0-9]{8}$/, // SA mobile 071-083
    email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    subject: /^[A-Za-z0-9\s.,?!\-()']{5,100}$/,
    // Block XSS
    xss: /<script|javascript:|onerror=|onload=/i
  };

  function showError(inputId, msg) {
    const errEl = document.getElementById(inputId + 'Error') || document.getElementById(inputId.replace('enq','').toLowerCase()+'Error');
    const map = {
      enqName: 'enqNameError', enqPhone: 'enqPhoneError', enqEmail: 'enqEmailError',
      enquiryType: 'typeError', enqSubject: 'subjectError', enqMessage: 'messageError',
      enqPrivacy: 'privacyError', enqAttachment: 'fileError'
    };
    const target = document.getElementById(map[inputId] || inputId+'Error');
    const input = fields[inputId] || document.getElementById(inputId);
    
    if (input) { input.classList.add('invalid'); input.classList.remove('valid'); }
    if (target) { target.textContent = msg; target.classList.add('show'); }
    if (document.getElementById(inputId)) {
      document.getElementById(inputId).classList.add('invalid');
    }
  }

  function showSuccess(inputId) {
    const map = {
      enqName: 'enqNameError', enqPhone: 'enqPhoneError', enqEmail: 'enqEmailError',
      enquiryType: 'typeError', enqSubject: 'subjectError', enqMessage: 'messageError'
    };
    const target = document.getElementById(map[inputId]);
    const input = document.getElementById(inputId);
    if (input) { input.classList.remove('invalid'); input.classList.add('valid'); }
    if (target) target.classList.remove('show');
  }

  // Character counters
  fields.subject?.addEventListener('input', () => {
    subjectCount.textContent = fields.subject.value.length;
    if (fields.subject.value.length > 90) subjectCount.style.color = '#ef4444';
    else subjectCount.style.color = '#64748b';
    validateSubject();
  });

  fields.message?.addEventListener('input', () => {
    messageCount.textContent = fields.message.value.length;
    if (fields.message.value.length > 450) messageCount.style.color = '#ef4444';
    else messageCount.style.color = '#64748b';
    validateMessage();
  });

  // Individual validators
  function validateType() {
    if (!fields.type.value) { showError('enquiryType', 'Select enquiry type *'); return false; }
    showSuccess('enquiryType'); return true;
  }
  function validateName() {
    const v = fields.name.value.trim();
    if (!v) { showError('enqName', 'Name required *'); return false; }
    if (regex.xss.test(v)) { showError('enqName', 'Invalid characters detected'); return false; }
    if (!regex.name.test(v)) { showError('enqName', '2-50 letters only (e.g., Thabo Molefe)'); return false; }
    showSuccess('enqName'); return true;
  }
  function validatePhone() {
    const v = fields.phone.value.trim().replace(/\s/g,'');
    if (!v) { showError('enqPhone', 'Phone required *'); return false; }
    if (!regex.phone.test(v)) { showError('enqPhone', 'Enter SA mobile: 0712345678 or +27712345678 (071-083)'); return false; }
    showSuccess('enqPhone'); return true;
  }
  function validateEmail() {
    const v = fields.email.value.trim();
    if (!v) { showError('enqEmail', 'Email required for quote *'); return false; }
    if (regex.xss.test(v)) { showError('enqEmail', 'Invalid email'); return false; }
    if (!regex.email.test(v)) { showError('enqEmail', 'Enter valid email: name@gmail.com'); return false; }
    showSuccess('enqEmail'); return true;
  }
  function validateSubject() {
    const v = fields.subject.value.trim();
    if (!v) { showError('enqSubject', 'Subject required *'); return false; }
    if (v.length < 5) { showError('enqSubject', 'Min 5 characters'); return false; }
    if (v.length > 100) { showError('enqSubject', 'Max 100 characters'); return false; }
    if (regex.xss.test(v)) { showError('enqSubject', 'Remove script tags'); return false; }
    showSuccess('enqSubject'); return true;
  }
  function validateMessage() {
    const v = fields.message.value.trim();
    if (!v) { showError('enqMessage', 'Message required *'); return false; }
    if (v.length < 20) { showError('enqMessage', `Too short: ${v.length}/20 min. Write more detail`); return false; }
    if (v.length > 500) { showError('enqMessage', 'Max 500 characters'); return false; }
    if (regex.xss.test(v)) { showError('enqMessage', 'Script tags not allowed'); return false; }
    showSuccess('enqMessage'); return true;
  }
  function validatePrivacy() {
    if (!fields.privacy.checked) {
      const el = document.getElementById('privacyError');
      el.textContent = 'You must agree to privacy *'; el.classList.add('show'); return false;
    }
    document.getElementById('privacyError').classList.remove('show'); return true;
  }
  function validateFile() {
    const file = fields.file.files[0];
    if (!file) { document.getElementById('fileError').classList.remove('show'); return true; }
    const validTypes = ['image/jpeg','image/png','image/webp','application/pdf'];
    if (!validTypes.includes(file.type)) {
      showError('enqAttachment', 'Only JPG, PNG, WebP, PDF allowed'); return false;
    }
    if (file.size > 2 * 1024 * 1024) {
      showError('enqAttachment', 'File too big: Max 2MB'); return false;
    }
    showSuccess('enqAttachment'); return true;
  }

  // Real-time
  fields.type.addEventListener('change', validateType);
  fields.name.addEventListener('blur', validateName);
  fields.name.addEventListener('input', validateName);
  fields.phone.addEventListener('blur', validatePhone);
  fields.email.addEventListener('blur', validateEmail);
  fields.subject.addEventListener('blur', validateSubject);
  fields.message.addEventListener('blur', validateMessage);
  fields.privacy.addEventListener('change', validatePrivacy);
  fields.file.addEventListener('change', validateFile);

  // Submit
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const checks = [
      validateType(), validateName(), validatePhone(), validateEmail(),
      validateSubject(), validateMessage(), validatePrivacy(), validateFile()
    ];

    const isValid = checks.every(Boolean);

    if (!isValid) {
      statusEl.style.display = 'block';
      statusEl.className = '';
      statusEl.classList.add('error');
      statusEl.style.background = '#fee2e2'; statusEl.style.color = '#991b1b';
      statusEl.style.border = '1px solid #fecaca'; statusEl.style.padding = '12px';
      statusEl.textContent = '❌ Fix errors above - enquiry not sent';
      statusEl.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    // Valid - Loading
    submitBtn.disabled = true;
    btnText.textContent = '⏳ Sending...';
    statusEl.style.display = 'block';
    statusEl.style.background = '#dcfce7'; statusEl.style.color = '#166534';
    statusEl.style.border = '1px solid #bbf7d0'; statusEl.style.padding = '12px';
    statusEl.textContent = '✅ Enquiry validated - saving...';

    // Build enquiry object
    const contactMethod = document.querySelector('input[name="contactMethod"]:checked')?.value || 'WhatsApp';
    const enquiryData = {
      id: 'ENQ-' + Date.now(),
      type: fields.type.value,
      name: fields.name.value.trim(),
      phone: fields.phone.value.trim(),
      email: fields.email.value.trim(),
      subject: fields.subject.value.trim(),
      message: fields.message.value.trim(),
      budget: fields.budget.value || 'Not specified',
      contactMethod,
      fileName: fields.file.files[0]?.name || 'No attachment',
      date: new Date().toLocaleString('en-ZA'),
      status: 'New'
    };

    // Save to localStorage (simulates database)
    let enquiries = JSON.parse(localStorage.getItem('enquiries') || '[]');
    enquiries.unshift(enquiryData); // newest first
    localStorage.setItem('enquiries', JSON.stringify(enquiries));

    // Simulate server delay + WhatsApp
    setTimeout(() => {
      const waMsg = `📩 NEW ENQUIRY - Crystal Park Gas\n\nID: ${enquiryData.id}\nType: ${enquiryData.type}\nName: ${enquiryData.name}\nPhone: ${enquiryData.phone}\nEmail: ${enquiryData.email}\nSubject: ${enquiryData.subject}\nBudget: ${enquiryData.budget}\nContact via: ${enquiryData.contactMethod}\nMessage: ${enquiryData.message}\nDate: ${enquiryData.date}\nFile: ${enquiryData.fileName}`;

      const waUrl = `https://wa.me/27712345678?text=${encodeURIComponent(waMsg)}`;
      
      statusEl.textContent = `✅ Enquiry ${enquiryData.id} saved! Opening ${contactMethod}... Total enquiries: ${enquiries.length}`;
      
      if (contactMethod === 'WhatsApp' || contactMethod === 'Phone Call') {
        window.open(waUrl, '_blank');
      } else {
        // Email
        const mailto = `mailto:info@crystalparkgas.co.za?subject=${encodeURIComponent(enquiryData.subject)}&body=${encodeURIComponent(waMsg)}`;
        window.location.href = mailto;
      }

      // Reset after 4s
      setTimeout(() => {
        form.reset();
        document.querySelectorAll('.valid,.invalid').forEach(el => el.classList.remove('valid','invalid'));
        document.querySelectorAll('.error-msg').forEach(el => el.classList.remove('show'));
        subjectCount.textContent = '0'; messageCount.textContent = '0';
        btnText.textContent = '📩 Send Enquiry';
        submitBtn.disabled = false;
        statusEl.style.display = 'none';
      }, 4000);
    }, 1200);
  });

  console.log('Enquiry Validation Loaded ✓ - File + XSS + Counters');
});
// === AFTER validation passes, replace the old setTimeout with this ===
    
    // Show processing steps
    const steps = [
      '✅ Validated - Saving enquiry...',
      '💾 Saved to database - Generating ID...',
      '📧 Sending confirmation...',
      `✅ Enquiry ${enquiryData.id} sent!`
    ];
    let stepIndex = 0;
    
    const stepInterval = setInterval(() => {
      if (stepIndex < steps.length) {
        statusEl.textContent = steps[stepIndex];
        stepIndex++;
      } else {
        clearInterval(stepInterval);
        finalResponse(enquiryData, contactMethod, waUrl);
      }
    }, 600);

    function finalResponse(data, method, waUrl) {
      statusEl.innerHTML = `
        <div style="display:flex;gap:10px;align-items:start;">
          <span style="font-size:24px;">✅</span>
          <div>
            <strong>Enquiry Received! ID: ${data.id}</strong><br>
            <small>
              Type: ${data.type}<br>
              We will respond via <strong>${method}</strong> within <strong>5 minutes</strong>.<br>
              <span style="color:#16a34a;">●</span> Status: <span id="enqStatus">New - Queued</span><br>
              <span style="color:#64748b;">Saved locally • Total enquiries: ${enquiries.length}</span>
            </small>
            <div style="margin-top:8px;display:flex;gap:8px;">
              <button onclick="window.open('${waUrl}','_blank')" style="padding:6px 12px;border-radius:6px;border:1px solid #16a34a;background:#f0fdf4;cursor:pointer;font-size:12px;">Open WhatsApp Again</button>
              <button onclick="document.getElementById('enquiryStatus').style.display='none'" style="padding:6px 12px;border-radius:6px;border:1px solid #e2e8f0;background:white;cursor:pointer;font-size:12px;">Dismiss</button>
            </div>
          </div>
        </div>
      `;

      // Auto-update status simulation (like real backend)
      setTimeout(() => {
        const statusEl2 = document.getElementById('enqStatus');
        if (statusEl2) statusEl2.textContent = 'Seen - Admin notified';
        statusEl2.style.color = '#2563eb';
      }, 3000);
      setTimeout(() => {
        const statusEl2 = document.getElementById('enqStatus');
        if (statusEl2) {
          statusEl2.textContent = 'Replied - Check WhatsApp/Email';
          statusEl2.style.color = '#16a34a';
        }
      }, 8000);

      // Browser notification (if allowed)
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Crystal Park Gas - Enquiry Received', {
          body: `${data.id}: We will reply in 5 mins via ${method}`,
          icon: 'images/logo.png'
        });
      } else if ('Notification' in window && Notification.permission !== 'denied') {
        Notification.requestPermission();
      }

      // Actual send
      if (method === 'WhatsApp' || method === 'Phone Call') {
        window.open(waUrl, '_blank');
      } else {
        const mailto = `mailto:${data.email}?subject=Re: ${encodeURIComponent(data.subject)} - ${data.id}&body=${encodeURIComponent(`Hi ${data.name},\n\nThanks for enquiry ${data.id} (${data.type}).\n\nWe received: "${data.message}"\n\nOur team will reply within 5 mins during business hours (7am-7pm).\n\n- Crystal Park Gas Team\n071 234 5678`)}`;
        // For lecturer demo, we open WhatsApp even for email + show mailto link
        console.log('Email would send:', mailto);
        window.open(waUrl, '_blank');
      }
    }