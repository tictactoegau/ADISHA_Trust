/************************************************************
 * ADISHA Footer Contact Form Handler
 * ----------------------------------------------------------
 * Works with:
 * GitHub Pages frontend
 * Google Apps Script backend
 *
 * Important:
 * The Web App URL below must be the current Apps Script
 * deployment URL from:
 * Apps Script → Deploy → Manage deployments → Web app URL
 ************************************************************/

const ADISHA_CONTACT_BACKEND_URL =
  "https://script.google.com/macros/s/AKfycbyhL9ODuq1UpMN-4VoQzQUxQ04FCo4UtN0Sm6z-Wdi6y3mRIeIvneA9vJKR0ELM-kbk5A/exec";


/************************************************************
 * BASIC EMAIL VALIDATION
 ************************************************************/

function isValidFooterEmail(email) {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(email);
}


/************************************************************
 * STATUS MESSAGE
 ************************************************************/

function showFooterFormStatus(statusElement, message, success) {
  if (!statusElement) {
    return;
  }

  statusElement.textContent = message;

  if (success) {
    statusElement.classList.remove("is-error");
    statusElement.classList.add("is-success");
  } else {
    statusElement.classList.remove("is-success");
    statusElement.classList.add("is-error");
  }
}


/************************************************************
 * RESET CHARACTER COUNT
 ************************************************************/

function resetFooterMessageCount(form) {
  const count = form.querySelector(".footer-message-count");

  if (count) {
    count.textContent = "0";
  }
}


/************************************************************
 * SUBMIT HANDLER
 ************************************************************/

function handleFooterContactSubmit(event) {
  event.preventDefault();

  const form = event.target;

  const status = form.querySelector(".footer-form-status");
  const submitButton = form.querySelector("button[type='submit']");

  const nameInput = form.querySelector('input[name="contact_name"]');
  const emailInput = form.querySelector('input[name="contact_email"]');
  const messageInput = form.querySelector('textarea[name="contact_message"]');

  const name = nameInput ? nameInput.value.trim() : "";
  const email = emailInput ? emailInput.value.trim() : "";
  const message = messageInput ? messageInput.value.trim() : "";

  if (!name || name.length < 2) {
    showFooterFormStatus(status, "Please enter your name.", false);
    return;
  }

  if (!isValidFooterEmail(email)) {
    showFooterFormStatus(status, "Please enter a valid email address.", false);
    return;
  }

  if (!message || message.length < 5) {
    showFooterFormStatus(status, "Please enter a short message.", false);
    return;
  }

  if (message.length > 500) {
    showFooterFormStatus(status, "Please keep your message under 500 characters.", false);
    return;
  }

  if (!ADISHA_CONTACT_BACKEND_URL || ADISHA_CONTACT_BACKEND_URL.indexOf("script.google.com") === -1) {
    showFooterFormStatus(status, "Contact backend URL is missing.", false);
    return;
  }

  if (submitButton) {
    submitButton.disabled = true;
    submitButton.textContent = "Sending...";
  }

  showFooterFormStatus(status, "Sending message...", true);

  const payload = {
    name: name,
    email: email,
    message: message,
    source: window.location.href || "ADISHA website footer form",
    submittedFrom: window.location.hostname || "Website"
  };

  /*
    Apps Script often requires no-cors from GitHub Pages.
    Because of no-cors, the browser cannot read the real Apps Script response.
    Confirm delivery in Apps Script → Executions by looking for doPost.
  */

  fetch(ADISHA_CONTACT_BACKEND_URL, {
    method: "POST",
    mode: "no-cors",
    cache: "no-store",
    headers: {
      "Content-Type": "text/plain;charset=utf-8"
    },
    body: JSON.stringify(payload)
  })
    .then(function () {
      form.reset();
      resetFooterMessageCount(form);
      showFooterFormStatus(status, "Thank you for the message.", true);

      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = "Submit";
      }
    })
    .catch(function (error) {
      console.error("ADISHA contact form error:", error);

      showFooterFormStatus(
        status,
        "Unable to send message. Please try again or email us directly.",
        false
      );

      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = "Submit";
      }
    });
}


/************************************************************
 * INITIALIZE FOOTER CONTACT FORM
 ************************************************************/

function initializeFooterContactForms() {
  const forms = document.querySelectorAll(".footer-contact-form");

  if (!forms || forms.length === 0) {
    console.warn("No .footer-contact-form found on this page.");
    return;
  }

  forms.forEach(function (form) {
    if (form.dataset.initialized === "true") {
      return;
    }

    form.dataset.initialized = "true";

    const textarea = form.querySelector('textarea[name="contact_message"]');
    const count = form.querySelector(".footer-message-count");

    if (textarea && count) {
      count.textContent = textarea.value.length || "0";

      textarea.addEventListener("input", function () {
        count.textContent = textarea.value.length;
      });
    }

    form.addEventListener("submit", handleFooterContactSubmit);
  });

  console.log("ADISHA contact form initialized.");
}


/************************************************************
 * RUN INIT
 ************************************************************/

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeFooterContactForms);
} else {
  initializeFooterContactForms();
}