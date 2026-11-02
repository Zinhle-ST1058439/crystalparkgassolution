ENQUIRY PROCESS & RESPONSE - Crystal Park Gas

1. FRONTEND VALIDATION (enquiry.html)
   - 8 fields validated: type, name (regex), phone (SA), email, subject 5-100 chars, message 20-500 chars, file 2MB, privacy
   - XSS blocked: <script> detection
   - Real-time: counters, file check, green/red

2. SUBMISSION PROCESS
   - On submit: validate all → show 4-step progress (Validated → Saving → Sending → Sent)
   - Generate ID: ENQ- + timestamp (e.g., ENQ-1712012345678)
   - Save to localStorage: enquiries array (newest first) - simulates DB
   - Save fields: id, type, name, phone, email, subject, message, budget, contactMethod, fileName, date, status=New

3. AUTO-RESPONSE (Immediate)
   - On-page: Success card with ID, status "New - Queued", 5-min promise
   - Browser Notification API: "Enquiry Received"
   - WhatsApp API: Pre-filled message to 27712345678 with all data
   - Email fallback: mailto link with subject + body
   - Redirect option: enquiry-response.html with status tracker

4. ADMIN PROCESS (admin.html)
   - Dashboard: Total, New, Replied counts
   - Table: ID, date, type, customer, subject, status badge
   - Actions: Mark Seen (blue), Replied (green), Delete
   - Status flow: New → Seen (2 mins) → Replied (5 mins) → Closed (after delivery)
   - Different handling by type:
     * Price Enquiry → Send quote PDF
     * Bulk Order → Manager calls + discount
     * Complaint → Manager calls 30 mins + escalation
     * Delivery Zone → Check map + reply

5. RESPONSE SLA
   - WhatsApp: 5 mins (business hours 7am-7pm)
   - Email: 30 mins
   - Complaint: 30 mins call
   - Bulk: 1 hour quote

6. SECURITY
   - XSS protection, file type/size, max length, no SQL (localStorage)
   - Privacy checkbox required

Demo: Fill enquiry.html → See ID → Check admin.html → Status updates