/**
 * Google Apps Script Web App Backend for Nusrat Jahan's Nutritionist Portfolio
 * 
 * SETUP INSTRUCTIONS:
 * 1. Open your Google Spreadsheet: "Nusrat's Portfolio Inquiries"
 * 2. In Row 1 of your sheet tab (e.g. "Sheet1" or "Inquiries"), set headers:
 *    [A1: Timestamp, B1: Name, C1: Email, D1: Subject, E1: Message]
 * 3. Click Extensions -> Apps Script
 * 5. Paste this entire code into Code.gs
 * 6. Replace TO_EMAIL with your desired inbox address
 * 7. Click "Deploy" -> "New deployment"
 * 8. Configuration:
 *    - Type: Web app
 *    - Description: Portfolio Contact Form API
 *    - Execute as: Me (your Google account)
 *    - Who has access: Anyone
 * 9. Click "Deploy" and authorize the requested permissions
 * 10. Copy the Web App URL and set it in script.js (GAS_ENDPOINT)
 */

const TO_EMAIL = "nusrat.j.nisha@gmail.com";

function doPost(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    // Target the specific tab or fall back to the active tab
    const sheet = ss.getSheetByName("Nusrat's Portfolio Inquiries") || 
                  ss.getSheetByName("Inquiries") || 
                  ss.getSheets()[0];
    const data = JSON.parse(e.postData.contents);
    // Honeypot spam detection
    if (data.website) {
      return ContentService.createTextOutput(JSON.stringify({
        result: "error",
        message: "Spam detected"
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // 1. Append inquiry to Google Sheet
    sheet.appendRow([
      new Date(),
      data.name || "",
      data.email || "",
      data.subject || "",
      data.message || ""
    ]);

    // 2. Send instant email notification
    MailApp.sendEmail({
      to: TO_EMAIL,
      subject: `[New Inquiry] ${data.subject || "Consultation Request"} - ${data.name || "Visitor"}`,
      body: `You received a new inquiry from your nutritionist portfolio:\n\n` +
            `Name: ${data.name}\n` +
            `Email: ${data.email}\n` +
            `Subject: ${data.subject}\n\n` +
            `Message:\n${data.message}\n\n` +
            `Submitted on: ${new Date().toLocaleString()}`
    });

    return ContentService.createTextOutput(JSON.stringify({
      result: "success"
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      result: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: "ok",
    message: "Nutritionist Portfolio Contact Endpoint is Active"
  })).setMimeType(ContentService.MimeType.JSON);
}
