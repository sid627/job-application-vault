const API_URL = "http://job-application-vault-production.up.railway.app/api/jobs";

const form = document.querySelector("#job-form");
const saveButton = document.querySelector("#save-button");
const discardButton = document.querySelector("#discard-button");
const statusMessage = document.querySelector("#status");
const detailsView = document.querySelector("#details-view");
const feedbackView = document.querySelector("#feedback-view");
const feedbackIcon = document.querySelector("#feedback-icon");
const feedbackTitle = document.querySelector("#feedback-title");
const feedbackMessage = document.querySelector("#feedback-message");
let feedbackTimer;

function setStatus(message, type = "") {
  statusMessage.textContent = message;
  statusMessage.className = type;
}

function populateForm(job) {
  for (const field of ["jobTitle", "companyName", "location", "jobUrl", "description"]) {
    const input = form.elements.namedItem(field);
    if (input && job[field]) {
      input.value = job[field];
    }
  }
}

function clearFeedback() {
  feedbackView.classList.add("hidden");
}

function showFeedback(title, message, icon, duration) {
  clearTimeout(feedbackTimer);
  detailsView.classList.add("hidden");
  feedbackIcon.textContent = icon;
  feedbackTitle.textContent = title;
  feedbackMessage.textContent = message;
  feedbackView.classList.remove("hidden");
  feedbackTimer = setTimeout(clearFeedback, duration);
}

async function extractFromActiveTab() {
  const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
  if (!tab?.id || !tab.url?.startsWith("http")) {
    throw new Error("Open a regular web page before saving a job.");
  }

  await chrome.scripting.executeScript({
    target: {tabId: tab.id},
    files: ["content.js"]
  });

  return chrome.tabs.sendMessage(tab.id, {type: "EXTRACT_JOB"});
}

async function initialize() {
  try {
    const result = await extractFromActiveTab();
    if (!result?.ok) {
      throw new Error(result?.error || "The page could not be read.");
    }
    populateForm(result.job);
    setStatus("Review the extracted details before saving.");
  } catch (error) {
    setStatus(error.message || "The page could not be read. Enter the details manually.", "error");
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!form.reportValidity()) {
    return;
  }

  const data = new FormData(form);
  const request = {
    jobTitle: data.get("jobTitle").trim(),
    companyName: data.get("companyName").trim(),
    location: data.get("location").trim(),
    jobUrl: data.get("jobUrl").trim(),
    description: data.get("description").trim()
  };

  saveButton.disabled = true;
  discardButton.disabled = true;
  setStatus("Saving…");

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(request)
    });

    const responseBody = await response.json().catch(() => null);

    if (!response.ok) {
      const fieldErrors = Object.values(responseBody?.validationErrors || {});
      const message = fieldErrors.length > 0
        ? fieldErrors.join("; ")
        : responseBody?.message || `Backend returned HTTP ${response.status}.`;
      throw new Error(message);
    }

    showFeedback(
      "Job saved successfully",
      "The job is now in your application vault.",
      "✓",
      3000
    );
  } catch (error) {
    const message = error instanceof TypeError
      ? "Cannot reach the backend at localhost:8080. Make sure Spring Boot and MySQL are running."
      : error.message || "The job could not be saved.";
    setStatus(message, "error");
  } finally {
    saveButton.disabled = false;
    discardButton.disabled = false;
  }
});

discardButton.addEventListener("click", () => {
  form.reset();
  showFeedback("Job discarded", "Nothing was saved.", "×", 1500);
});

initialize();
