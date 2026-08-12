(function () {
  "use strict";

  const ingredientGroups = [
    { name: "Fresh", items: ["eggs", "spinach", "onion", "garlic", "lemon", "tomatoes", "potatoes", "mushrooms"] },
    { name: "Cupboard", items: ["rice", "pasta", "bread", "chickpeas", "black beans", "tuna", "tortillas", "oats"] },
    { name: "Fridge", items: ["cheddar", "milk", "yogurt", "butter"] },
    { name: "Basics", items: ["olive oil", "salt", "pepper", "paprika", "water"] }
  ];

  const recipes = [
    {
      id: "tomato-egg-rice",
      name: "Jammy tomato egg rice",
      description: "Soft eggs folded through garlicky tomato rice — fast, savory and deeply comforting.",
      time: 20,
      ingredients: ["rice", "eggs", "tomatoes", "onion", "garlic", "olive oil", "salt", "pepper", "water"],
      steps: [
        "Cook the rice until tender.",
        "Soften onion and garlic in olive oil, then add chopped tomatoes.",
        "Fold in the rice and crack in the eggs. Cover until the whites set; season."
      ]
    },
    {
      id: "chickpea-rice-bowl",
      name: "Crispy chickpea rice bowl",
      description: "Golden chickpeas, bright lemon and wilted spinach over warm rice.",
      time: 25,
      ingredients: ["chickpeas", "rice", "spinach", "lemon", "garlic", "olive oil", "salt", "pepper", "water"],
      steps: [
        "Cook the rice and drain the chickpeas well.",
        "Crisp chickpeas and garlic in olive oil; season with salt and pepper.",
        "Wilt in spinach, squeeze over lemon and spoon onto the rice."
      ]
    },
    {
      id: "pantry-tomato-pasta",
      name: "Slow-sizzle tomato pasta",
      description: "A glossy, rich tomato sauce made from the simplest cupboard staples.",
      time: 25,
      ingredients: ["pasta", "tomatoes", "onion", "garlic", "olive oil", "salt", "pepper", "water"],
      steps: [
        "Boil the pasta in salted water, saving a mug of cooking water.",
        "Sizzle onion and garlic in olive oil; add chopped tomatoes and simmer.",
        "Toss pasta through the sauce with a splash of cooking water and pepper."
      ]
    },
    {
      id: "spinach-cheddar-omelet",
      name: "Spinach cheddar omelet",
      description: "Crisp-edged eggs with a molten cheddar center and plenty of greens.",
      time: 12,
      ingredients: ["eggs", "spinach", "cheddar", "onion", "olive oil", "salt", "pepper"],
      steps: [
        "Soften sliced onion in olive oil and wilt in the spinach.",
        "Beat eggs with salt and pepper, then pour into the pan.",
        "Scatter over cheddar, fold and cook until just set."
      ]
    },
    {
      id: "garlicky-tomato-toast",
      name: "Garlicky tomato toast",
      description: "Juicy tomatoes tumbled over crisp garlic-rubbed bread with a peppery finish.",
      time: 10,
      ingredients: ["bread", "tomatoes", "garlic", "olive oil", "salt", "pepper"],
      steps: [
        "Toast the bread until deeply golden.",
        "Rub the warm toast with cut garlic and drizzle with olive oil.",
        "Pile on chopped, salted tomatoes and finish with pepper."
      ]
    },
    {
      id: "tuna-tomato-pasta",
      name: "Tuna tomato pasta",
      description: "A briny, weeknight tomato pasta with pantry tuna.",
      time: 20,
      ingredients: ["pasta", "tuna", "tomatoes", "garlic", "olive oil", "salt", "pepper", "water"],
      steps: ["Boil the pasta.", "Simmer tomatoes and garlic in oil, then fold in tuna.", "Toss together and season."]
    },
    {
      id: "black-bean-quesadilla",
      name: "Black bean quesadilla",
      description: "Toasty tortillas packed with beans and melted cheddar.",
      time: 15,
      ingredients: ["tortillas", "black beans", "cheddar", "onion", "olive oil", "salt"],
      steps: ["Mash and season the beans.", "Fill tortillas with beans, onion and cheddar.", "Toast in oil until crisp."]
    },
    {
      id: "crispy-potato-hash",
      name: "Crispy potato egg hash",
      description: "Golden potatoes, soft onions and runny eggs from one pan.",
      time: 30,
      ingredients: ["potatoes", "eggs", "onion", "olive oil", "salt", "pepper", "paprika", "water"],
      steps: ["Dice and boil potatoes until almost tender.", "Crisp with onion, oil and paprika.", "Add eggs and cover until set."]
    },
    {
      id: "mushroom-toast",
      name: "Buttery mushroom toast",
      description: "Deeply browned mushrooms on crisp toast.",
      time: 15,
      ingredients: ["mushrooms", "bread", "butter", "garlic", "salt", "pepper"],
      steps: ["Toast the bread.", "Brown mushrooms in butter.", "Add garlic, season and spoon over toast."]
    }
  ];

  const demoPantry = [
    "eggs", "spinach", "onion", "garlic", "lemon", "tomatoes", "rice",
    "pasta", "bread", "chickpeas", "cheddar", "olive oil", "salt", "pepper", "water"
  ];

  const state = {
    selected: new Set(),
    source: "manual"
  };

  const elements = {
    pickerScreen: document.getElementById("picker-screen"),
    resultsScreen: document.getElementById("results-screen"),
    groups: document.getElementById("ingredient-groups"),
    search: document.getElementById("ingredient-search"),
    emptySearch: document.getElementById("empty-search"),
    selectedCount: document.getElementById("selected-count"),
    matchButton: document.getElementById("match-button"),
    resultsTitle: document.getElementById("results-title"),
    resultsKicker: document.getElementById("results-kicker"),
    resultsSummary: document.getElementById("results-summary"),
    pantryCount: document.getElementById("pantry-count"),
    pantryList: document.getElementById("selected-pantry-list"),
    recipeList: document.getElementById("recipe-list"),
    noResults: document.getElementById("no-results")
  };

  function titleCase(value) {
    return value.replace(/\b\w/g, function (letter) { return letter.toUpperCase(); });
  }

  function getMatches(selected) {
    return recipes
      .filter(function (recipe) {
        return recipe.ingredients.every(function (ingredient) { return selected.has(ingredient); });
      })
      .sort(function (a, b) {
        return b.ingredients.length - a.ingredients.length || a.time - b.time;
      });
  }

  function renderIngredients(filter) {
    const query = (filter || "").trim().toLowerCase();
    let visibleItems = 0;

    elements.groups.innerHTML = ingredientGroups.map(function (group) {
      const filteredItems = group.items.filter(function (item) { return item.includes(query); });
      visibleItems += filteredItems.length;
      if (!filteredItems.length) return "";

      const options = filteredItems.map(function (item) {
        const pressed = state.selected.has(item);
        return '<button class="ingredient-chip" type="button" data-ingredient="' + item +
          '" aria-pressed="' + pressed + '">' + titleCase(item) + "</button>";
      }).join("");

      return '<section class="ingredient-group"><h3>' + group.name +
        '</h3><div class="ingredient-options">' + options + "</div></section>";
    }).join("");

    elements.emptySearch.hidden = visibleItems > 0;
  }

  function updateSelectionUI() {
    const count = state.selected.size;
    elements.selectedCount.textContent = count + " selected";
    elements.matchButton.disabled = count === 0;
  }

  function renderPantry() {
    const selectedItems = Array.from(state.selected);
    elements.pantryCount.textContent = selectedItems.length + " ingredients";
    elements.pantryList.innerHTML = selectedItems.map(function (item) {
      return "<span>" + titleCase(item) + "</span>";
    }).join("");
  }

  function recipeCard(recipe, index) {
    const ingredientItems = recipe.ingredients.map(function (ingredient) {
      return "<li>" + titleCase(ingredient) + "</li>";
    }).join("");
    const steps = recipe.steps.map(function (step) { return "<li>" + step + "</li>"; }).join("");
    const featured = index === 0 ? " featured" : "";
    const tag = index === 0 ? "Best match" : "Exact match";

    return '<article class="recipe-card' + featured + '">' +
      '<div class="recipe-main">' +
        '<div class="recipe-meta"><span class="match-tag">' + tag +
        '</span><span class="time-tag">' + recipe.time + ' min</span></div>' +
        "<h2>" + recipe.name + "</h2>" +
        '<p class="recipe-description">' + recipe.description + "</p>" +
        '<div class="recipe-proof"><span>' + recipe.ingredients.length +
        ' of your ingredients</span><span class="nothing-to-buy">0 to buy</span></div>' +
      "</div>" +
      '<details class="recipe-details">' +
        "<summary>See ingredients &amp; method</summary>" +
        '<div class="recipe-body"><h3>Uses only</h3><ul>' + ingredientItems +
        "</ul><h3>Method</h3><ol>" + steps + "</ol></div>" +
      "</details>" +
    "</article>";
  }

  function showResults() {
    const matches = getMatches(state.selected);
    const count = matches.length;
    const noun = count === 1 ? "dinner" : "dinners";

    elements.resultsTitle.innerHTML = "<span>" + count + "</span> " + noun + '. <em>Zero</em> extra ingredients.';
    elements.resultsKicker.innerHTML = '<span aria-hidden="true">✦</span> ' +
      (state.source === "demo" ? "Demo pantry · exact matches" : "Your pantry · exact matches");
    elements.resultsSummary.textContent = count
      ? "Every option below can be cooked from the ingredients you selected — and nothing outside that list."
      : "The rules engine found no curated recipe whose full ingredient list fits your current pantry.";
    elements.recipeList.innerHTML = matches.map(recipeCard).join("");
    elements.noResults.hidden = count > 0;

    renderPantry();
    elements.pickerScreen.hidden = true;
    elements.resultsScreen.hidden = false;
    window.scrollTo(0, 0);
    elements.resultsTitle.focus({ preventScroll: true });
  }

  function showPicker() {
    elements.resultsScreen.hidden = true;
    elements.pickerScreen.hidden = false;
    updateSelectionUI();
    renderIngredients(elements.search.value);
    window.scrollTo(0, 0);
  }

  function loadDemo() {
    state.selected = new Set(demoPantry);
    state.source = "demo";
    showResults();
  }

  document.addEventListener("click", function (event) {
    const ingredientButton = event.target.closest("[data-ingredient]");
    if (ingredientButton) {
      const ingredient = ingredientButton.dataset.ingredient;
      state.source = "manual";
      if (state.selected.has(ingredient)) state.selected.delete(ingredient);
      else state.selected.add(ingredient);
      ingredientButton.setAttribute("aria-pressed", String(state.selected.has(ingredient)));
      updateSelectionUI();
      return;
    }

    const actionButton = event.target.closest("[data-action]");
    if (!actionButton) return;

    const action = actionButton.dataset.action;
    if (action === "demo") loadDemo();
    if (action === "match") showResults();
    if (action === "back" || action === "home") {
      event.preventDefault();
      showPicker();
    }
  });

  elements.search.addEventListener("input", function (event) {
    renderIngredients(event.target.value);
  });

  renderIngredients();
})();
