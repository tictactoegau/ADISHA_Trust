/************************************************************
 * ADISHA Footer Contact Form Handler
 * ----------------------------------------------------------
 * Works with GitHub Pages.
 * Sends name, email, and message to Google Apps Script.
 ************************************************************/

const ADISHA_CONTACT_BACKEND_URL = "https://script.google.com/macros/s/AKfycbxj7HkSCg_e4vursbrbiR7QE9CZ3N_2Hf2m-IPpJxqRI2I6R0l4qsRQe-IaRPQlNIsi/exec";

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

  if (submitButton) {
    submitButton.disabled = true;
    submitButton.textContent = "Sending...";
  }

  showFooterFormStatus(status, "Sending message...", true);

  fetch(ADISHA_CONTACT_BACKEND_URL, {
    method: "POST",
    mode: "no-cors",
    headers: {
      "Content-Type": "text/plain;charset=utf-8"
    },
    body: JSON.stringify({
      name: name,
      email: email,
      message: message,
      source: window.location.pathname || "Website footer form"
    })
  })
    .then(function () {
      form.reset();
      resetFooterMessageCount(form);
      showFooterFormStatus(status, "Thank you. Your message has been submitted.", true);
    })
    .catch(function () {
      showFooterFormStatus(status, "Unable to send message. Please email us directly.", false);
    })
    .finally(function () {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = "Submit";
      }
    });
}

function isValidFooterEmail(email) {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(email);
}

function showFooterFormStatus(statusElement, message, success) {
  if (!statusElement) return;
  statusElement.textContent = message;
  statusElement.classList.toggle("is-error", !success);
  statusElement.classList.toggle("is-success", success);
}

function resetFooterMessageCount(form) {
  const count = form.querySelector(".footer-message-count");
  if (count) count.textContent = "0";
}

function initializeFooterContactForms() {
  const forms = document.querySelectorAll(".footer-contact-form");

  forms.forEach(function (form) {
    const textarea = form.querySelector('textarea[name="contact_message"]');
    const count = form.querySelector(".footer-message-count");

    if (textarea && count) {
      textarea.addEventListener("input", function () {
        count.textContent = textarea.value.length;
      });
    }

    form.addEventListener("submit", handleFooterContactSubmit);
  });
}

document.addEventListener("DOMContentLoaded", initializeFooterContactForms);
