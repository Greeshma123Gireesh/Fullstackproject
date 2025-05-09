function saveResources() {
    const lang = document.getElementById("language").value.trim();
    const res = document.getElementById("resources").value.trim().split('\n').filter(Boolean);
    const checklist = document.getElementById("checklist").value.trim().split('\n').filter(Boolean);

    if (!lang || res.length === 0) {
      alert("Please fill both language and resources.");
      return;
    }

    let allResources = JSON.parse(localStorage.getItem("skillResources") || "{}");
    let allChecklists = JSON.parse(localStorage.getItem("skillChecklists") || "{}");

    allResources[lang] = (allResources[lang] || []).concat(res);
    allChecklists[lang] = (allChecklists[lang] || []).concat(checklist);

    localStorage.setItem("skillResources", JSON.stringify(allResources));
    localStorage.setItem("skillChecklists", JSON.stringify(allChecklists));

    alert("Resources and checklist saved for " + lang);
    document.getElementById("language").value = "";
    document.getElementById("resources").value = "";
    document.getElementById("checklist").value = "";
    refreshDropdowns();
    displayLanguages();
  }

  function loadResourcesToUpdate() {
    const lang = document.getElementById("updateLangSelect").value;
    let allResources = JSON.parse(localStorage.getItem("skillResources") || "{}");
    let allChecklists = JSON.parse(localStorage.getItem("skillChecklists") || "{}");

    const updateContainer = document.getElementById("updateResourcesContainer");
    updateContainer.innerHTML = '';

    if (allResources[lang]) {
      allResources[lang].forEach((resource, index) => {
        const div = document.createElement('div');
        div.innerHTML = `
          <input type="text" value="${resource}" id="resource-${lang}-${index}" />
          <span class="remove-btn" onclick="removeResource('${lang}', ${index})">Remove</span>
        `;
        updateContainer.appendChild(div);
      });
    }

    document.getElementById("updateChecklist").value = (allChecklists[lang] || []).join('\n');
  }

  function removeResource(lang, index) {
    let allResources = JSON.parse(localStorage.getItem("skillResources") || "{}");

    if (allResources[lang]) {
      allResources[lang].splice(index, 1);
      localStorage.setItem("skillResources", JSON.stringify(allResources));
    }

    loadResourcesToUpdate();
  }

  function updateResources() {
    const lang = document.getElementById("updateLangSelect").value;
    const updateContainer = document.getElementById("updateResourcesContainer");
    const checklist = document.getElementById("updateChecklist").value.trim().split('\n').filter(Boolean);

    let allResources = JSON.parse(localStorage.getItem("skillResources") || "{}");
    let allChecklists = JSON.parse(localStorage.getItem("skillChecklists") || "{}");
    const updatedResources = [];

    const inputs = updateContainer.querySelectorAll('input');
    inputs.forEach(input => {
      const value = input.value.trim();
      if (value) updatedResources.push(value);
    });

    allResources[lang] = updatedResources;
    allChecklists[lang] = checklist;

    localStorage.setItem("skillResources", JSON.stringify(allResources));
    localStorage.setItem("skillChecklists", JSON.stringify(allChecklists));

    alert("Resources and checklist updated for " + lang);
    displayLanguages();
  }

  function deleteLanguage() {
    const lang = document.getElementById("deleteLangSelect").value;

    let allResources = JSON.parse(localStorage.getItem("skillResources") || "{}");
    let allChecklists = JSON.parse(localStorage.getItem("skillChecklists") || "{}");

    delete allResources[lang];
    delete allChecklists[lang];

    localStorage.setItem("skillResources", JSON.stringify(allResources));
    localStorage.setItem("skillChecklists", JSON.stringify(allChecklists));

    alert(lang + " has been deleted.");
    refreshDropdowns();
    displayLanguages();
  }

  function refreshDropdowns() {
    const allResources = JSON.parse(localStorage.getItem("skillResources") || "{}");
    const updateSelect = document.getElementById("updateLangSelect");
    const deleteSelect = document.getElementById("deleteLangSelect");

    updateSelect.innerHTML = "";
    deleteSelect.innerHTML = "";

    Object.keys(allResources).forEach(lang => {
      const opt1 = document.createElement("option");
      opt1.value = opt1.text = lang;
      updateSelect.appendChild(opt1);

      const opt2 = document.createElement("option");
      opt2.value = opt2.text = lang;
      deleteSelect.appendChild(opt2);
    });
  }

  function displayLanguages() {
    const allResources = JSON.parse(localStorage.getItem("skillResources") || "{}");
    const allChecklists = JSON.parse(localStorage.getItem("skillChecklists") || "{}");
    const list = document.getElementById("languageList");
    list.innerHTML = "";

    Object.entries(allResources).forEach(([lang, resources]) => {
      const card = document.createElement("div");
      card.classList.add("language-card");

      const checklist = allChecklists[lang] || [];

      const checklistHtml = checklist.map(item => {
        if (item.startsWith('  ') || item.startsWith('- ')) {
          return `<li class="subtopic">${item.trim()}</li>`;
        } else {
          return `<li><strong>${item}</strong></li>`;
        }
      }).join('');

      card.innerHTML = `
        <h4>${lang}</h4>
        <strong>Resources:</strong>
        <ul>${resources.map(r => `<li><a href="${r}" target="_blank">${r}</a></li>`).join('')}</ul>
        <strong>Checklist:</strong>
        <ul>${checklistHtml}</ul>
      `;

      list.appendChild(card);
    });
  }
  function logout() {
  alert("Logged out!");
  window.location.href = "../frontend/index.html";
}

  refreshDropdowns();
  displayLanguages();