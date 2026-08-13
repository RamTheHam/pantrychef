(function () {
  "use strict";

  var API_URL = window.PANTRYCHEF_API_URL || "https://ramtheham--pantrychef-analyze.modal.run";

  // ---- local memory (GDPR-safe: everything stays on this device) ----
  var MEM_KEY = "pantrychef.v1";
  function loadMemory() {
    try {
      return JSON.parse(localStorage.getItem(MEM_KEY)) || {};
    } catch (e) { return {}; }
  }
  function saveMemory(mem) {
    try { localStorage.setItem(MEM_KEY, JSON.stringify(mem)); } catch (e) {}
  }
  var mem = loadMemory();
  if (!mem.mascot_name) mem.mascot_name = "Basil";
  if (!mem.history) mem.history = [];
  if (!mem.last_pantry) mem.last_pantry = [];
  saveMemory(mem);

  var els = {
    cameraScreen: document.getElementById("camera-screen"),
    loadingScreen: document.getElementById("loading-screen"),
    resultsScreen: document.getElementById("results-screen"),
    historyScreen: document.getElementById("history-screen"),
    captureBtn: document.getElementById("capture-btn"),
    fileInput: document.getElementById("file-input"),
    assumeBasics: document.getElementById("assume-basics"),
    loadingStatus: document.getElementById("loading-status"),
    resultsKicker: document.getElementById("results-kicker"),
    resultsTitle: document.getElementById("results-title"),
    resultsSummary: document.getElementById("results-summary"),
    seenIngredients: document.getElementById("seen-ingredients"),
    recipeList: document.getElementById("recipe-list"),
    noResults: document.getElementById("no-results"),
    retakeBtn: document.getElementById("retake-btn"),
    mascotBox: document.getElementById("mascot-box"),
    mascotName: document.getElementById("mascot-name"),
    mascotLine: document.getElementById("mascot-line"),
    whyNote: document.getElementById("why-note"),
    historyBtn: document.getElementById("history-btn"),
    historyList: document.getElementById("history-list"),
    historyCount: document.getElementById("history-count"),
    backFromHistory: document.getElementById("back-from-history")
  };

  function show(screen) {
    els.cameraScreen.hidden = screen !== "camera";
    els.loadingScreen.hidden = screen !== "loading";
    els.resultsScreen.hidden = screen !== "results";
    els.historyScreen.hidden = screen !== "history";
    window.scrollTo(0, 0);
  }

  function fileToB64(file) {
    return new Promise(function (resolve, reject) {
      var reader = new FileReader();
      reader.onload = function () { resolve(reader.result); };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  function compressImage(dataUrl, maxDim) {
    maxDim = maxDim || 1200;
    return new Promise(function (resolve) {
      var img = new Image();
      img.onload = function () {
        var scale = Math.min(1, maxDim / Math.max(img.width, img.height));
        var canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.82));
      };
      img.onerror = function () { resolve(dataUrl); };
      img.src = dataUrl;
    });
  }

  // Derive an anonymous taste digest from local history (never the raw text).
  function buildProfile() {
    var liked = {}, disliked = {};
    var history = mem.history || [];
    for (var i = 0; i < history.length; i++) {
      var h = history[i];
      var ing = h.ingredients || [];
      var bucket = (h.stars >= 4) ? liked : (h.stars <= 2 ? disliked : null);
      if (bucket) {
        for (var j = 0; j < ing.length; j++) bucket[ing[j]] = true;
      }
    }
    return {
      mascot_name: mem.mascot_name,
      liked: Object.keys(liked),
      disliked: Object.keys(disliked),
      last_pantry: mem.last_pantry || [],
      history: (history || []).slice(-8).map(function (h) {
        return { name: h.name, stars: h.stars, comment: h.comment || "" };
      })
    };
  }

  function analyze(dataUrl) {
    show("loading");
    els.loadingStatus.textContent = "Analysing the photo…";
    return fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        image: dataUrl,
        assume_basics: els.assumeBasics.checked,
        profile: buildProfile()
      })
    }).then(function (resp) {
      if (!resp.ok) {
        return resp.json().then(function (e) {
          throw new Error((e && e.error) || (e && e.detail) || ("Server error " + resp.status));
        });
      }
      return resp.json();
    });
  }

  function escapeHtml(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function cap(s) { return s.replace(/\b\w/g, function (l) { return l.toUpperCase(); }); }

  function starWidget(recipeId, current) {
    var stars = "";
    for (var s = 1; s <= 5; s++) {
      stars += '<button class="star' + (s <= (current || 0) ? " on" : "") + '" data-star="' + s + '" data-recipe-id="' + recipeId + '" aria-label="' + s + ' stars">★</button>';
    }
    return stars;
  }

  function renderRecipes(result) {
    var exact = result.count_exact || 0;
    var detected = result.detected || [];

    // remember this pantry for next time's "you've got X this time"
    mem.last_pantry = detected.slice();
    saveMemory(mem);

    els.resultsKicker.innerHTML = '<span aria-hidden="true">✦</span> What I see on your counter';
    if (exact > 0) {
      els.resultsTitle.innerHTML = "<span>" + exact + "</span> " + (exact === 1 ? "dinner" : "dinners") + ". <em>Zero</em> extra ingredients.";
      els.resultsSummary.textContent = "Cooked from exactly what you have. Nothing to buy.";
    } else {
      els.resultsTitle.innerHTML = "Almost there.";
      els.resultsSummary.textContent = "I spotted these ingredients but no recipe fits exactly yet. Closest matches below.";
    }

    var chips = detected.map(function (item) {
      return '<span class="seen-chip">' + escapeHtml(cap(item)) + "</span>";
    }).join("");
    els.seenIngredients.innerHTML = chips || '<span class="seen-chip muted">No items recognised</span>';

    // mascot + why
    els.mascotName.textContent = result.mascot_name || mem.mascot_name || "Basil";
    els.mascotLine.textContent = result.mascot_line || "";
    els.mascotBox.hidden = !result.mascot_line;
    els.whyNote.hidden = !result.taste_used;

    els.recipeList.innerHTML = result.results.map(function (recipe, i) {
      var featured = recipe.match === "exact" && i === 0;
      var tag = recipe.match === "exact" ? "Nothing to buy" : recipe.missing.length + " to buy";
      var missingChips = recipe.missing.map(function (m) { return cap(escapeHtml(m)); }).join(", ");
      var dietChips = (recipe.dietary || []).map(function (d) {
        return '<span class="diet-chip">' + escapeHtml(d) + "</span>";
      }).join("");
      var serves = recipe.serves ? '<span class="serve-tag">Serves ' + recipe.serves + "</span>" : "";
      var graded = (mem.history || []).filter(function (h) { return h.name === recipe.name; })[0];
      var proTip = recipe.pro_tip ? '<div class="pro-tip"><span class="pro-tip-label">Pro tip</span><p>' + escapeHtml(recipe.pro_tip) + "</p></div>" : "";

      return '<article class="recipe-card' + (featured ? " featured" : "") + '" data-name="' + escapeHtml(recipe.name) + '">' +
        '<div class="recipe-main">' +
          '<div class="recipe-meta"><span class="match-tag">' + (recipe.match === "exact" ? "Exact match" : "Closest") +
          '</span><span class="time-tag">' + recipe.time + ' min</span>' + serves + '</div>' +
          "<h2>" + escapeHtml(recipe.name) + "</h2>" +
          '<p class="recipe-description">' + escapeHtml(recipe.description) + "</p>" +
          (dietChips ? '<div class="diet-row">' + dietChips + "</div>" : "") +
          '<div class="recipe-proof"><span>' + recipe.detected_ingredients.length +
          " of your ingredients</span><span>" + tag + "</span></div>" +
        "</div>" +
        '<details class="recipe-details">' +
          "<summary>See ingredients &amp; method</summary>" +
          '<div class="recipe-body">' +
            "<h3>Uses only</h3><ul>" + recipe.recipe_ingredients.map(function (ing) {
              return "<li>" + cap(escapeHtml(ing)) + "</li>";
            }).join("") + "</ul>" +
            (recipe.missing.length ? "<h3>You'd need</h3><p class=\"missing-list\">" + missingChips + "</p>" : "") +
            "<h3>Method</h3><ol>" + recipe.steps.map(function (s) { return "<li>" + escapeHtml(s) + "</li>"; }).join("") + "</ol>" +
            proTip +
          "</div>" +
        "</details>" +
        '<div class="grade-row" data-name="' + escapeHtml(recipe.name) + '">' +
          '<span class="grade-prompt">Grade it and I\u2019ll know you made it:</span>' +
          '<span class="star-row">' + starWidget(recipe.id, graded ? graded.stars : 0) + "</span>" +
          '<input class="comment-input" type="text" placeholder="one word if you like…" maxlength="80" data-name="' + escapeHtml(recipe.name) + '">' +
        "</div>" +
      "</article>";
    }).join("");

    els.noResults.hidden = result.results.length > 0;
    show("results");
  }

  // ---- grading (stars + comment) -> local memory ----
  function gradeRecipe(name, stars) {
    var hist = mem.history || [];
    var existing = hist.filter(function (h) { return h.name === name; })[0];
    if (existing) { existing.stars = stars; }
    else {
      hist.push({ name: name, stars: stars, comment: "", ingredients: [], date: Date.now() });
    }
    // capture the recipe's ingredients for taste derivation
    var card = document.querySelector('.recipe-card[data-name="' + CSS.escape(name) + '"]');
    if (card) {
      var ingEls = card.querySelectorAll(".recipe-body ul li");
      var ing = [];
      for (var i = 0; i < ingEls.length; i++) ing.push(ingEls[i].textContent.trim().toLowerCase());
      (existing || hist[hist.length - 1]).ingredients = ing;
    }
    mem.history = hist;
    saveMemory(mem);
    renderStars(name, stars);
    return existing || hist[hist.length - 1];
  }

  function renderStars(name, stars) {
    var row = document.querySelector('.grade-row[data-name="' + CSS.escape(name) + '"] .star-row');
    if (!row) return;
    var id = row.querySelector("button").getAttribute("data-recipe-id");
    row.innerHTML = starWidget(id, stars);
  }

  // event delegation for stars + comments + buttons
  document.addEventListener("click", function (e) {
    var starBtn = e.target.closest(".star");
    if (starBtn) {
      var name = starBtn.closest(".grade-row").getAttribute("data-name");
      gradeRecipe(name, parseInt(starBtn.getAttribute("data-star"), 10));
      return;
    }
    if (e.target.closest("#retake-btn")) { els.fileInput.value = ""; show("camera"); return; }
    if (e.target.closest("#history-btn")) { renderHistory(); show("history"); return; }
    if (e.target.closest("#back-from-history")) { show("camera"); return; }
  });

  document.addEventListener("change", function (e) {
    if (e.target.classList.contains("comment-input")) {
      var name = e.target.getAttribute("data-name");
      var hist = mem.history || [];
      var h = hist.filter(function (x) { return x.name === name; })[0];
      if (h) { h.comment = e.target.value; saveMemory(mem); }
    }
  });

  function renderHistory() {
    var hist = mem.history || [];
    els.historyCount.textContent = hist.length + (hist.length === 1 ? " dish" : " dishes") + " cooked";
    if (!hist.length) {
      els.historyList.innerHTML = '<p class="history-empty">Nothing cooked yet. Snap a photo and grade your first recipe — Basil will remember.</p>';
      return;
    }
    els.historyList.innerHTML = hist.slice().reverse().map(function (h) {
      var stars = "";
      for (var s = 1; s <= 5; s++) stars += '<span class="star static' + (s <= h.stars ? " on" : "") + '">★</span>';
      return '<div class="history-item">' +
        '<div class="history-top"><span class="history-name">' + escapeHtml(h.name) + "</span>" +
        '<span class="star-row static">' + stars + "</span></div>" +
        (h.comment ? '<p class="history-comment">\u201C' + escapeHtml(h.comment) + '\u201D</p>' : "") +
      "</div>";
    }).join("");
  }

  els.captureBtn.addEventListener("click", function () { els.fileInput.click(); });
  els.fileInput.addEventListener("change", function () {
    var file = els.fileInput.files && els.fileInput.files[0];
    if (!file) return;
    fileToB64(file)
      .then(function (dataUrl) { return compressImage(dataUrl); })
      .then(analyze)
      .then(renderRecipes)
      .catch(function (err) {
        els.loadingStatus.textContent = "Something went wrong: " + err.message;
        setTimeout(function () { show("camera"); }, 2500);
      });
  });
})();
