(function () {
  "use strict";

  // Live Modal endpoint (photo -> ingredients via vision, -> recipes via DeepSeek Flash).
  var API_URL = window.PANTRYCHEF_API_URL || "https://ramtheham--pantrychef-analyze.modal.run";

  var els = {
    cameraScreen: document.getElementById("camera-screen"),
    loadingScreen: document.getElementById("loading-screen"),
    resultsScreen: document.getElementById("results-screen"),
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
    retakeBtn: document.getElementById("retake-btn")
  };

  function show(screen) {
    els.cameraScreen.hidden = screen !== "camera";
    els.loadingScreen.hidden = screen !== "loading";
    els.resultsScreen.hidden = screen !== "results";
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

  // Compress/resize client-side before upload to keep it fast and under limits.
  function compressImage(dataUrl, maxDim) {
    maxDim = maxDim || 1200;
    return new Promise(function (resolve) {
      var img = new Image();
      img.onload = function () {
        var scale = Math.min(1, maxDim / Math.max(img.width, img.height));
        var canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.82));
      };
      img.onerror = function () { resolve(dataUrl); };
      img.src = dataUrl;
    });
  }

  function analyze(dataUrl) {
    show("loading");
    els.loadingStatus.textContent = "Analysing the photo…";
    return fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        image: dataUrl,
        assume_basics: els.assumeBasics.checked
      })
    }).then(function (resp) {
      if (!resp.ok) {
        return resp.json().then(function (e) {
          throw new Error((e && e.detail) || ("Server error " + resp.status));
        });
      }
      return resp.json();
    });
  }

  function renderRecipes(result) {
    var exact = result.count_exact || 0;
    var detected = result.detected || [];
    var owned = result.owned || [];

    els.resultsKicker.innerHTML = '<span aria-hidden="true">✦</span> What I see on your counter';
    if (exact > 0) {
      els.resultsTitle.innerHTML = "<span>" + exact + "</span> " + (exact === 1 ? "dinner" : "dinners") + ". <em>Zero</em> extra ingredients.";
      els.resultsSummary.textContent = "Cooked from exactly what you have. Nothing to buy.";
    } else {
      els.resultsTitle.innerHTML = "Almost there.";
      els.resultsSummary.textContent = "I spotted these ingredients but no recipe fits exactly yet. Closest matches below.";
    }

    // detected chips
    var chips = detected.map(function (item) {
      return '<span class="seen-chip">' + escapeHtml(cap(item)) + "</span>";
    }).join("");
    els.seenIngredients.innerHTML = chips || '<span class="seen-chip muted">No items recognised</span>';

    // recipes
    els.recipeList.innerHTML = result.results.map(function (recipe, i) {
      var featured = recipe.match === "exact" && i === 0;
      var tag = recipe.match === "exact" ? "Nothing to buy" : recipe.missing.length + " to buy";
      var missingChips = recipe.missing.map(function (m) { return cap(m); }).join(", ");
      var dietChips = (recipe.dietary || []).map(function (d) {
        return '<span class="diet-chip">' + escapeHtml(d) + "</span>";
      }).join("");
      var serves = recipe.serves ? '<span class="serve-tag">Serves ' + recipe.serves + "</span>" : "";
      var body = '<article class="recipe-card' + (featured ? " featured" : "") + '">' +
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
          "</div>" +
        "</details>" +
      "</article>";
      return body;
    }).join("");

    els.noResults.hidden = result.results.length > 0;
    show("results");
  }

  function cap(s) {
    return s.replace(/\b\w/g, function (l) { return l.toUpperCase(); });
  }
  function escapeHtml(s) {
    return s.replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
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
  els.retakeBtn.addEventListener("click", function () {
    els.fileInput.value = "";
    show("camera");
  });
})();
