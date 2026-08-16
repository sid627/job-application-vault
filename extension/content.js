(() => {
  if (globalThis.__jobApplicationVaultLoaded) {
    return;
  }
  globalThis.__jobApplicationVaultLoaded = true;

  const cleanText = (value, maxLength = 10000) => {
    if (!value) {
      return "";
    }

    const parsed = new DOMParser().parseFromString(String(value), "text/html");
    return (parsed.body.textContent || "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, maxLength);
  };

  const firstText = (selectors, maxLength) => {
    for (const selector of selectors) {
      const element = document.querySelector(selector);
      const value = cleanText(element?.textContent, maxLength);
      if (value) {
        return value;
      }
    }
    return "";
  };

  const metaContent = (selectors, maxLength) => {
    for (const selector of selectors) {
      const value = cleanText(document.querySelector(selector)?.content, maxLength);
      if (value) {
        return value;
      }
    }
    return "";
  };

  function findJobPosting(value) {
    if (!value || typeof value !== "object") {
      return null;
    }

    if (Array.isArray(value)) {
      for (const item of value) {
        const match = findJobPosting(item);
        if (match) return match;
      }
      return null;
    }

    const types = Array.isArray(value["@type"]) ? value["@type"] : [value["@type"]];
    if (types.some((type) => String(type).toLowerCase() === "jobposting")) {
      return value;
    }

    return findJobPosting(value["@graph"]);
  }

  function getStructuredJob() {
    for (const script of document.querySelectorAll('script[type="application/ld+json"]')) {
      try {
        const job = findJobPosting(JSON.parse(script.textContent));
        if (job) return job;
      } catch {
        // Ignore invalid JSON-LD and continue with other extraction strategies.
      }
    }
    return {};
  }

  function getLocation(job) {
    const location = Array.isArray(job.jobLocation) ? job.jobLocation[0] : job.jobLocation;
    const address = location?.address || location;
    if (typeof address === "string") {
      return cleanText(address, 255);
    }
    return [address?.addressLocality, address?.addressRegion, address?.addressCountry]
      .filter(Boolean)
      .map((part) => cleanText(part, 100))
      .join(", ")
      .slice(0, 255);
  }

  function extractJob() {
    const structured = getStructuredJob();
    return {
      jobTitle: cleanText(structured.title, 255)
        || metaContent(['meta[property="og:title"]', 'meta[name="twitter:title"]'], 255)
        || firstText(["h1", '[class*="job-title"]', '[data-testid*="job-title"]'], 255)
        || cleanText(document.title, 255),
      companyName: cleanText(structured.hiringOrganization?.name, 255)
        || metaContent(['meta[property="og:site_name"]', 'meta[name="author"]'], 255)
        || firstText(['[class*="company-name"]', '[class*="companyName"]', '[data-testid*="company"]'], 255),
      location: getLocation(structured)
        || metaContent(['meta[name="job-location"]', 'meta[property="job:location"]'], 255)
        || firstText(['[class*="job-location"]', '[class*="jobLocation"]', '[data-testid*="location"]'], 255),
      jobUrl: window.location.href,
      description: cleanText(structured.description)
        || metaContent(['meta[name="description"]', 'meta[property="og:description"]'], 10000)
        || firstText([
          '[class*="job-description"]',
          '[class*="jobDescription"]',
          '[data-testid*="job-description"]',
          "article main",
          "main article"
        ], 10000)
    };
  }

  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message?.type !== "EXTRACT_JOB") {
      return false;
    }

    try {
      sendResponse({ok: true, job: extractJob()});
    } catch (error) {
      sendResponse({ok: false, error: error.message || "Extraction failed."});
    }
    return false;
  });
})();
