// ADD THIS after enquiryData creation, before WhatsApp:

      // SEND EMAIL PROCESS
      if (window.ContactEmailProcess) {
        const emailResult = await window.ContactEmailProcess.send(enquiryData);
        console.log('Email process result:', emailResult);
        // Continue to WhatsApp even if email fails (fallback)
      }