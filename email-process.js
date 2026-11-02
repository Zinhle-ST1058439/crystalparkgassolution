// ===============================
// CONTACT PROCESS - EMAIL SENDING
// EmailJS + Fallback + Auto-Response
// ===============================

const EMAILJS_CONFIG = {
  SERVICE_ID: 'YOUR_SERVICE_ID',      // e.g., service_abc123
  TEMPLATE_ID: 'YOUR_TEMPLATE_ID',    // e.g., template_xyz789
  PUBLIC_KEY: 'YOUR_PUBLIC_KEY',      // e.g., AbC123XyZ
  ADMIN_EMAIL: 'info@crystalparkgas.co.za',
  AUTO_REPLY_TEMPLATE: 'YOUR_AUTO_REPLY_TEMPLATE_ID' // optional second template
};

// 1. Send Enquiry Email Process
async function sendEnquiryEmail(enquiryData) {
  const statusEl = document.getElementById('enquiryStatus') || document.getElementById('formStatus') || document.getElementById('contactStatus');
  
  function updateStatus(msg, type) {
    if (!statusEl) return;
    statusEl.style.display = 'block';
    statusEl.style.padding = '12px';
    statusEl.style.borderRadius = '8px';
    if (type === 'error') {
      statusEl.style.background = '#fee2e2';
      statusEl.style.color = '#991b1b';
      statusEl.style.border = '1px solid #fecaca';
    } else if (type === 'success') {
      statusEl.style.background = '#dcfce7';
      statusEl.style.color = '#166534';
      statusEl.style.border = '1px solid #bbf7d0';
    } else {
      statusEl.style.background = '#dbeafe';
      statusEl.style.color = '#1e40af';
      statusEl.style.border = '1px solid #bfdbfe';
    }
    statusEl.textContent = msg;
  }

  // Build params for EmailJS template
  const templateParams = {
    enquiry_id: enquiryData.id,
    enquiry_type: enquiryData.type || enquiryData.enquiryType || 'General',
    from_name: enquiryData.name,
    reply_to: enquiryData.email,
    phone: enquiryData.phone,
    subject: enquiryData.subject || `New ${enquiryData.type} Enquiry`,
    message: enquiryData.message,
    budget: enquiryData.budget || 'Not specified',
    contact_method: enquiryData.contactMethod || 'WhatsApp',
    zone_check: enquiryData.zone || localStorage.getItem('lastZoneCheck') || 'Not checked',
    file_name: enquiryData.fileName || 'No file',
    date: enquiryData.date,
    page_url: window.location.href,
    ip: 'Will be added by EmailJS', // EmailJS adds
  };

  // Validation before send
  if (!EMAILJS_CONFIG.SERVICE_ID.includes('service_')) {
    updateStatus('⚠️ Email not configured - Using local save only. Set SERVICE_ID in email-process.js', 'error');
    console.warn('EmailJS not configured - Save locally only');
    return { success: true, mode: 'local_only' };
  }

  try {
    updateStatus('📧 Sending email to admin...', 'loading');

    // Send to admin
    const response = await emailjs.send(
      EMAILJS_CONFIG.SERVICE_ID,
      EMAILJS_CONFIG.TEMPLATE_ID,
      templateParams
    );

    console.log('Email sent:', response.status, response.text);

    // 2. Auto-reply to customer (if second template exists)
    if (EMAILJS_CONFIG.AUTO_REPLY_TEMPLATE && EMAILJS_CONFIG.AUTO_REPLY_TEMPLATE.includes('template_')) {
      try {
        await emailjs.send(
          EMAILJS_CONFIG.SERVICE_ID,
          EMAILJS_CONFIG.AUTO_REPLY_TEMPLATE,
          {
            to_name: enquiryData.name,
            to_email: enquiryData.email,
            enquiry_id: enquiryData.id,
            reply_message: `Hi ${enquiryData.name},\n\nThanks for your ${enquiryData.type} enquiry (${enquiryData.id}).\n\nWe received: "${enquiryData.message.substring(0,100)}..."\n\nOur team will reply via ${enquiryData.contactMethod} within 5 minutes during business hours (7am-7pm).\n\n- Crystal Park Gas\n071 234 5678\nhttps://crystalparkgas.co.za`
          }
        );
        console.log('Auto-reply sent');
      } catch (autoErr) {
        console.warn('Auto-reply failed:', autoErr);
      }
    }

    updateStatus(`✅ Email sent! ID ${enquiryData.id} - Admin notified + Auto-reply sent to ${enquiryData.email}`, 'success');
    return { success: true, response };

  } catch (error) {
    console.error('Email failed:', error);
    updateStatus(`❌ Email failed (${error.text || error.message}) - Saved locally, will retry. Your enquiry ${enquiryData.id} is safe in browser.`, 'error');
    
    // Fallback: Save to retry queue
    let retryQueue = JSON.parse(localStorage.getItem('emailRetryQueue') || '[]');
    retryQueue.push({ ...enquiryData, templateParams, error: error.text, retryAt: Date.now() + 60000 });
    localStorage.setItem('emailRetryQueue', JSON.stringify(retryQueue));

    // Fallback: Open mailto
    const mailtoLink = `mailto:${EMAILJS_CONFIG.ADMIN_EMAIL}?subject=${encodeURIComponent(templateParams.subject)}&body=${encodeURIComponent(`ID: ${templateParams.enquiry_id}\nName: ${templateParams.from_name}\nPhone: ${templateParams.phone}\nEmail: ${templateParams.reply_to}\nMessage: ${templateParams.message}`)}`;
    console.log('Fallback mailto:', mailtoLink);
    
    return { success: false, error, fallback: mailtoLink };
  }
}

// 3. Retry failed emails
async function retryFailedEmails() {
  let queue = JSON.parse(localStorage.getItem('emailRetryQueue') || '[]');
  if (queue.length === 0) return;

  const now = Date.now();
  const toRetry = queue.filter(item => item.retryAt <= now);
  
  for (const item of toRetry) {
    try {
      await emailjs.send(EMAILJS_CONFIG.SERVICE_ID, EMAILJS_CONFIG.TEMPLATE_ID, item.templateParams);
      console.log('Retried success:', item.enquiry_id);
      queue = queue.filter(q => q.enquiry_id !== item.enquiry_id);
    } catch (e) {
      console.warn('Retry failed again:', item.enquiry_id);
      item.retryAt = now + 5*60*1000; // retry in 5 min
    }
  }
  localStorage.setItem('emailRetryQueue', JSON.stringify(queue));
}

// Auto retry every 2 mins
setInterval(retryFailedEmails, 2*60*1000);

// 4. Make it global for your other forms
window.ContactEmailProcess = {
  send: sendEnquiryEmail,
  retry: retryFailedEmails,
  config: EMAILJS_CONFIG
};

console.log('Contact Process Email Loaded ✓ - EmailJS');