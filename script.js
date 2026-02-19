// ============================================================
// LINUXPEDIA - script.js (VERSION CORRIGÉE)
// ============================================================

const VERSION = 1;

const DEFAULTS = [
  {
    titre: "Linux",
    categorie: "concept",
    contenu: "Linux est un noyau de système d'exploitation libre et open source créé en 1991 par Linus Torvalds.\nIl constitue la couche centrale d'un système GNU/Linux, assurant la gestion du matériel, de la mémoire, des processus et des interactions avec les périphériques.\n\nLe noyau Linux est utilisé dans une grande variété d'environnements : ordinateurs personnels, serveurs, supercalculateurs, smartphones Android, systèmes embarqués et infrastructures cloud.\n\nSa nature libre permet à chacun d'étudier, modifier et redistribuer son code, ce qui a favorisé la naissance de centaines de distributions Linux adaptées à des usages variés.",
    tags: ["kernel", "systeme", "opensource"]
  },
  {
    titre: "Ubuntu",
    categorie: "distribution",
    contenu: "Ubuntu est une distribution GNU/Linux basée sur Debian et développée par Canonical.\nElle vise à proposer un système d'exploitation libre, accessible et prêt à l'emploi, destiné aussi bien aux débutants qu'aux professionnels.\n\nUbuntu fournit un environnement de bureau complet, une vaste logithèque, et un cycle de publication régulier incluant des versions LTS (Long Term Support) maintenues plusieurs années.\n\nLa distribution est largement utilisée sur postes personnels, serveurs, cloud et environnements professionnels.",
    tags: ["distribution", "debian"]
  },
  {
    titre: "Debian",
    categorie: "distribution",
    contenu: "Debian est une distribution GNU/Linux communautaire reconnue pour sa stabilité, sa rigueur technique et son respect des principes du logiciel libre.\nElle constitue la base de nombreuses autres distributions, dont Ubuntu et Linux Mint.\n\nDebian utilise un système de paquets avancé (APT) et propose plusieurs branches : stable, testing et unstable, permettant de choisir entre fiabilité maximale et logiciels récents.\n\nElle est particulièrement utilisée sur serveurs et environnements nécessitant robustesse et longévité.",
    tags: ["distribution", "base"]
  },
  {
    titre: "Arch Linux",
    categorie: "distribution",
    contenu: "Arch Linux est une distribution GNU/Linux indépendante reposant sur une philosophie de simplicité, de contrôle utilisateur et de mise à jour continue (rolling release).\n\nElle fournit un système minimal que l'utilisateur configure lui-même, ce qui permet une installation personnalisée et légère.\nArch est réputée pour sa documentation exhaustive (Arch Wiki) et son gestionnaire de paquets pacman.\n\nElle s'adresse principalement aux utilisateurs avancés souhaitant comprendre et maîtriser entièrement leur système.",
    tags: ["rolling", "minimal"]
  },
  {
    titre: "Bash",
    categorie: "commande",
    contenu: "Bash (Bourne Again SHell) est un interpréteur de commandes largement utilisé dans les systèmes GNU/Linux et Unix.\nIl permet d'exécuter des commandes, automatiser des tâches et écrire des scripts système.\n\nBash fournit des fonctionnalités avancées telles que l'historique de commandes, la complétion automatique, les variables d'environnement et les structures de contrôle.\n\nIl constitue l'interface principale entre l'utilisateur et le système dans de nombreux environnements Linux.",
    tags: ["shell", "terminal"]
  },
  {
    titre: "GNOME",
    categorie: "environnement",
    contenu: "GNOME est un environnement de bureau libre pour systèmes GNU/Linux conçu pour offrir une interface moderne, épurée et intuitive.\nIl met l'accent sur la simplicité d'utilisation et la productivité.\n\nL'environnement GNOME comprend un gestionnaire de fenêtres, des applications intégrées et une expérience utilisateur cohérente.\nIl utilise aujourd'hui le protocole graphique Wayland et la bibliothèque GTK.\n\nGNOME est l'environnement par défaut de nombreuses distributions, dont Ubuntu.",
    tags: ["desktop", "interface"]
  }
];

// ============================================================
// STORAGE
// ============================================================

function getArticles() {
  try {
    var savedVersion = parseInt(localStorage.getItem("lxp_version") || "0");
    var data = localStorage.getItem("lxp_articles");

    if (!data) {
      var copy = DEFAULTS.map(function(a) { return Object.assign({}, a); });
      saveArticles(copy);
      return copy;
    }

    var existing = JSON.parse(data);

    if (savedVersion < VERSION) {
      var titresExistants = existing.map(function(a) {
        return a.titre.toLowerCase();
      });
      var nouveaux = DEFAULTS.filter(function(a) {
        return titresExistants.indexOf(a.titre.toLowerCase()) === -1;
      });
      var merged = existing.concat(nouveaux.map(function(a) {
        return Object.assign({}, a);
      }));
      saveArticles(merged);
      return merged;
    }

    return existing;

  } catch(e) {
    console.error("Erreur getArticles:", e);
    var fallback = DEFAULTS.map(function(a) { return Object.assign({}, a); });
    saveArticles(fallback);
    return fallback;
  }
}

function saveArticles(list) {
  try {
    localStorage.setItem("lxp_version", String(VERSION));
    localStorage.setItem("lxp_articles", JSON.stringify(list));
    console.log("✓ Articles sauvegardés:", list.length);
  } catch(e) {
    console.error("Erreur saveArticles:", e);
  }
}

// ============================================================
// UTILITAIRES
// ============================================================

function getTitreFromURL() {
  var search = window.location.search;
  var match  = search.match(/[?&]titre=([^&]*)/);
  if (!match) return null;
  try {
    return decodeURIComponent(match[1]);
  } catch(e) {
    return match[1];
  }
}

function trouverArticle(articles, titre) {
  var titreLow = titre.toLowerCase().trim();
  return articles.find(function(a) {
    return a.titre.toLowerCase().trim() === titreLow;
  }) || null;
}

function getBadgeClass(cat) {
  var map = {
    distribution:  "b-distribution",
    commande:      "b-commande",
    concept:       "b-concept",
    environnement: "b-environnement",
    tutoriel:      "b-tutoriel"
  };
  return map[cat] || "b-autre";
}

function excerpt(text, len) {
  len = len || 160;
  return text.replace(/\n/g, " ").trim().substring(0, len) + "...";
}

function flash(msg, isErr) {
  var old = document.querySelector(".flash");
  if (old) old.remove();
  var el = document.createElement("div");
  el.className = "flash" + (isErr ? " err" : "");
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(function() { if (el.parentNode) el.remove(); }, 3000);
}

function escapeHtml(text) {
  var div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function mdToHtml(text) {
  var articles = getArticles();
  var images = [];
  text = text.replace(/!\[.*?\]\((.+?)\)/g, function(match, url) {
    var token = "%%IMG_" + images.length + "%%";
    images.push('<img src="' + url + '" class="article-img" alt="image">');
    return token;
  });

  var h = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  h = h
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm,  "<h2>$1</h2>")
    .replace(/^# (.+)$/gm,   "<h1>$1</h1>")
    .replace(/\*\*(.+?)\*\*/g, "<b>$1</b>")
    .replace(/\*(.+?)\*/g,     "<i>$1</i>")
    .replace(/\n/g, "<br>");

  articles.forEach(function(a) {
    var esc = a.titre.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    h = h.replace(
      new RegExp("\\b(" + esc + ")\\b", "gi"),
      '<a href="article.html?titre=' + encodeURIComponent(a.titre) + '">$1</a>'
    );
  });

  images.forEach(function(imgHtml, i) {
    h = h.replace("%%IMG_" + i + "%%", imgHtml);
  });

  return h;
}

function setActiveNav(page) {
  document.querySelectorAll(".nav-link").forEach(function(l) {
    l.classList.remove("active");
  });
  var target = document.querySelector('.nav-link[data-page="' + page + '"]');
  if (target) target.classList.add("active");
}

function wrapText(id, before, after) {
  var t = document.getElementById(id);
  if (!t) return;
  var s   = t.selectionStart;
  var e   = t.selectionEnd;
  var sel = t.value.substring(s, e);
  t.value = t.value.substring(0, s) + before + sel + after + t.value.substring(e);
  t.focus();
  t.selectionStart = s + before.length;
  t.selectionEnd   = s + before.length + sel.length;
}

function insertImg(id) {
  var url = prompt("URL de l'image :");
  if (url) wrapText(id, "![image](" + url + ")", "");
}

// ============================================================
// PAGE : INDEX
// ============================================================

function initIndex() {
  setActiveNav("home");
  var articles  = getArticles();
  var statCount = document.getElementById("stat-count");
  if (statCount) statCount.textContent = articles.length;

  var container = document.getElementById("cards-grid");
  if (!container) return;

  if (articles.length === 0) {
    container.innerHTML =
      '<div class="empty"><div class="empty-icon">📭</div>' +
      '<p>Aucun article pour l\'instant.</p></div>';
    return;
  }

  container.innerHTML = "";
  articles.forEach(function(a) {
    var card = document.createElement("div");
    card.className = "card";
    card.innerHTML =
      '<h4>' + escapeHtml(a.titre) + '</h4>' +
      '<p>' + escapeHtml(excerpt(a.contenu)) + '</p>' +
      '<div class="card-foot">' +
        '<span class="badge ' + getBadgeClass(a.categorie) + '">' + escapeHtml(a.categorie) + '</span>' +
        '<span class="card-arrow">→</span>' +
      '</div>';
    (function(titre) {
      card.addEventListener("click", function() {
        window.location.href = "article.html?titre=" + encodeURIComponent(titre);
      });
    })(a.titre);
    container.appendChild(card);
  });
}

// ============================================================
// PAGE : ARTICLE
// ============================================================

function initArticle() {
  setActiveNav("");
  var titre = getTitreFromURL();
  if (!titre) {
    window.location.href = "index.html";
    return;
  }

  var articles = getArticles();
  var a = trouverArticle(articles, titre);
  var main = document.getElementById("article-main");

  if (!a) {
    if (main) {
      main.innerHTML =
        '<div class="empty">' +
          '<div class="empty-icon">🔍</div>' +
          '<p>Article "<strong>' + escapeHtml(titre) + '</strong>" introuvable.</p>' +
          '<br><a href="index.html" class="btn btn-ghost btn-sm">← Retour à l\'accueil</a>' +
        '</div>';
    }
    return;
  }

  document.title = a.titre + " — Linuxpedia";
  document.getElementById("article-titre").textContent = a.titre;

  var badge = document.getElementById("article-badge");
  badge.className = "badge " + getBadgeClass(a.categorie);
  badge.textContent = a.categorie;

  document.getElementById("article-contenu").innerHTML = mdToHtml(a.contenu);

  var tagsEl = document.getElementById("article-tags");
  if (tagsEl) {
    tagsEl.innerHTML = (a.tags && a.tags.length > 0)
      ? a.tags.map(function(t) { return '<span class="tag">' + escapeHtml(t) + '</span>'; }).join("")
      : '<span class="tag">aucun</span>';
  }

  var btnModif = document.getElementById("btn-modifier");
  if (btnModif) {
    btnModif.href = "modifier.html?titre=" + encodeURIComponent(a.titre);
  }

  var btnDel = document.getElementById("btn-supprimer");
  if (btnDel) {
    btnDel.addEventListener("click", function() {
      if (!confirm("Supprimer « " + a.titre + " » ? Cette action est irréversible.")) return;
      var list = getArticles();
      var idx = list.findIndex(function(x) {
        return x.titre.toLowerCase().trim() === a.titre.toLowerCase().trim();
      });
      if (idx !== -1) {
        list.splice(idx, 1);
        saveArticles(list);
        flash("Article supprimé.");
        setTimeout(function() { window.location.href = "index.html"; }, 800);
      }
    });
  }
}

// ============================================================
// PAGE : CRÉATION
// ============================================================

function initCreate() {
  setActiveNav("create");
  var form = document.getElementById("form-create");
  if (!form) return;

  form.addEventListener("submit", function(e) {
    e.preventDefault();

    var list = getArticles();
    var titre = document.getElementById("f-titre").value.trim();
    var cat = document.getElementById("f-cat").value;
    var contenu = document.getElementById("f-contenu").value.trim();
    var tags = document.getElementById("f-tags").value
      .split(",")
      .map(function(t) { return t.trim(); })
      .filter(function(t) { return t.length > 0; });

    if (!titre) { flash("Le titre est obligatoire.", true); return; }
    if (!contenu) { flash("Le contenu est obligatoire.", true); return; }

    var articles = getArticles();
    var doublon = trouverArticle(articles, titre);
    if (doublon) { flash("Un article avec ce titre existe déjà.", true); return; }

    var nouvelArticle = { 
      titre: titre, 
      categorie: cat, 
      contenu: contenu, 
      tags: tags 
    };
    
    articles.push(nouvelArticle);
    saveArticles(articles);
    
    console.log("✓ Article créé:", nouvelArticle);
    
    flash("Article publié !");
    setTimeout(function() {
      window.location.href = "article.html?titre=" + encodeURIComponent(titre);
    }, 800);
    var realIdx = list.findIndex(x => x.titre.toLowerCase().trim() === titre.toLowerCase().trim());

    if (realIdx === -1) {
      flash("Erreur : l'original n'existe plus.", true);
      return;
    }

    list[realIdx] = { 
      titre: nouveauTitre, 
      categorie: cat, 
      contenu: contenu, 
      tags: tags 
    };
  
      saveArticles(list);
      flash("Modifications enregistrées !");
      setTimeout(function() {
        window.location.href = "article.html?titre=" + encodeURIComponent(nouveauTitre);
      }, 800);
  });
}

// ============================================================
// PAGE : MODIFICATION
// ============================================================

function initModifier() {
  setActiveNav("");
  var titre = getTitreFromURL();
  if (!titre) { 
    window.location.href = "index.html"; 
    return; 
  }

  var articles = getArticles();
  var idx = articles.findIndex(function(x) {
    return x.titre.toLowerCase().trim() === titre.toLowerCase().trim();
  });

  if (idx === -1) {
    flash("Article introuvable.", true);
    setTimeout(function() { window.location.href = "index.html"; }, 1500);
    return;
  }

  var a = articles[idx];
  document.title = "Modifier : " + a.titre + " — Linuxpedia";

  var pageTitle = document.getElementById("modifier-page-titre");
  if (pageTitle) pageTitle.textContent = "Modifier : " + a.titre;

  document.getElementById("e-titre").value = a.titre;
  document.getElementById("e-cat").value = a.categorie;
  document.getElementById("e-contenu").value = a.contenu;
  document.getElementById("e-tags").value = (a.tags || []).join(", ");

  var form = document.getElementById("form-modifier");
  form.addEventListener("submit", function(e) {
    e.preventDefault();

    var nouveauTitre = document.getElementById("e-titre").value.trim();
    var contenu = document.getElementById("e-contenu").value.trim();
    var cat = document.getElementById("e-cat").value;
    var tags = document.getElementById("e-tags").value
      .split(",")
      .map(function(t) { return t.trim(); })
      .filter(function(t) { return t.length > 0; });

    if (!nouveauTitre) { flash("Le titre est obligatoire.", true); return; }
    if (!contenu) { flash("Le contenu est obligatoire.", true); return; }

    var list = getArticles();
    var doublon = list.findIndex(function(x) {
      return x.titre.toLowerCase().trim() === nouveauTitre.toLowerCase().trim()
          && x.titre.toLowerCase().trim() !== a.titre.toLowerCase().trim();
    });
    if (doublon !== -1) { flash("Ce titre est déjà utilisé.", true); return; }

    var articleModifie = { 
      titre: nouveauTitre, 
      categorie: cat, 
      contenu: contenu, 
      tags: tags 
    };
    
    list[idx] = articleModifie;
    saveArticles(list);
    
    console.log("✓ Article modifié:", articleModifie);
    
    flash("Modifications enregistrées !");
    setTimeout(function() {
      window.location.href = "article.html?titre=" + encodeURIComponent(nouveauTitre);
    }, 800);
  });

  var btnDel = document.getElementById("btn-supprimer");
  if (btnDel) {
    btnDel.addEventListener("click", function() {
      if (!confirm("Supprimer « " + a.titre + " » ? Cette action est irréversible.")) return;
      var list = getArticles();
      list.splice(idx, 1);
      saveArticles(list);
      flash("Article supprimé.");
      setTimeout(function() { window.location.href = "index.html"; }, 800);
    });
  }
}

// ============================================================
// PAGE : RECHERCHE
// ============================================================

function initRecherche() {
  setActiveNav("");
  var q = "";
  var match = window.location.search.match(/[?&]q=([^&]*)/);
  if (match) {
    try { q = decodeURIComponent(match[1]); } catch(e) { q = match[1]; }
  }

  var searchInput = document.getElementById("search-input");
  if (searchInput) searchInput.value = q;

  var qEl = document.getElementById("search-query");
  if (qEl) qEl.textContent = q ? "« " + q + " »" : "";

  var container = document.getElementById("resultats");
  if (!container) return;

  if (!q) {
    container.innerHTML =
      '<div class="empty"><div class="empty-icon">🔍</div>' +
      '<p>Entrez un terme de recherche.</p></div>';
    return;
  }

  var articles = getArticles();
  var ql = q.toLowerCase();
  var res = articles.filter(function(a) {
    return a.titre.toLowerCase().indexOf(ql) !== -1
        || a.contenu.toLowerCase().indexOf(ql) !== -1
        || (a.tags || []).some(function(t) {
             return t.toLowerCase().indexOf(ql) !== -1;
           });
  });

  var countEl = document.getElementById("result-count");
  if (countEl) {
    countEl.textContent = res.length + " résultat" + (res.length !== 1 ? "s" : "");
  }

  if (res.length === 0) {
    container.innerHTML =
      '<div class="empty"><div class="empty-icon">🤔</div>' +
      '<p>Aucun résultat pour « ' + escapeHtml(q) + ' ».</p></div>';
    return;
  }

  container.innerHTML = "";
  res.forEach(function(a) {
    var card = document.createElement("div");
    card.className = "result-card";
    card.innerHTML =
      '<h3><a href="article.html?titre=' + encodeURIComponent(a.titre) + '">' + escapeHtml(a.titre) + '</a></h3>' +
      '<div style="margin-bottom:.5rem">' +
        '<span class="badge ' + getBadgeClass(a.categorie) + '">' + escapeHtml(a.categorie) + '</span>' +
      '</div>' +
      '<p>' + escapeHtml(excerpt(a.contenu, 220)) + '</p>';
    container.appendChild(card);
  });
}

// ============================================================
// PAGE : HASARD
// ============================================================

function initHasard() {
  setActiveNav("hasard");
}

function allerAuHasard() {
  var articles = getArticles();
  if (articles.length === 0) {
    flash("Aucun article disponible.", true);
    return;
  }

  var a = articles[Math.floor(Math.random() * articles.length)];
  var box = document.getElementById("hasard-box");
  if (!box) return;

  box.innerHTML =
    '<div class="hasard-content">' +
      '<span class="badge ' + getBadgeClass(a.categorie) + '">' + escapeHtml(a.categorie) + '</span>' +
      '<h3>' + escapeHtml(a.titre) + '</h3>' +
      '<p>' + escapeHtml(excerpt(a.contenu, 280)) + '</p>' +
      '<a href="article.html?titre=' + encodeURIComponent(a.titre) + '" class="btn btn-green btn-sm">' +
        'Lire l\'article →' +
      '</a>' +
    '</div>';
}

// ============================================================
// BARRE DE RECHERCHE
// ============================================================

function initSearchBar() {
  var form = document.getElementById("search-form");
  if (!form) return;
  form.addEventListener("submit", function(e) {
    e.preventDefault();
    var q = document.getElementById("search-input").value.trim();
    if (q) window.location.href = "recherche.html?q=" + encodeURIComponent(q);
  });
}

// ============================================================
// POINT D'ENTRÉE
// ============================================================

document.addEventListener("DOMContentLoaded", function() {
  initSearchBar();
  var page = document.body.dataset.page;
  if (page === "index") initIndex();
  if (page === "article") initArticle();
  if (page === "create") initCreate();
  if (page === "modifier") initModifier();
  if (page === "recherche") initRecherche();
  if (page === "hasard") initHasard();
});

// ============================================================
// GESTION DES IMAGES
// ============================================================

function insererImageURL(textareaId, inputId) {
  var input = document.getElementById(inputId);
  var url = input ? input.value.trim() : "";
  if (!url) { flash("Entrez une URL d'image.", true); return; }
  wrapText(textareaId, "![image](" + url + ")\n", "");
  if (input) input.value = "";
  flash("Image insérée !");
}

function initImageZone(fileInputId, dropZoneId, previewId, textareaId) {
  var fileInput = document.getElementById(fileInputId);
  var dropZone = document.getElementById(dropZoneId);
  var preview = document.getElementById(previewId);
  if (!fileInput || !dropZone || !preview) return;

  fileInput.addEventListener("change", function() {
    traiterFichiers(fileInput.files, preview, textareaId);
    fileInput.value = "";
  });

  dropZone.addEventListener("dragover", function(e) {
    e.preventDefault();
    dropZone.classList.add("dragover");
  });
  dropZone.addEventListener("dragleave", function() {
    dropZone.classList.remove("dragover");
  });
  dropZone.addEventListener("drop", function(e) {
    e.preventDefault();
    dropZone.classList.remove("dragover");
    var files = e.dataTransfer ? e.dataTransfer.files : null;
    if (files && files.length > 0) {
      traiterFichiers(files, preview, textareaId);
    }
  });
}

function traiterFichiers(files, previewEl, textareaId) {
  for (var i = 0; i < files.length; i++) {
    var file = files[i];
    if (!file.type.startsWith("image/")) {
      flash("« " + file.name + " » n'est pas une image.", true);
      continue;
    }
    if (file.size > 2 * 1024 * 1024) {
      flash("« " + file.name + " » dépasse 2 Mo.", true);
      continue;
    }
    (function(f) {
      var reader = new FileReader();
      reader.onload = function(e) {
        var base64 = e.target.result;
        ajouterPreview(base64, f.name, previewEl, textareaId);
      };
      reader.readAsDataURL(f);
    })(file);
  }
}

function ajouterPreview(base64, nom, previewEl, textareaId) {
  var item = document.createElement("div");
  item.className = "img-preview-item";
  item.title = "Cliquer pour insérer dans l'article";

  var img = document.createElement("img");
  img.src = base64;
  img.alt = nom;

  var label = document.createElement("div");
  label.className = "insert-label";
  label.textContent = "Insérer";

  item.appendChild(img);
  item.appendChild(label);
  previewEl.appendChild(item);

  item.addEventListener("click", function() {
    wrapText(textareaId, "![" + nom + "](" + base64 + ")\n", "");
    label.textContent = "✓ Inséré !";
    item.style.borderColor = "var(--green)";
    setTimeout(function() {
      label.textContent = "Insérer";
      item.style.borderColor = "";
    }, 1500);
    flash("Image insérée dans l'article !");
  });
}
