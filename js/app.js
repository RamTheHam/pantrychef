(function () {
  "use strict";

  var API_URL = window.PANTRYCHEF_API_URL || "https://ramtheham--pantrychef-analyze.modal.run";

  // ---- local memory (GDPR-safe) ----
  var MEM_KEY = "pantrychef.v1";
  function loadMemory() {
    try {
      var stored = JSON.parse(localStorage.getItem(MEM_KEY));
      if (!stored || typeof stored !== "object" || Array.isArray(stored)) return {};
      return {
        mascot_name: typeof stored.mascot_name === "string" ? stored.mascot_name : "Basil",
        history: Array.isArray(stored.history) ? stored.history.filter(function (h) {
          return h && typeof h.name === "string" && Number.isInteger(h.stars) && h.stars >= 1 && h.stars <= 5 && Array.isArray(h.ingredients);
        }) : [],
        last_pantry: Array.isArray(stored.last_pantry) ? stored.last_pantry.filter(function (i) { return typeof i === "string"; }) : []
      };
    } catch (e) { return {}; }
  }
  function saveMemory(m) { try { localStorage.setItem(MEM_KEY, JSON.stringify(m)); } catch (e) {} }
  var mem = loadMemory();
  if (!mem.mascot_name) mem.mascot_name = "Basil";
  if (!mem.history) mem.history = [];
  if (!mem.last_pantry) mem.last_pantry = [];
  saveMemory(mem);

  var els = {
    cameraScreen: document.getElementById("camera-screen"),
    revealScreen: document.getElementById("reveal-screen"),
    resultsScreen: document.getElementById("results-screen"),
    historyScreen: document.getElementById("history-screen"),
    settingsScreen: document.getElementById("settings-screen"),
    captureBtn: document.getElementById("capture-btn"),
    libraryBtn: document.getElementById("library-btn"),
    multiBtn: document.getElementById("multi-btn"),
    fileInput: document.getElementById("file-input"),
    libraryInput: document.getElementById("library-input"),
    settingsBtn: document.getElementById("settings-btn"),
    noteInput: document.getElementById("note-input"),
    assumeBasics: document.getElementById("assume-basics"),
    revealCard: document.getElementById("reveal-card"),
    revealContent: document.getElementById("reveal-content"),
    revealThinking: document.getElementById("reveal-thinking"),
    revealSub: document.getElementById("reveal-sub"),
    resultsKicker: document.getElementById("results-kicker"),
    resultsTitle: document.getElementById("results-title"),
    seenIngredients: document.getElementById("seen-ingredients"),
    recipeList: document.getElementById("recipe-list"),
    retakeBtn: document.getElementById("retake-btn"),
    historyBtn: document.getElementById("history-btn"),
    historyList: document.getElementById("history-list"),
    historyCount: document.getElementById("history-count"),
    backFromHistory: document.getElementById("back-from-history"),
    backFromSettings: document.getElementById("back-from-settings"),
    summaryBox: document.getElementById("summary-box"),
    exportBtn: document.getElementById("export-btn"),
    copyBtn: document.getElementById("copy-btn"),
    clearBtn: document.getElementById("clear-btn"),
    cameraMascotLine: document.getElementById("camera-mascot-line"),
    requestError: document.getElementById("request-error"),
    retryBtn: document.getElementById("retry-btn"),
    cancelBtn: document.getElementById("cancel-btn"),
    dataStatus: document.getElementById("data-status")
  };

  var multiMode = false;
  var pendingImages = [];   // dataURLs queued in x2 mode
  var lastImages = [];
  var request = null;
  var generation = 0;
  var timers = [];

  function stopRequest() {
    generation++;
    if (request) request.abort();
    request = null;
    timers.forEach(clearTimeout);
    timers = [];
    pendingImages = [];
    els.revealCard.classList.remove("shake", "flipped");
  }
  function later(fn, delay) { timers.push(setTimeout(fn, delay)); }
  function reportError(message) {
    els.requestError.textContent = message;
    els.requestError.hidden = false;
    els.retryBtn.hidden = !lastImages.length;
    els.revealCard.classList.remove("shake", "flipped");
    show("camera");
  }
  function resetCapture() {
    stopRequest();
    els.requestError.textContent = "";
    els.requestError.hidden = true;
    els.retryBtn.hidden = true;
    multiMode = false;
    els.multiBtn.classList.remove("active");
    els.multiBtn.setAttribute("aria-pressed", "false");
    els.cameraMascotLine.textContent = "Just photograph your ingredients";
    els.fileInput.value = "";
    els.libraryInput.value = "";
    show("camera");
  }

  function show(screen) {
    els.cameraScreen.hidden = screen !== "camera";
    els.revealScreen.hidden = screen !== "reveal";
    els.resultsScreen.hidden = screen !== "results";
    els.historyScreen.hidden = screen !== "history";
    els.settingsScreen.hidden = screen !== "settings";
    window.scrollTo(0, 0);
  }

  function fileToDataUrl(file) {
    return new Promise(function (resolve, reject) {
      var r = new FileReader();
      r.onload = function () { resolve(r.result); };
      r.onerror = reject;
      r.readAsDataURL(file);
    });
  }

  function compressImage(dataUrl, maxDim) {
    maxDim = maxDim || 1200;
    return new Promise(function (resolve, reject) {
      var img = new Image();
      img.onload = function () {
        var scale = Math.min(1, maxDim / Math.max(img.width, img.height));
        var c = document.createElement("canvas");
        c.width = Math.round(img.width * scale);
        c.height = Math.round(img.height * scale);
        c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
        resolve(c.toDataURL("image/jpeg", 0.82));
      };
      img.onerror = function () { reject(new Error("This photo could not be read. Choose a JPEG, PNG or WebP image.")); };
      img.src = dataUrl;
    });
  }

  function escapeHtml(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function cap(s) { return s.replace(/\b\w/g, function (l) { return l.toUpperCase(); }); }

  // ---- taste digest (anonymous, from local history) ----
  function buildProfile() {
    var liked = {}, disliked = {};
    var hist = mem.history || [];
    for (var i = 0; i < hist.length; i++) {
      var h = hist[i], ing = h.ingredients || [];
      var bucket = (h.stars >= 4) ? liked : (h.stars <= 2 ? disliked : null);
      if (bucket) for (var j = 0; j < ing.length; j++) bucket[ing[j]] = true;
    }
    return {
      mascot_name: mem.mascot_name,
      liked: Object.keys(liked),
      disliked: Object.keys(disliked),
      last_pantry: mem.last_pantry || [],
      note: els.noteInput.value.trim(),
      history: (hist || []).slice(-8).map(function (h) {
        return { name: h.name, stars: h.stars, comment: h.comment || "" };
      })
    };
  }

  function analyze(dataUrls, signal) {
    return fetch(API_URL, {
      method: "POST",
      signal: signal,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        images: dataUrls,
        assume_basics: els.assumeBasics.checked,
        profile: buildProfile()
      })
    }).then(function (resp) {
      return resp.text().then(function (body) {
        var result;
        try { result = JSON.parse(body); } catch (e) {
          throw new Error(resp.ok ? "The server returned an unreadable response. Try again." : "Server error " + resp.status + ". Try again.");
        }
        if (!resp.ok) throw new Error(result && typeof result.error === "string" ? result.error : result && typeof result.detail === "string" ? result.detail : "Server error " + resp.status);
        return validateResult(result);
      });
    });
  }

  function stringList(value) { return Array.isArray(value) && value.every(function (v) { return typeof v === "string"; }); }
  function validateResult(result) {
    if (!result || !stringList(result.detected) || !Array.isArray(result.results)) throw new Error("The server returned incomplete recipes. Try again.");
    result.results.forEach(function (r) {
      if (!r || typeof r.name !== "string" || typeof r.description !== "string" || !Number.isFinite(r.time) || r.time < 0 || !stringList(r.detected_ingredients) || !stringList(r.missing) || !stringList(r.recipe_ingredients) || !stringList(r.steps)) throw new Error("The server returned incomplete recipes. Try again.");
      r.dietary = stringList(r.dietary) ? r.dietary : [];
      // Missing ingredients always take precedence over an optimistic model label.
      r.match = r.match === "exact" && !r.missing.length ? "exact" : "closest";
      r.serves = Number.isInteger(r.serves) && r.serves > 0 ? r.serves : null;
    });
    result.count_exact = result.results.filter(function (r) { return r.match === "exact"; }).length;
    return result;
  }

  // ---- reveal: shake 2s while thinking, then flip to show recipe #1 ----
  function reveal(result) {
    show("reveal");
    var first = result.results[0];
    els.revealThinking.textContent = "Reading your food…";
    els.revealCard.classList.remove("flipped", "shake");
    els.revealSub.textContent = "";

    // shake while the model "thinks" (minimum 2s), then flip
    els.revealCard.classList.add("shake");
    var minShake = 2000;
    var started = Date.now();

    function flip() {
      var elapsed = Date.now() - started;
      var wait = Math.max(0, minShake - elapsed);
      later(function () {
        els.revealCard.classList.remove("shake");
        els.revealCard.classList.add("flipped");
        renderRevealFront(first, result);
        later(function () { renderResults(result); }, 2200);
      }, wait);
    }

    if (first) {
      flip();
    } else {
      later(function () {
        els.revealCard.classList.remove("shake");
        els.revealCard.classList.add("flipped");
        renderRevealFront(null, result);
        later(function () { renderResults(result); }, 1600);
      }, minShake);
    }
  }

  function renderRevealFront(first, result) {
    if (!first) {
      els.revealContent.innerHTML = '<p class="reveal-none">No exact match. Try adding more ingredients.</p>';
      return;
    }
    els.revealContent.innerHTML =
      '<div class="reveal-recipe">' +
        '<div class="reveal-meta"><span class="match-tag">' + (first.match === "exact" ? "Exact match" : "Closest") + '</span><span class="time-tag">' + first.time + ' min</span></div>' +
        '<h2>' + escapeHtml(first.name) + '</h2>' +
        '<p class="reveal-desc">' + escapeHtml(first.description) + '</p>' +
        '<div class="reveal-proof">' + (first.missing.length ? first.missing.length + " to buy" : "0 to buy") + ' · from ' + first.detected_ingredients.length + ' of your ingredients</div>' +
      '</div>';
    els.revealSub.textContent = (result.mascot_line || "");
  }

  function renderResults(result) {
    var exact = result.count_exact || 0;
    var detected = result.detected || [];
    mem.last_pantry = detected.slice();
    saveMemory(mem);

    els.resultsKicker.innerHTML = '<span aria-hidden="true">✦</span> What I see on your counter';
    els.resultsTitle.innerHTML = exact > 0
      ? "<span>" + exact + "</span> " + (exact === 1 ? "dinner" : "dinners") + " from your ingredients."
      : "Almost there.";

    var chips = detected.map(function (i) { return '<span class="seen-chip">' + escapeHtml(cap(i)) + "</span>"; }).join("");
    els.seenIngredients.innerHTML = chips || '<span class="seen-chip muted">No items recognised</span>';

    // mascot line shown at top of results too (as a slim bar)
    els.recipeList.innerHTML = result.results.map(function (recipe, i) {
      var featured = recipe.match === "exact" && i === 0;
      var tag = recipe.match === "exact" ? "Nothing to buy" : recipe.missing.length + " to buy";
      var missingChips = recipe.missing.map(function (m) { return cap(escapeHtml(m)); }).join(", ");
      var dietChips = (recipe.dietary || []).map(function (d) { return '<span class="diet-chip">' + escapeHtml(d) + "</span>"; }).join("");
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
          '<div class="recipe-proof"><span>' + recipe.detected_ingredients.length + " of your ingredients</span><span>" + tag + "</span></div>" +
        "</div>" +
        '<details class="recipe-details">' +
          "<summary>See ingredients &amp; method</summary>" +
          '<div class="recipe-body">' +
            "<h3>Uses only</h3><ul>" + recipe.recipe_ingredients.map(function (ing) { return "<li>" + cap(escapeHtml(ing)) + "</li>"; }).join("") + "</ul>" +
            (recipe.missing.length ? "<h3>You'd need</h3><p class=\"missing-list\">" + missingChips + "</p>" : "") +
            "<h3>Method</h3><ol>" + recipe.steps.map(function (s) { return "<li>" + escapeHtml(s) + "</li>"; }).join("") + "</ol>" +
            proTip +
          "</div>" +
        "</details>" +
        '<div class="grade-row" data-name="' + escapeHtml(recipe.name) + '">' +
          '<span class="grade-prompt">Grade it and I’ll know you made it:</span>' +
          '<span class="star-row">' + starWidget(recipe.id, graded ? graded.stars : 0) + "</span>" +
          '<input class="comment-input" type="text" value="' + escapeHtml(graded ? graded.comment : "") + '" aria-label="Comment on ' + escapeHtml(recipe.name) + '" placeholder="one word if you like…" maxlength="80" data-name="' + escapeHtml(recipe.name) + '">' +
        "</div>" +
      "</article>";
    }).join("");

    show("results");
  }

  function starWidget(id, current) {
    var out = "";
    for (var s = 1; s <= 5; s++) out += '<button class="star' + (s <= (current || 0) ? " on" : "") + '" data-star="' + s + '" data-recipe-id="' + escapeHtml(id) + '" aria-label="' + s + ' stars">★</button>';
    return out;
  }

  function gradeRecipe(name, stars) {
    var hist = mem.history || [];
    var existing = hist.filter(function (h) { return h.name === name; })[0];
    if (existing) existing.stars = stars;
    else {
      var input = document.querySelector('.comment-input[data-name="' + CSS.escape(name) + '"]');
      hist.push({ name: name, stars: stars, comment: input ? input.value : "", ingredients: [], date: Date.now() });
    }
    var card = document.querySelector('.recipe-card[data-name="' + CSS.escape(name) + '"]');
    if (card) {
      var lis = card.querySelectorAll(".recipe-body ul li"), ing = [];
      for (var i = 0; i < lis.length; i++) ing.push(lis[i].textContent.trim().toLowerCase());
      (existing || hist[hist.length - 1]).ingredients = ing;
    }
    mem.history = hist;
    saveMemory(mem);
    renderStars(name, stars);
  }
  function renderStars(name, stars) {
    var row = document.querySelector('.grade-row[data-name="' + CSS.escape(name) + '"] .star-row');
    if (!row) return;
    var id = row.querySelector("button").getAttribute("data-recipe-id");
    row.innerHTML = starWidget(id, stars);
  }

  // ---- capture flow ----
  function handleImages(dataUrls) {
    stopRequest();
    lastImages = Array.isArray(dataUrls) ? dataUrls.slice() : [dataUrls];
    var token = generation;
    request = new AbortController();
    var activeRequest = request;
    var expired = false;
    els.requestError.hidden = true;
    els.retryBtn.hidden = true;
    els.revealThinking.textContent = "Reading your food…";
    els.revealContent.textContent = "";
    els.revealSub.textContent = "";
    show("reveal");
    els.revealCard.classList.add("shake");
    var timeout = setTimeout(function () { expired = true; activeRequest.abort(); }, 45000);
    analyze(lastImages, activeRequest.signal).then(function (result) {
      if (token !== generation) return;
      request = null;
      reveal(result);
    }).catch(function (err) {
      if (token !== generation) return;
      request = null;
      reportError(expired ? "This is taking too long. Try again." : err.message || "Could not reach the server. Try again.");
    }).finally(function () { clearTimeout(timeout); });
  }

  function prepareImages(files, capture) {
    var selected = Array.from(files || []);
    if (!selected.length) return;
    if (selected.length > 2) { lastImages = []; reportError("Choose up to two photos at a time."); return; }
    if (selected.some(function (f) { return !f.type.startsWith("image/") || f.size > 20 * 1024 * 1024; })) {
      lastImages = []; reportError("Choose images smaller than 20 MB each."); return;
    }
    var token = generation;
    Promise.all(selected.map(function (f) { return fileToDataUrl(f).then(function (data) { return compressImage(data); }); })).then(function (dataUrls) {
      if (token !== generation) return;
      if (capture && multiMode) {
        pendingImages = pendingImages.concat(dataUrls);
        if (pendingImages.length < 2) { els.cameraMascotLine.textContent = "Got one — snap the second"; return; }
        dataUrls = pendingImages.slice(0, 2);
      }
      handleImages(dataUrls);
    }).catch(function (err) { if (token === generation) { lastImages = []; reportError(err.message || "This photo could not be read."); } });
  }

  els.captureBtn.addEventListener("click", function () { els.fileInput.click(); });
  els.libraryBtn.addEventListener("click", function () { els.libraryInput.click(); });
  els.multiBtn.addEventListener("click", function () {
    generation++;
    multiMode = !multiMode;
    els.multiBtn.setAttribute("aria-pressed", String(multiMode));
    els.multiBtn.classList.toggle("active", multiMode);
    pendingImages = [];
    els.cameraMascotLine.textContent = multiMode ? "Snap two photos — I’ll combine what I see" : "Just photograph your ingredients";
  });

  els.fileInput.addEventListener("change", function () {
    prepareImages(els.fileInput.files, true);
    els.fileInput.value = "";
  });
  els.libraryInput.addEventListener("change", function () {
    prepareImages(els.libraryInput.files, false);
    els.libraryInput.value = "";
  });
  els.retryBtn.addEventListener("click", function () { if (lastImages.length) handleImages(lastImages); });
  els.cancelBtn.addEventListener("click", resetCapture);

  // ---- delegation: stars, comments, nav ----
  document.addEventListener("click", function (e) {
    var star = e.target.closest(".star");
    if (star) { gradeRecipe(star.closest(".grade-row").getAttribute("data-name"), parseInt(star.getAttribute("data-star"), 10)); return; }
    if (e.target.closest("#retake-btn")) { resetCapture(); return; }
    if (e.target.closest("#history-btn")) { renderHistory(); show("history"); return; }
    if (e.target.closest("#back-from-history")) { show("camera"); return; }
    if (e.target.closest("#settings-btn")) { renderSettings(); show("settings"); return; }
    if (e.target.closest("#back-from-settings")) { show("camera"); return; }
    if (e.target.closest("#export-btn")) { exportData(); return; }
    if (e.target.closest("#copy-btn")) { copyData(); return; }
    if (e.target.closest("#clear-btn")) { clearData(); return; }
  });
  document.addEventListener("change", function (e) {
    if (e.target.classList.contains("comment-input")) {
      var name = e.target.getAttribute("data-name");
      var h = (mem.history || []).filter(function (x) { return x.name === name; })[0];
      if (h) { h.comment = e.target.value; saveMemory(mem); }
    }
  });

  // ---- history ----
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
      return '<div class="history-item"><div class="history-top"><span class="history-name">' + escapeHtml(h.name) + '</span><span class="star-row static">' + stars + '</span></div>' +
        (h.comment ? '<p class="history-comment">\u201C' + escapeHtml(h.comment) + '\u201D</p>' : "") + '</div>';
    }).join("");
  }

  // ---- settings: show the exact summary shared with the AI ----
  function renderSettings() {
    var p = buildProfile();
    var rows = "";
    rows += '<div class="summary-kv"><span class="k">Mascot</span><span class="v">' + escapeHtml(p.mascot_name) + '</span></div>';
    rows += '<div class="summary-kv"><span class="k">You like</span><span class="v">' + (p.liked.length ? p.liked.map(escapeHtml).join(", ") : "—") + '</span></div>';
    rows += '<div class="summary-kv"><span class="k">You avoid</span><span class="v">' + (p.disliked.length ? p.disliked.map(escapeHtml).join(", ") : "—") + '</span></div>';
    rows += '<div class="summary-kv"><span class="k">Last pantry</span><span class="v">' + (p.last_pantry.length ? p.last_pantry.map(escapeHtml).join(", ") : "—") + '</span></div>';
    rows += '<div class="summary-kv"><span class="k">Your note</span><span class="v">' + (p.note ? escapeHtml(p.note) : "—") + '</span></div>';
    var histNames = p.history.map(function (h) { return escapeHtml(h.name) + " (" + h.stars + "★)"; }).join(", ");
    rows += '<div class="summary-kv"><span class="k">Cooked</span><span class="v">' + (histNames || "—") + '</span></div>';
    els.summaryBox.innerHTML = rows;
  }

  function fullExport() {
    return JSON.stringify({
      exported_at: new Date().toISOString(),
      mascot_name: mem.mascot_name,
      last_pantry: mem.last_pantry || [],
      history: mem.history || []
    }, null, 2);
  }
  function exportData() {
    var blob = new Blob([fullExport()], { type: "application/json" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "pantrychef-data.json";
    a.click();
    later(function () { URL.revokeObjectURL(a.href); }, 1000);
  }
  function copyData() {
    if (!navigator.clipboard || !navigator.clipboard.writeText) { els.dataStatus.textContent = "Clipboard is unavailable. Download your data instead."; return; }
    navigator.clipboard.writeText(fullExport()).then(function () { els.dataStatus.textContent = "Copied your data."; }).catch(function () { els.dataStatus.textContent = "Could not copy your data. Download it instead."; });
  }
  function clearData() {
    if (!confirm("Erase all your PantryChef data on this phone? This cannot be undone.")) return;
    try { localStorage.removeItem(MEM_KEY); } catch (e) {}
    mem = { mascot_name: "Basil", history: [], last_pantry: [] };
    saveMemory(mem);
    els.noteInput.value = "";
    lastImages = [];
    resetCapture();
    renderSettings();
    show("settings");
    els.dataStatus.textContent = "Your data has been erased.";
  }
})();
