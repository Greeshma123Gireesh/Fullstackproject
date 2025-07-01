const API_BASE = "http://127.0.0.1:5000";  // Update if your backend runs on a different port

// ✅ Save new language resources to DB
function saveResources() {
  const lang = document.getElementById("language").value.trim();
  const res = document.getElementById("resources").value.trim().split('\n').filter(Boolean);
  const checklist = document.getElementById("checklist").value.trim().split('\n').filter(Boolean);

  if (!lang || res.length === 0) {
    alert("Please fill both language and resources.");
    return;
  }

  fetch(`${API_BASE}/save_resources`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ language: lang, resources: res, checklist: checklist })
  })
  .then(res => res.json())
  .then(data => {
    alert(data.message);
    document.getElementById("language").value = "";
    document.getElementById("resources").value = "";
    document.getElementById("checklist").value = "";
    loadAllLanguages();
  })
  .catch(err => {
    console.error("Error saving resources:", err);
    alert("Failed to save resources.");
  });
}

// ✅ Load all languages and populate cards + dropdowns
function loadAllLanguages() {
  fetch(`${API_BASE}/get_all_languages`)
    .then(res => res.json())
    .then(data => {
      const list = document.getElementById("languageList");
      const updateSelect = document.getElementById("updateLangSelect");
      const deleteSelect = document.getElementById("deleteLangSelect");

      list.innerHTML = "";
      updateSelect.innerHTML = "";
      deleteSelect.innerHTML = "";

      data.forEach(({ language, resources, checklist }) => {
        // Update dropdowns
        const opt1 = new Option(language, language);
        const opt2 = new Option(language, language);
        updateSelect.appendChild(opt1);
        deleteSelect.appendChild(opt2);

        // Render language card
        const card = document.createElement("div");
        card.classList.add("language-card");

        const checklistHtml = checklist.map(item =>
          item.startsWith("  ") || item.startsWith("- ")
            ? `<li class="subtopic">${item.trim()}</li>`
            : `<li><strong>${item}</strong></li>`
        ).join('');

        card.innerHTML = `
          <h4>${language}</h4>
          <strong>Resources:</strong>
          <ul>${resources.map(r => `<li><a href="${r}" target="_blank">${r}</a></li>`).join('')}</ul>
          <strong>Checklist:</strong>
          <ul>${checklistHtml}</ul>
        `;
        list.appendChild(card);
      });
    });
}

// ✅ Load resources into update fields
function loadResourcesToUpdate() {
  const lang = document.getElementById("updateLangSelect").value;

  fetch(`${API_BASE}/get_all_languages`)
    .then(res => res.json())
    .then(data => {
      const match = data.find(item => item.language === lang);
      if (!match) return;

      const updateContainer = document.getElementById("updateResourcesContainer");
      updateContainer.innerHTML = "";

      match.resources.forEach((resource, index) => {
        const div = document.createElement("div");
        div.innerHTML = `
          <input type="text" value="${resource}" id="resource-${lang}-${index}" />
          <span class="remove-btn" onclick="removeResource(${index})">Remove</span>
        `;
        updateContainer.appendChild(div);
      });

      document.getElementById("updateChecklist").value = match.checklist.join('\n');
    });
}

// ✅ Remove a resource field (just from DOM temporarily)
function removeResource(index) {
  const lang = document.getElementById("updateLangSelect").value;
  const input = document.getElementById(`resource-${lang}-${index}`);
  if (input) input.parentElement.remove();
}

// ✅ Update resources/checklist in DB
function updateResources() {
  const lang = document.getElementById("updateLangSelect").value;
  const updateContainer = document.getElementById("updateResourcesContainer");
  const checklist = document.getElementById("updateChecklist").value.trim().split('\n').filter(Boolean);

  const inputs = updateContainer.querySelectorAll("input");
  const updatedResources = Array.from(inputs).map(i => i.value.trim()).filter(Boolean);

  fetch(`${API_BASE}/update_resources`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ language: lang, resources: updatedResources, checklist: checklist })
  })
  .then(res => res.json())
  .then(data => {
    alert(data.message);
    loadAllLanguages();
  })
  .catch(err => {
    console.error("Update failed:", err);
    alert("Failed to update resources.");
  });
}

// ✅ Delete a language
function deleteLanguage() {
  const lang = document.getElementById("deleteLangSelect").value;

  fetch(`${API_BASE}/delete_language?language=${encodeURIComponent(lang)}`, {
    method: "DELETE"
  })
  .then(res => res.json())
  .then(data => {
    alert(data.message);
    loadAllLanguages();
  })
  .catch(err => {
    console.error("Delete failed:", err);
    alert("Failed to delete language.");
  });
}

// ✅ Logout and return to index
function logout() {
  alert("Logged out!");
  window.location.href = "../frontend/index.html";
}

// 🚀 Initial Load
loadAllLanguages();
