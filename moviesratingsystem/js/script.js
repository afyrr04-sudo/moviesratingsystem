// js/script.js

// 1. Frontend State & Auth Management
const state = {
  isLoggedIn: sessionStorage.getItem('topflix_isLoggedIn') === 'true',
  currentUser: sessionStorage.getItem('topflix_currentUser') || null,
  activeRole: sessionStorage.getItem('topflix_activeRole') || null, // 'user', 'admin', 'agency'
  activeTab: 'now-showing', // 'now-showing', 'upcoming', 'favorites'
  searchQuery: '',
  activeGenre: 'all',
  activeSort: 'trending',
  watchlist: JSON.parse(localStorage.getItem('topflix_watchlist')) || [],
  allMovies: [], // Cache for currently loaded movies
  heroMovie: null, // The featured hero movie
  selectedAgency: sessionStorage.getItem('topflix_selectedAgency') || 'Golden Screen Cinemas (GSC)', // Default selected agency
  trendingMovies: [], // Trending movies for hero carousel
  currentHeroIndex: 0, // Current index of hero carousel movie
  heroIntervalId: null // Timer interval ID for carousel autoplay
};

// 2. DOM Elements
const DOM = {
  // Navigation & Switchers
  userNavTabs: document.getElementById('user-nav-tabs'),
  navTabs: document.querySelectorAll('.nav-tabs .tab-btn'),
  favCountBadge: document.getElementById('fav-count'),
  
  // Auth Controls in Header
  headerUserStatus: document.getElementById('header-user-status'),
  userDisplayRole: document.getElementById('user-display-role'),
  headerLogoutBtn: document.getElementById('header-logout-btn'),
  
  // Splash Screen
  splashScreen: document.getElementById('splash-screen'),
  
  // Views
  viewAuth: document.getElementById('view-auth'),
  viewUser: document.getElementById('view-user'),
  viewAdmin: document.getElementById('view-admin'),
  viewAgency: document.getElementById('view-agency'),
  
  // Auth View elements
  authTabSignin: document.getElementById('auth-tab-signin'),
  authTabSignup: document.getElementById('auth-tab-signup'),
  authForm: document.getElementById('auth-form'),
  authMode: document.getElementById('auth-mode'),
  authUsername: document.getElementById('auth-username'),
  authPassword: document.getElementById('auth-password'),
  authSubmitBtn: document.getElementById('auth-submit-btn'),
  authInfoBox: document.getElementById('auth-info-box'),
  
  // User View Elements
  heroBg: document.getElementById('hero-bg'),
  heroRecommendationTag: document.getElementById('hero-recommendation-tag'),
  heroTitle: document.getElementById('hero-title'),
  heroAgeRating: document.getElementById('hero-age-rating'),
  heroGenre: document.getElementById('hero-genre'),
  heroRelease: document.getElementById('hero-release'),
  heroRating: document.getElementById('hero-rating'),
  heroSynopsis: document.getElementById('hero-synopsis'),
  heroBtnReviews: document.getElementById('hero-btn-reviews'),
  heroBtnTickets: document.getElementById('hero-btn-tickets'),
  heroPoster: document.getElementById('hero-poster'),
  searchInput: document.getElementById('search-input'),
  genreChips: document.querySelectorAll('.genre-chips-container .chip'),
  sortSelect: document.getElementById('sort-select'),
  gridTitle: document.getElementById('grid-title'),
  movieGrid: document.getElementById('movie-list'),
  noMoviesMessage: document.getElementById('no-movies-message'),
  
  // Reviews Modal
  reviewsModal: document.getElementById('reviews-modal'),
  closeReviewsModal: document.getElementById('close-reviews-modal'),
  modalMoviePoster: document.getElementById('modal-movie-poster'),
  modalMovieAge: document.getElementById('modal-movie-age'),
  modalMovieTitle: document.getElementById('modal-movie-title'),
  modalMovieGenre: document.getElementById('modal-movie-genre'),
  modalMovieRelease: document.getElementById('modal-movie-release'),
  modalMovieStars: document.getElementById('modal-movie-stars'),
  modalMovieRatingVal: document.getElementById('modal-movie-rating-val'),
  modalMovieReviewCount: document.getElementById('modal-movie-review-count'),
  modalMovieSynopsis: document.getElementById('modal-movie-synopsis'),
  modalReviewsList: document.getElementById('modal-reviews-list'),
  
  // Submit Review Form
  submitReviewForm: document.getElementById('submit-review-form'),
  reviewUsername: document.getElementById('review-username'),
  reviewText: document.getElementById('review-text'),
  reviewRatingVal: document.getElementById('review-rating-val'),
  starInputs: document.querySelectorAll('.star-rating-input .star-input'),
  submitReviewBtn: document.getElementById('submit-review-btn'),
  submitReviewBtnText: document.querySelector('#submit-review-btn .btn-text'),
  submitReviewSpinner: document.querySelector('#submit-review-btn .spinner'),
  
  // Tickets Modal
  ticketsModal: document.getElementById('tickets-modal'),
  closeTicketsModal: document.getElementById('close-tickets-modal'),
  ticketModalMovieTitle: document.getElementById('ticket-modal-movie-title'),
  ticketComparisonTbody: document.getElementById('ticket-comparison-tbody'),
  
  // Admin View Elements
  adminAddMovieBtn: document.getElementById('admin-add-movie-btn'),
  statTotalMovies: document.getElementById('stat-total-movies'),
  statAvgRating: document.getElementById('stat-avg-rating'),
  statTotalReviews: document.getElementById('stat-total-reviews'),
  adminMoviesTbody: document.getElementById('admin-movies-tbody'),
  
  // Movie Add/Edit Form Modal
  movieFormModal: document.getElementById('movie-form-modal'),
  closeMovieFormModal: document.getElementById('close-movie-form-modal'),
  movieFormHeading: document.getElementById('movie-form-heading'),
  movieFormIcon: document.getElementById('movie-form-icon'),
  movieEditorForm: document.getElementById('movie-editor-form'),
  movieFormId: document.getElementById('movie-form-id'),
  movieFormTitle: document.getElementById('movie-form-title'),
  movieFormGenre: document.getElementById('movie-form-genre'),
  movieFormAge: document.getElementById('movie-form-age'),
  movieFormDate: document.getElementById('movie-form-date'),
  movieFormTrending: document.getElementById('movie-form-trending'),
  movieFormPoster: document.getElementById('movie-form-poster'),
  movieFormSynopsis: document.getElementById('movie-form-synopsis'),
  submitMovieFormBtn: document.getElementById('submit-movie-form-btn'),
  
  // Agency View Elements
  agencyCinemaSelect: document.getElementById('agency-cinema-select'),
  agencyMoviesTbody: document.getElementById('agency-movies-tbody'),
  
  // Hero Carousel Navigation controls
  heroPrevBtn: document.getElementById('hero-prev-btn'),
  heroNextBtn: document.getElementById('hero-next-btn')
};

// 3. Authentication Routing & Gates
function checkAuthGate() {
  if (state.isLoggedIn) {
    // Hide auth card
    DOM.viewAuth.classList.add('hidden');
    
    // Set Header status
    DOM.userDisplayRole.textContent = state.activeRole === 'agency' ? `${state.selectedAgency.split(' ')[0]} Agency` : state.activeRole;
    DOM.headerUserStatus.classList.remove('hidden');
    
    // Toggle correct layout views
    DOM.viewUser.classList.add('hidden');
    DOM.viewAdmin.classList.add('hidden');
    DOM.viewAgency.classList.add('hidden');
    
    if (state.activeRole === 'user') {
      DOM.viewUser.classList.remove('hidden');
      DOM.userNavTabs.classList.remove('hidden');
    } else if (state.activeRole === 'admin') {
      DOM.viewAdmin.classList.remove('hidden');
      DOM.userNavTabs.classList.add('hidden');
    } else if (state.activeRole === 'agency') {
      DOM.viewAgency.classList.remove('hidden');
      DOM.userNavTabs.classList.add('hidden');
      DOM.agencyCinemaSelect.value = state.selectedAgency;
    }
    
    // Fetch fresh database contents
    fetchMovies();
  } else {
    // Logged out: show login panel
    DOM.viewAuth.classList.remove('hidden');
    DOM.viewUser.classList.add('hidden');
    DOM.viewAdmin.classList.add('hidden');
    DOM.viewAgency.classList.add('hidden');
    DOM.userNavTabs.classList.add('hidden');
    DOM.headerUserStatus.classList.add('hidden');
  }
}

// Log In credentials check
DOM.authForm.onsubmit = (e) => {
  e.preventDefault();
  
  const mode = DOM.authMode.value;
  const username = DOM.authUsername.value.trim().toLowerCase();
  const password = DOM.authPassword.value;
  
  if (mode === 'signin') {
    let role = null;
    if (username === 'user' && password === '1234') {
      role = 'user';
    } else if (username === 'admin' && password === '1234') {
      role = 'admin';
    } else if (username === 'agency' && password === '1234') {
      role = 'agency';
    }
    
    if (role !== null) {
      // Success
      state.isLoggedIn = true;
      state.currentUser = username;
      state.activeRole = role;
      
      sessionStorage.setItem('topflix_isLoggedIn', 'true');
      sessionStorage.setItem('topflix_currentUser', username);
      sessionStorage.setItem('topflix_activeRole', role);
      
      // Clear inputs
      DOM.authForm.reset();
      
      // Trigger Splash intro transition
      triggerSplashTransition();
    } else {
      alert("Invalid credentials! Please enter one of the demo logins:\n- user / 1234\n- admin / 1234\n- agency / 1234");
    }
  } else {
    // Sign Up mode
    alert("Registration successful! You can now sign in using the demo credentials.");
    switchAuthMode('signin');
    DOM.authForm.reset();
  }
};

function triggerSplashTransition() {
  if (!DOM.splashScreen) {
    checkAuthGate();
    return;
  }
  
  // Create or retrieve subtitle element
  let subtitleEl = document.getElementById('splash-subtitle');
  if (!subtitleEl) {
    subtitleEl = document.createElement('div');
    subtitleEl.id = 'splash-subtitle';
    subtitleEl.className = 'splash-subtitle';
    DOM.splashScreen.querySelector('.splash-content').appendChild(subtitleEl);
  }
  
  // Customize subtitle text and colors based on role
  if (state.activeRole === 'admin') {
    subtitleEl.textContent = 'Catalog Management Control';
    subtitleEl.style.color = 'var(--accent)'; // Accent red for Admin
    subtitleEl.style.textShadow = '0 0 10px var(--accent-glow)';
  } else if (state.activeRole === 'agency') {
    subtitleEl.textContent = `${state.selectedAgency.split(' ')[0]} Pricing Board`;
    subtitleEl.style.color = 'var(--cyan)'; // Cyan for Agency
    subtitleEl.style.textShadow = '0 0 10px var(--cyan-glow)';
  } else {
    subtitleEl.textContent = 'Your Premium Movie Rating Portal';
    subtitleEl.style.color = 'var(--text-muted)';
    subtitleEl.style.textShadow = 'none';
  }
  
  // Show splash, hide login
  DOM.splashScreen.classList.remove('hidden');
  DOM.splashScreen.classList.remove('dismiss');
  DOM.viewAuth.classList.add('hidden');
  
  // Wait for splash animation (1.8s), then reveal dashboard with fadeout
  setTimeout(() => {
    DOM.splashScreen.classList.add('dismiss');
    checkAuthGate();
    
    // Hide splash fully after transition completes (0.5s)
    setTimeout(() => {
      DOM.splashScreen.classList.add('hidden');
    }, 500);
  }, 1800);
}

function switchAuthMode(mode) {
  DOM.authMode.value = mode;
  if (mode === 'signin') {
    DOM.authTabSignin.classList.add('active');
    DOM.authTabSignup.classList.remove('active');
    DOM.authSubmitBtn.querySelector('.btn-text').textContent = 'Log In';
    DOM.authInfoBox.classList.remove('hidden');
  } else {
    DOM.authTabSignin.classList.remove('active');
    DOM.authTabSignup.classList.add('active');
    DOM.authSubmitBtn.querySelector('.btn-text').textContent = 'Register';
    DOM.authInfoBox.classList.add('hidden');
  }
}

DOM.authTabSignin.onclick = () => switchAuthMode('signin');
DOM.authTabSignup.onclick = () => switchAuthMode('signup');

// Log Out action
DOM.headerLogoutBtn.onclick = () => {
  state.isLoggedIn = false;
  state.currentUser = null;
  state.activeRole = null;
  
  sessionStorage.removeItem('topflix_isLoggedIn');
  sessionStorage.removeItem('topflix_currentUser');
  sessionStorage.removeItem('topflix_activeRole');
  
  checkAuthGate();
};


// 4. Watchlist (Favorites) Management
function updateWatchlistBadge() {
  if (DOM.favCountBadge) {
    DOM.favCountBadge.textContent = state.watchlist.length;
  }
}

function toggleWatchlist(movieId) {
  const index = state.watchlist.indexOf(movieId);
  if (index === -1) {
    state.watchlist.push(movieId);
  } else {
    state.watchlist.splice(index, 1);
  }
  localStorage.setItem('topflix_watchlist', JSON.stringify(state.watchlist));
  updateWatchlistBadge();
  
  if (state.activeTab === 'favorites' && state.activeRole === 'user') {
    refreshActiveView();
  }
}

// 5. API Requests
async function fetchMovies() {
  if (state.activeRole === 'user') {
    showSkeletons();
  }
  
  let statusParam = 'all';
  if (state.activeRole === 'user') {
    if (state.activeTab === 'now-showing') {
      statusParam = 'released';
    } else if (state.activeTab === 'upcoming') {
      statusParam = 'upcoming';
    } else if (state.activeTab === 'compare-prices') {
      statusParam = 'released';
    }
  }
  
  const queryParams = new URLSearchParams({
    q: state.activeRole === 'user' ? state.searchQuery : '',
    genre: state.activeRole === 'user' ? state.activeGenre : 'all',
    status: statusParam,
    sort: state.activeRole === 'user' ? state.activeSort : 'title'
  });
  
  try {
    const response = await fetch(`php/get_movies.php?${queryParams.toString()}`);
    if (!response.ok) throw new Error('Failed to fetch movies');
    const data = await response.json();
    state.allMovies = data;
    
    // Filter favorites locally if we're on the favorites tab
    if (state.activeRole === 'user' && state.activeTab === 'favorites') {
      state.allMovies = data.filter(m => state.watchlist.includes(m.id));
    }
    
    // Populate trending movies cache for carousel
    state.trendingMovies = data.filter(m => m.is_trending === 1 || m.is_trending === '1');
    if (state.trendingMovies.length === 0 && data.length > 0) {
      state.trendingMovies = data.slice(0, 3);
    }
    
    if (state.trendingMovies.length > 0 && state.activeRole === 'user') {
      // If we don't have a hero movie set, or it's not in the trending list anymore, reset
      const exists = state.trendingMovies.some(m => state.heroMovie && m.id === state.heroMovie.id);
      if (!exists) {
        state.currentHeroIndex = 0;
        state.heroMovie = state.trendingMovies[0];
        populateHero(state.heroMovie);
      } else {
        // Synchronize state.heroMovie with the latest data from trending list
        const latestInfo = state.trendingMovies.find(m => m.id === state.heroMovie.id);
        if (latestInfo) {
          state.heroMovie = latestInfo;
          populateHero(state.heroMovie);
        }
      }
      startHeroAutoPlay();
    }
    
    refreshActiveView();
  } catch (error) {
    console.error('Error fetching movies:', error);
    if (state.activeRole === 'user') {
      DOM.movieGrid.innerHTML = `<p class="no-results">Error loading movies. Please try again later.</p>`;
    }
  }
}

async function fetchReviews(movieId) {
  try {
    const response = await fetch(`php/get_reviews.php?movie_id=${movieId}`);
    if (!response.ok) throw new Error('Failed to fetch reviews');
    return await response.json();
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return null;
  }
}

async function postReview(reviewData) {
  try {
    const response = await fetch('php/submit_review.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reviewData)
    });
    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.error || 'Server error occurred');
    }
    return await response.json();
  } catch (error) {
    alert('Review Submission Failed: ' + error.message);
    return null;
  }
}

// 6. DOM Rendering & Templates
function showSkeletons() {
  DOM.movieGrid.innerHTML = `
    <div class="skeleton-loader"></div>
    <div class="skeleton-loader"></div>
    <div class="skeleton-loader"></div>
    <div class="skeleton-loader"></div>
  `;
  DOM.noMoviesMessage.classList.add('hidden');
}

function populateHero(movie) {
  if (!movie) return;
  DOM.heroBg.style.backgroundImage = `url(${movie.poster})`;
  
  if (DOM.heroPoster) {
    if (movie.poster) {
      DOM.heroPoster.src = movie.poster;
      DOM.heroPoster.style.display = 'block';
    } else {
      DOM.heroPoster.style.display = 'none';
    }
  }
  
  DOM.heroTitle.textContent = movie.title;
  DOM.heroAgeRating.textContent = movie.age_rating;
  DOM.heroGenre.textContent = movie.genre;
  
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = new Date(movie.release_date).toLocaleDateString('en-US', options);
  DOM.heroRelease.textContent = `Release Date: ${formattedDate}`;
  
  DOM.heroRating.textContent = movie.average_rating > 0 ? movie.average_rating.toFixed(1) : '—';
  DOM.heroSynopsis.textContent = movie.synopsis;
  DOM.heroRecommendationTag.textContent = movie.is_trending ? "TRENDING RECOMMENDATION" : "FEATURED CHOICE";
  
  DOM.heroBtnReviews.onclick = () => openReviewsModal(movie);
  DOM.heroBtnTickets.onclick = () => openTicketsModal(movie);
}

function startHeroAutoPlay() {
  if (state.heroIntervalId) {
    clearInterval(state.heroIntervalId);
  }
  state.heroIntervalId = setInterval(() => {
    nextHeroMovie();
  }, 5000); // Rotate every 5 seconds
}

function nextHeroMovie() {
  if (state.trendingMovies.length === 0) return;
  state.currentHeroIndex = (state.currentHeroIndex + 1) % state.trendingMovies.length;
  state.heroMovie = state.trendingMovies[state.currentHeroIndex];
  populateHero(state.heroMovie);
}

function prevHeroMovie() {
  if (state.trendingMovies.length === 0) return;
  state.currentHeroIndex = (state.currentHeroIndex - 1 + state.trendingMovies.length) % state.trendingMovies.length;
  state.heroMovie = state.trendingMovies[state.currentHeroIndex];
  populateHero(state.heroMovie);
}

function refreshActiveView() {
  if (state.activeRole === 'user') {
    renderMoviesGrid();
  } else if (state.activeRole === 'admin') {
    renderAdminGrid();
  } else if (state.activeRole === 'agency') {
    renderAgencyGrid();
  }
}

// USER VIEW: Render Movies Grid
function renderMoviesGrid() {
  DOM.movieGrid.style.display = 'grid';
  DOM.movieGrid.innerHTML = '';
  
  if (state.activeTab === 'compare-prices') {
    renderPriceMatrixTable();
    return;
  }
  
  if (state.activeTab === 'upcoming') {
    renderTimelineCalendar();
    return;
  }
  
  if (state.activeTab === 'favorites') {
    renderWatchlistList();
    return;
  }
  
  if (state.allMovies.length === 0) {
    DOM.noMoviesMessage.classList.remove('hidden');
    return;
  }
  
  DOM.noMoviesMessage.classList.add('hidden');
  
  state.allMovies.forEach(movie => {
    const isFav = state.watchlist.includes(movie.id);
    const card = document.createElement('div');
    card.className = `card ${movie.is_trending ? 'trending-card' : ''}`;
    
    let posterHTML = '';
    if (movie.poster) {
      posterHTML = `<img src="${movie.poster}" alt="${movie.title} Poster" onerror="this.outerHTML='<div class=\\'poster-fallback\\'><div class=\\'poster-fallback-icon\\'>🎬</div><div class=\\'poster-fallback-title\\'>${movie.title}</div></div>'" />`;
    } else {
      posterHTML = `
        <div class="poster-fallback">
          <div class="poster-fallback-icon">🎬</div>
          <div class="poster-fallback-title">${movie.title}</div>
        </div>
      `;
    }
    
    const formattedDate = new Date(movie.release_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    const trendingBadge = movie.is_trending ? `<div class="card-trending-badge">🔥 TRENDING</div>` : '';
    
    card.innerHTML = `
      <div class="card-poster-wrap">
        ${posterHTML}
        <div class="card-age-rating">${movie.age_rating}</div>
        ${trendingBadge}
        <button class="card-fav-btn ${isFav ? 'active' : ''}" data-id="${movie.id}">
          ★
        </button>
      </div>
      <div class="card-content">
        <div class="card-genre-tag">${movie.genre}</div>
        <h3>${movie.title}</h3>
        <div class="card-release-date">Released: ${formattedDate}</div>
        
        <div class="card-footer">
          <div class="card-rating-wrap">
            <div class="card-rating">
              <span class="star">★</span>
              <span class="card-rating-value">${movie.average_rating > 0 ? movie.average_rating.toFixed(1) : '—'}</span>
            </div>
            <div class="card-reviews-count">${movie.review_count} reviews</div>
          </div>
          <div class="card-actions">
            <button class="btn btn-secondary btn-sm btn-reviews" data-id="${movie.id}">Reviews</button>
            <button class="btn btn-primary btn-sm btn-tickets" data-id="${movie.id}">Tickets</button>
          </div>
        </div>
      </div>
    `;
    
    const favBtn = card.querySelector('.card-fav-btn');
    favBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleWatchlist(movie.id);
      favBtn.classList.toggle('active');
    });
    
    card.querySelector('.btn-reviews').onclick = () => openReviewsModal(movie);
    card.querySelector('.btn-tickets').onclick = () => openTicketsModal(movie);
    
    DOM.movieGrid.appendChild(card);
  });
}

function renderPriceMatrixTable() {
  DOM.movieGrid.innerHTML = '';
  DOM.movieGrid.style.display = 'grid';
  DOM.movieGrid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(320px, 1fr))';
  DOM.movieGrid.style.gap = '1.5rem';
  
  // Filter for released/current movies
  const today = new Date().toISOString().split('T')[0];
  const releasedMovies = state.allMovies.filter(m => m.release_date <= today);
  
  if (releasedMovies.length === 0) {
    DOM.movieGrid.style.display = 'block';
    DOM.movieGrid.innerHTML = `
      <div class="no-results">
        <div class="no-results-icon">🎟️</div>
        <h3>No ticket prices available</h3>
        <p>No currently released movies have active ticket pricing data.</p>
      </div>
    `;
    return;
  }
  
  releasedMovies.forEach(movie => {
    const card = document.createElement('div');
    card.className = 'price-compare-card';
    
    // Find prices for each provider
    const gscPrice = movie.ticket_prices.find(p => p.cinema_name.includes('GSC'));
    const tgvPrice = movie.ticket_prices.find(p => p.cinema_name.includes('TGV'));
    const mboPrice = movie.ticket_prices.find(p => p.cinema_name.includes('MBO'));
    const dboxPrice = movie.ticket_prices.find(p => p.cinema_name.includes('D-BOX'));
    
    const gscVal = gscPrice ? gscPrice.ticket_price : null;
    const tgvVal = tgvPrice ? tgvPrice.ticket_price : null;
    const mboVal = mboPrice ? mboPrice.ticket_price : null;
    const dboxVal = dboxPrice ? dboxPrice.ticket_price : null;
    
    // Calculate lowest price
    const validPrices = [gscVal, tgvVal, mboVal, dboxVal].filter(v => v !== null && v > 0);
    let minPrice = null;
    
    if (validPrices.length > 0) {
      minPrice = Math.min(...validPrices);
    }
    
    const providers = [
      { name: 'Golden Screen Cinemas (GSC)', code: 'gsc', price: gscVal, obj: gscPrice },
      { name: 'TGV Cinemas', code: 'tgv', price: tgvVal, obj: tgvPrice },
      { name: 'MBO Cinemas', code: 'mbo', price: mboVal, obj: mboPrice },
      { name: 'D-BOX Premium', code: 'dbox', price: dboxVal, obj: dboxPrice }
    ];
    
    let rowsHTML = '';
    providers.forEach(p => {
      const isBest = p.price !== null && p.price === minPrice;
      const priceStr = p.price ? `RM ${p.price.toFixed(2)}` : 'N/A';
      const rowClass = `price-provider-row ${p.code} ${isBest ? 'best-deal' : ''}`;
      const badgeHTML = isBest ? '<span class="best-badge">BEST VALUE</span>' : '';
      const actionHTML = p.price 
        ? `<a href="${p.obj.booking_url}" target="_blank" class="price-book-btn">Book ↗</a>`
        : `<span class="price-unavailable">N/A</span>`;
        
      rowsHTML += `
        <div class="${rowClass}">
          <div class="cinema-info">
            <span class="cinema-logo-dot"></span>
            <span class="cinema-name-short">${p.name.replace(' Cinemas', '').replace(' Premium', '')}</span>
          </div>
          <div class="price-value-wrap">
            <span class="price-text">${priceStr}</span>
            ${badgeHTML}
          </div>
          <div class="price-action">
            ${actionHTML}
          </div>
        </div>
      `;
    });
    
    card.innerHTML = `
      <div class="price-card-header">
        <div class="price-card-poster-wrap">
          <img src="${movie.poster}" alt="${movie.title}" onerror="this.src='https://via.placeholder.com/60x90?text=Movie'" />
        </div>
        <div class="price-card-meta">
          <span class="price-card-genre">${movie.genre}</span>
          <h4>${movie.title}</h4>
          <div class="price-card-rating">
            <span class="star-gold">★</span>
            <span class="rating-num">${movie.average_rating > 0 ? movie.average_rating.toFixed(1) : '—'}</span>
            <span class="review-count-pill">(${movie.review_count} reviews)</span>
          </div>
        </div>
      </div>
      <div class="price-providers-list">
        ${rowsHTML}
      </div>
    `;
    
    DOM.movieGrid.appendChild(card);
  });
}

function renderTimelineCalendar() {
  DOM.movieGrid.innerHTML = '';
  DOM.movieGrid.style.display = 'block';
  
  const today = new Date().toISOString().split('T')[0];
  const upcomingMovies = state.allMovies.filter(m => m.release_date > today);
  
  if (upcomingMovies.length === 0) {
    DOM.movieGrid.innerHTML = `
      <div class="no-results">
        <div class="no-results-icon">📅</div>
        <h3>No upcoming releases</h3>
        <p>No future movie releases are currently scheduled in the calendar.</p>
      </div>
    `;
    return;
  }
  
  const timelineWrap = document.createElement('div');
  timelineWrap.className = 'timeline-container';
  
  const track = document.createElement('div');
  track.className = 'timeline-track';
  timelineWrap.appendChild(track);
  
  upcomingMovies.forEach(movie => {
    const isFav = state.watchlist.includes(movie.id);
    const item = document.createElement('div');
    item.className = 'timeline-item';
    
    const dateObj = new Date(movie.release_date);
    const monthStr = dateObj.toLocaleDateString('en-US', { month: 'short' });
    const dayStr = dateObj.getDate();
    const yearStr = dateObj.getFullYear();
    
    const todayObj = new Date('2026-06-09');
    const diffTime = dateObj - todayObj;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    const posterHTML = movie.poster 
      ? `<img src="${movie.poster}" alt="${movie.title} Poster" class="timeline-poster" onerror="this.outerHTML='<div class=\\'timeline-poster-fallback\\'>🎬</div>'" />`
      : `<div class="timeline-poster-fallback">🎬</div>`;
      
    item.innerHTML = `
      <div class="timeline-node">
        <div class="calendar-badge">
          <span class="cal-month">${monthStr}</span>
          <span class="cal-day">${dayStr}</span>
          <span class="cal-year">${yearStr}</span>
        </div>
      </div>
      <div class="timeline-card">
        <div class="timeline-card-media">
          ${posterHTML}
          <div class="timeline-card-age">${movie.age_rating}</div>
        </div>
        <div class="timeline-card-content">
          <div class="timeline-card-header">
            <span class="timeline-card-genre">${movie.genre}</span>
            <span class="timeline-countdown-badge">🔥 Releasing in ${diffDays} days</span>
          </div>
          <h3>${movie.title}</h3>
          <p class="timeline-synopsis">${movie.synopsis || 'No storyline details available yet.'}</p>
          <div class="timeline-card-footer">
            <span class="timeline-release-date">Release Date: ${movie.release_date}</span>
            <button class="btn btn-sm ${isFav ? 'btn-primary' : 'btn-secondary'} btn-watchlist-toggle" data-id="${movie.id}">
              ${isFav ? '★ Bookmarked' : '+ Add to Watchlist'}
            </button>
          </div>
        </div>
      </div>
    `;
    
    item.querySelector('.btn-watchlist-toggle').onclick = () => {
      toggleWatchlist(movie.id);
      renderTimelineCalendar();
    };
    
    timelineWrap.appendChild(item);
  });
  
  DOM.movieGrid.appendChild(timelineWrap);
}

function renderWatchlistList() {
  DOM.movieGrid.innerHTML = '';
  DOM.movieGrid.style.display = 'grid';
  DOM.movieGrid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(320px, 1fr))';
  DOM.movieGrid.style.gap = '1.5rem';
  
  const watchlistMovies = state.allMovies.filter(movie => state.watchlist.includes(movie.id));
  
  if (watchlistMovies.length === 0) {
    DOM.movieGrid.style.display = 'block';
    DOM.movieGrid.innerHTML = `
      <div class="no-results">
        <div class="no-results-icon">★</div>
        <h3>Your watchlist is empty</h3>
        <p>Browse Now Showing or Release Calendar to add movies you want to save.</p>
        <button class="btn btn-primary" id="watchlist-empty-browse-btn" style="margin-top: 1.25rem;">Browse Movies</button>
      </div>
    `;
    document.getElementById('watchlist-empty-browse-btn').onclick = () => {
      const showTab = document.querySelector('[data-tab="now-showing"]');
      if (showTab) showTab.click();
    };
    return;
  }
  
  watchlistMovies.forEach(movie => {
    const card = document.createElement('div');
    card.className = 'watchlist-item-card';
    
    const posterHTML = movie.poster 
      ? `<img src="${movie.poster}" alt="Poster" class="watchlist-item-poster" onerror="this.src='https://via.placeholder.com/60x90?text=Movie'" />`
      : `<div class="watchlist-item-poster-fallback">🎬</div>`;
      
    const isReleased = new Date(movie.release_date) <= new Date('2026-06-09');
    const statusBadge = isReleased 
      ? `<span class="watchlist-status released">Now Showing</span>`
      : `<span class="watchlist-status upcoming">Upcoming</span>`;
      
    card.innerHTML = `
      <div class="watchlist-item-left">
        ${posterHTML}
        <button class="watchlist-item-remove-btn" title="Remove from watchlist">&times;</button>
      </div>
      <div class="watchlist-item-right">
        <div class="watchlist-item-meta">
          <span class="watchlist-item-genre">${movie.genre}</span>
          ${statusBadge}
        </div>
        <h4>${movie.title}</h4>
        <div class="watchlist-item-rating">
          <span class="star-gold">★</span>
          <strong>${movie.average_rating > 0 ? movie.average_rating.toFixed(1) : '—'}</strong>
          <span class="review-count-small">(${movie.review_count})</span>
        </div>
        <div class="watchlist-item-actions">
          <button class="btn btn-secondary btn-sm btn-details">Details</button>
          ${isReleased 
            ? `<button class="btn btn-primary btn-sm btn-tickets">Tickets</button>` 
            : `<button class="btn btn-secondary btn-sm" disabled style="opacity: 0.4; cursor: not-allowed;">Tickets</button>`}
        </div>
      </div>
    `;
    
    card.querySelector('.btn-details').onclick = () => openReviewsModal(movie);
    if (isReleased) {
      card.querySelector('.btn-tickets').onclick = () => openTicketsModal(movie);
    }
    card.querySelector('.watchlist-item-remove-btn').onclick = (e) => {
      e.stopPropagation();
      toggleWatchlist(movie.id);
    };
    
    DOM.movieGrid.appendChild(card);
  });
}

// ADMIN VIEW: Render Admin Dashboard Table
function renderAdminGrid() {
  DOM.adminMoviesTbody.innerHTML = '';
  
  // Calculate Stats
  const totalMovies = state.allMovies.length;
  let totalReviews = 0;
  let ratingProductSum = 0;
  
  state.allMovies.forEach(m => {
    totalReviews += m.review_count;
    ratingProductSum += m.average_rating * m.review_count;
  });
  
  const avgRating = totalReviews > 0 ? (ratingProductSum / totalReviews).toFixed(1) : '0.0';
  
  DOM.statTotalMovies.textContent = totalMovies;
  DOM.statAvgRating.textContent = avgRating;
  DOM.statTotalReviews.textContent = totalReviews;
  
  if (state.allMovies.length === 0) {
    DOM.adminMoviesTbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-muted); padding: 2rem;">No movies inside catalog. Click Add New Movie to populate.</td></tr>`;
    return;
  }
  
  state.allMovies.forEach(movie => {
    const tr = document.createElement('tr');
    
    const posterHTML = movie.poster 
      ? `<img src="${movie.poster}" alt="Poster" class="admin-table-poster" onerror="this.src='https://via.placeholder.com/44x64?text=Movie'" />`
      : `<div class="admin-table-poster" style="background: #1e1b4b; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; color: #fff;">🎬</div>`;
      
    const formattedDate = new Date(movie.release_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    
    tr.innerHTML = `
      <td>${posterHTML}</td>
      <td><strong>${movie.title}</strong> ${movie.is_trending ? '<span class="age-badge" style="border-color: var(--accent); color: var(--accent);">TRENDING</span>' : ''}</td>
      <td><span class="genre-tag">${movie.genre}</span></td>
      <td>${formattedDate}</td>
      <td><span class="age-badge">${movie.age_rating}</span></td>
      <td>
        <span class="star" style="color: var(--primary);">★</span> 
        <strong>${movie.average_rating > 0 ? movie.average_rating.toFixed(1) : '—'}</strong> 
        <span style="font-size: 0.8rem; color: var(--text-muted);">(${movie.review_count})</span>
      </td>
      <td>
        <div class="admin-table-actions">
          <button class="btn btn-secondary btn-sm btn-edit" data-id="${movie.id}">Edit</button>
          <button class="btn btn-secondary btn-sm btn-admin-reviews" data-id="${movie.id}">Reviews</button>
          <button class="btn btn-danger btn-sm btn-delete" data-id="${movie.id}">Delete</button>
        </div>
      </td>
    `;
    
    tr.querySelector('.btn-edit').onclick = () => openMovieFormModal(movie);
    tr.querySelector('.btn-admin-reviews').onclick = () => openReviewsModal(movie);
    tr.querySelector('.btn-delete').onclick = () => handleDeleteMovie(movie.id);
    
    DOM.adminMoviesTbody.appendChild(tr);
  });
}

// AGENCY VIEW: Render Agency Dashboard Table
function renderAgencyGrid() {
  DOM.agencyMoviesTbody.innerHTML = '';
  
  // Agency only manages released/current movies
  const today = new Date().toISOString().split('T')[0];
  const activeMovies = state.allMovies.filter(m => m.release_date <= today);
  
  if (activeMovies.length === 0) {
    DOM.agencyMoviesTbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--text-muted); padding: 2rem;">No released movies found.</td></tr>`;
    return;
  }
  
  activeMovies.forEach(movie => {
    const tr = document.createElement('tr');
    
    const posterHTML = movie.poster 
      ? `<img src="${movie.poster}" alt="Poster" class="admin-table-poster" onerror="this.src='https://via.placeholder.com/44x64?text=Movie'" />`
      : `<div class="admin-table-poster" style="background: #1e1b4b; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; color: #fff;">🎬</div>`;
      
    const formattedDate = new Date(movie.release_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    
    const currentPriceObj = movie.ticket_prices.find(p => p.cinema_name === state.selectedAgency);
    const currentPrice = currentPriceObj ? currentPriceObj.ticket_price : 0.00;
    
    tr.innerHTML = `
      <td>${posterHTML}</td>
      <td><strong>${movie.title}</strong></td>
      <td>${formattedDate}</td>
      <td>
        <div class="agency-price-input-wrap">
          <span>MYR</span>
          <input type="number" step="0.50" min="0.00" class="agency-price-input" id="price-input-${movie.id}" value="${currentPrice > 0 ? currentPrice.toFixed(2) : ''}" placeholder="0.00" />
        </div>
      </td>
      <td>
        <button class="btn btn-primary btn-sm btn-save-price" data-id="${movie.id}">Save Rate</button>
      </td>
    `;
    
    tr.querySelector('.btn-save-price').onclick = () => handleSaveAgencyPrice(movie.id);
    
    DOM.agencyMoviesTbody.appendChild(tr);
  });
}

// 7. Interactive Modal Handlers

// REVIEWS MODAL
async function openReviewsModal(movie) {
  DOM.submitReviewForm.reset();
  DOM.reviewRatingVal.value = '0';
  DOM.starInputs.forEach(s => s.classList.remove('active'));
  DOM.submitReviewForm.dataset.movieId = movie.id;
  
  if (state.activeRole === 'admin') {
    DOM.submitReviewForm.classList.add('hidden');
  } else {
    DOM.submitReviewForm.classList.remove('hidden');
  }
  
  DOM.modalMovieTitle.textContent = movie.title;
  DOM.modalMovieAge.textContent = movie.age_rating;
  DOM.modalMovieGenre.textContent = movie.genre;
  
  const formattedDate = new Date(movie.release_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  DOM.modalMovieRelease.textContent = `Released: ${formattedDate}`;
  DOM.modalMovieSynopsis.textContent = movie.synopsis;
  
  if (movie.poster) {
    DOM.modalMoviePoster.src = movie.poster;
    DOM.modalMoviePoster.style.display = 'block';
  } else {
    DOM.modalMoviePoster.style.display = 'none';
  }
  
  updateModalRatingStats(movie.average_rating, movie.review_count);
  
  DOM.reviewsModal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  
  DOM.modalReviewsList.innerHTML = `<div class="spinner" style="margin: 2rem auto;"></div>`;
  const data = await fetchReviews(movie.id);
  
  if (data && data.reviews) {
    renderReviewsList(data.reviews, movie.id);
  } else {
    DOM.modalReviewsList.innerHTML = `<p class="no-reviews">Could not load reviews.</p>`;
  }
}

function updateModalRatingStats(avg, count) {
  DOM.modalMovieRatingVal.textContent = avg > 0 ? avg.toFixed(1) : '—';
  DOM.modalMovieReviewCount.textContent = `(${count} reviews)`;
  const percent = avg > 0 ? (avg / 5) * 100 : 0;
  DOM.modalMovieStars.style.width = `${percent}%`;
}

function renderReviewsList(reviews, movieId) {
  DOM.modalReviewsList.innerHTML = '';
  
  if (reviews.length === 0) {
    DOM.modalReviewsList.innerHTML = `<p class="no-reviews">Be the first to share your experience!</p>`;
    return;
  }
  
  reviews.forEach(r => {
    const item = document.createElement('div');
    item.className = 'review-item';
    
    let starsStr = '';
    for (let i = 1; i <= 5; i++) {
      starsStr += i <= r.rating ? '★' : '☆';
    }
    
    const timeStr = new Date(r.created_at).toLocaleDateString('en-US', { hour: '2-digit', minute: '2-digit' });
    
    let deleteBtnHTML = '';
    if (state.activeRole === 'admin') {
      deleteBtnHTML = `<button class="btn btn-danger btn-sm btn-delete-review" data-id="${r.id}" style="padding: 0.2rem 0.5rem; font-size: 0.75rem;">Delete Review</button>`;
    }
    
    item.innerHTML = `
      <div class="review-header">
        <span class="review-username">${r.user_name}</span>
        <span class="review-stars">${starsStr}</span>
      </div>
      <p class="review-text">${r.review_text}</p>
      <div class="review-footer" style="display: flex; justify-content: space-between; align-items: center; margin-top: 0.5rem;">
        ${deleteBtnHTML}
        <div class="review-date" style="margin-left: auto;">${timeStr}</div>
      </div>
    `;
    
    if (state.activeRole === 'admin') {
      item.querySelector('.btn-delete-review').onclick = () => handleDeleteReview(r.id, movieId);
    }
    
    DOM.modalReviewsList.appendChild(item);
  });
}

// Submit review action
DOM.submitReviewForm.onsubmit = async (e) => {
  e.preventDefault();
  
  const movieId = parseInt(DOM.submitReviewForm.dataset.movieId);
  const rating = parseInt(DOM.reviewRatingVal.value);
  const userName = DOM.reviewUsername.value.trim();
  const reviewText = DOM.reviewText.value.trim();
  
  if (rating === 0) {
    alert('Please select a star rating before submitting!');
    return;
  }
  
  DOM.submitReviewBtn.disabled = true;
  DOM.submitReviewBtnText.classList.add('hidden');
  DOM.submitReviewSpinner.classList.remove('hidden');
  
  const payload = {
    movie_id: movieId,
    user_name: userName,
    rating: rating,
    review_text: reviewText
  };
  
  const result = await postReview(payload);
  
  DOM.submitReviewBtn.disabled = false;
  DOM.submitReviewBtnText.classList.remove('hidden');
  DOM.submitReviewSpinner.classList.add('hidden');
  
  if (result && result.success) {
    DOM.submitReviewForm.reset();
    DOM.reviewRatingVal.value = '0';
    DOM.starInputs.forEach(s => s.classList.remove('active'));
    
    updateModalRatingStats(result.average_rating, result.review_count);
    
    const item = document.createElement('div');
    item.className = 'review-item';
    let starsStr = '';
    for (let i = 1; i <= 5; i++) {
      starsStr += i <= rating ? '★' : '☆';
    }
    item.innerHTML = `
      <div class="review-header">
        <span class="review-username">${userName}</span>
        <span class="review-stars">${starsStr}</span>
      </div>
      <p class="review-text">${reviewText}</p>
      <div class="review-date">Just Now</div>
    `;
    DOM.modalReviewsList.insertBefore(item, DOM.modalReviewsList.firstChild);
    
    fetchMovies();
  }
};

// Star Input Selector Click
DOM.starInputs.forEach(star => {
  star.addEventListener('click', () => {
    const val = parseInt(star.dataset.val);
    DOM.reviewRatingVal.value = val;
    DOM.starInputs.forEach(s => {
      const sVal = parseInt(s.dataset.val);
      if (sVal <= val) {
        s.classList.add('active');
      } else {
        s.classList.remove('active');
      }
    });
  });
});

// TICKETS COMPARISON MODAL
function openTicketsModal(movie) {
  DOM.ticketModalMovieTitle.textContent = movie.title;
  DOM.ticketComparisonTbody.innerHTML = '';
  
  const prices = movie.ticket_prices || [];
  
  if (prices.length === 0) {
    DOM.ticketComparisonTbody.innerHTML = `
      <tr>
        <td colspan="3" style="text-align: center; color: var(--text-muted); padding: 2rem;">
          🎟️ Tickets are not available yet for this upcoming release.
        </td>
      </tr>
    `;
  } else {
    prices.forEach(p => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${p.cinema_name}</strong></td>
        <td><span class="ticket-price-val">MYR ${p.ticket_price.toFixed(2)}</span></td>
        <td>
          <a href="${p.booking_url}" target="_blank" class="btn btn-secondary btn-sm">
            Book Now ↗
          </a>
        </td>
      `;
      DOM.ticketComparisonTbody.appendChild(tr);
    });
  }
  
  DOM.ticketsModal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

// ADMIN FORM MODAL: ADD/EDIT MOVIE
function openMovieFormModal(movie = null) {
  DOM.movieEditorForm.reset();
  DOM.movieFormId.value = '';
  DOM.movieFormTrending.checked = false;
  
  if (movie) {
    DOM.movieFormHeading.textContent = "Edit Movie Metadata";
    DOM.movieFormIcon.textContent = "✏️";
    DOM.movieFormId.value = movie.id;
    DOM.movieFormTitle.value = movie.title;
    DOM.movieFormGenre.value = movie.genre;
    DOM.movieFormAge.value = movie.age_rating;
    DOM.movieFormDate.value = movie.release_date;
    DOM.movieFormTrending.checked = movie.is_trending === 1;
    DOM.movieFormPoster.value = movie.poster || '';
    DOM.movieFormSynopsis.value = movie.synopsis || '';
  } else {
    DOM.movieFormHeading.textContent = "Add New Catalog Movie";
    DOM.movieFormIcon.textContent = "🎬";
  }
  
  DOM.movieFormModal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

// Handle Movie Add/Edit Form Submit
DOM.movieEditorForm.onsubmit = async (e) => {
  e.preventDefault();
  
  const idVal = DOM.movieFormId.value;
  const action = idVal !== '' ? 'edit' : 'add';
  
  DOM.submitMovieFormBtn.disabled = true;
  DOM.submitMovieFormBtn.querySelector('.btn-text').classList.add('hidden');
  DOM.submitMovieFormBtn.querySelector('.spinner').classList.remove('hidden');
  
  const payload = {
    action: action,
    id: idVal !== '' ? parseInt(idVal) : null,
    title: DOM.movieFormTitle.value.trim(),
    genre: DOM.movieFormGenre.value,
    age_rating: DOM.movieFormAge.value,
    release_date: DOM.movieFormDate.value,
    is_trending: DOM.movieFormTrending.checked ? 1 : 0,
    poster: DOM.movieFormPoster.value.trim(),
    synopsis: DOM.movieFormSynopsis.value.trim()
  };
  
  try {
    const response = await fetch('php/manage_movie.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || 'Server request error');
    }
    
    const result = await response.json();
    if (result.success) {
      closeAllModals();
      await fetchMovies();
    }
  } catch (error) {
    alert('Failed to save movie: ' + error.message);
  } finally {
    DOM.submitMovieFormBtn.disabled = false;
    DOM.submitMovieFormBtn.querySelector('.btn-text').classList.remove('hidden');
    DOM.submitMovieFormBtn.querySelector('.spinner').classList.add('hidden');
  }
};

// Handle delete movie
async function handleDeleteMovie(movieId) {
  if (!confirm("Are you sure you want to permanently delete this movie from the catalog? This will also wipe its reviews and ticket prices.")) {
    return;
  }
  
  try {
    const response = await fetch('php/manage_movie.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'delete', id: movieId })
    });
    
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || 'Failed to delete');
    }
    
    const result = await response.json();
    if (result.success) {
      await fetchMovies();
    }
  } catch (error) {
    alert('Deletion failed: ' + error.message);
  }
}

// Handle delete review
async function handleDeleteReview(reviewId, movieId) {
  if (!confirm("Are you sure you want to permanently delete this user review?")) {
    return;
  }
  
  try {
    const response = await fetch('php/manage_review.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'delete', id: reviewId })
    });
    
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || 'Failed to delete review');
    }
    
    const result = await response.json();
    if (result.success) {
      // Reload reviews in modal
      DOM.modalReviewsList.innerHTML = `<div class="spinner" style="margin: 2rem auto;"></div>`;
      const data = await fetchReviews(movieId);
      if (data && data.reviews) {
        renderReviewsList(data.reviews, movieId);
      }
      
      // Update data and refresh catalog views
      await fetchMovies();
      
      // Update modal stats dynamically
      const updatedMovie = state.allMovies.find(m => m.id === movieId);
      if (updatedMovie) {
        updateModalRatingStats(updatedMovie.average_rating, updatedMovie.review_count);
      } else {
        updateModalRatingStats(0, 0);
      }
    }
  } catch (error) {
    alert('Failed to delete review: ' + error.message);
  }
}

// AGENCY TICKET PRICE UPDATE
async function handleSaveAgencyPrice(movieId) {
  const priceInput = document.getElementById(`price-input-${movieId}`);
  const priceVal = parseFloat(priceInput.value);
  
  if (isNaN(priceVal) || priceVal < 0) {
    alert("Please enter a valid ticket price (0.00 or higher)!");
    return;
  }
  
  const saveBtn = document.querySelector(`.btn-save-price[data-id="${movieId}"]`);
  saveBtn.disabled = true;
  saveBtn.textContent = 'Saving...';
  
  const payload = {
    movie_id: movieId,
    cinema_name: state.selectedAgency,
    ticket_price: priceVal
  };
  
  try {
    const response = await fetch('php/manage_price.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || 'Request failed');
    }
    
    const result = await response.json();
    if (result.success) {
      priceInput.style.borderColor = 'var(--cyan)';
      setTimeout(() => {
        priceInput.style.borderColor = 'var(--border-glass)';
      }, 1000);
      
      const movieObj = state.allMovies.find(m => m.id === movieId);
      if (movieObj) {
        const priceObj = movieObj.ticket_prices.find(p => p.cinema_name === state.selectedAgency);
        if (priceObj) {
          priceObj.ticket_price = priceVal;
        } else {
          movieObj.ticket_prices.push({
            cinema_name: state.selectedAgency,
            ticket_price: priceVal,
            booking_url: 'https://www.google.com/search?q=' + encodeURIComponent(state.selectedAgency + ' booking ' + movieObj.title)
          });
        }
      }
    }
  } catch (error) {
    alert("Failed to update ticket price: " + error.message);
  } finally {
    saveBtn.disabled = false;
    saveBtn.textContent = 'Save Rate';
  }
}

// Close Modals
function closeAllModals() {
  DOM.reviewsModal.classList.add('hidden');
  DOM.ticketsModal.classList.add('hidden');
  DOM.movieFormModal.classList.add('hidden');
  document.body.style.overflow = '';
}

[DOM.closeReviewsModal, DOM.closeTicketsModal, DOM.closeMovieFormModal].forEach(btn => {
  if (btn) btn.onclick = closeAllModals;
});

document.querySelectorAll('.modal-backdrop').forEach(bd => {
  bd.onclick = closeAllModals;
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeAllModals();
});

// 8. Navigation & Event Bindings

// Admin Add Movie Button
DOM.adminAddMovieBtn.onclick = () => openMovieFormModal();

// Agency Cinema Selection Change
DOM.agencyCinemaSelect.onchange = (e) => {
  state.selectedAgency = e.target.value;
  sessionStorage.setItem('topflix_selectedAgency', state.selectedAgency);
  renderAgencyGrid();
};

// User Tabs navigation
DOM.navTabs.forEach(tab => {
  tab.onclick = () => {
    DOM.navTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    
    state.activeTab = tab.dataset.tab;
    
    const toolbar = document.querySelector('.toolbar');
    if (state.activeTab === 'now-showing') {
      DOM.gridTitle.textContent = 'Now Showing';
      if (toolbar) toolbar.classList.remove('hidden');
    } else if (state.activeTab === 'upcoming') {
      DOM.gridTitle.textContent = 'Upcoming Releases Calendar';
      if (toolbar) toolbar.classList.remove('hidden');
    } else if (state.activeTab === 'compare-prices') {
      DOM.gridTitle.textContent = 'Cinema Ticket Price Matrix';
      if (toolbar) toolbar.classList.add('hidden');
    } else {
      DOM.gridTitle.textContent = 'My Watchlist';
      if (toolbar) toolbar.classList.remove('hidden');
    }
    
    fetchMovies();
  };
});

// Search inputs
let searchTimeout;
DOM.searchInput.oninput = (e) => {
  clearTimeout(searchTimeout);
  state.searchQuery = e.target.value.trim();
  searchTimeout = setTimeout(() => {
    fetchMovies();
  }, 350);
};

// Genre filter tags
DOM.genreChips.forEach(chip => {
  chip.onclick = () => {
    DOM.genreChips.forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    state.activeGenre = chip.dataset.genre;
    fetchMovies();
  };
});

// Sorting
DOM.sortSelect.onchange = (e) => {
  state.activeSort = e.target.value;
  fetchMovies();
};

// Hero Carousel Navigation Click Listeners
if (DOM.heroPrevBtn) {
  DOM.heroPrevBtn.onclick = () => {
    prevHeroMovie();
    startHeroAutoPlay(); // Reset 5s timer
  };
}

if (DOM.heroNextBtn) {
  DOM.heroNextBtn.onclick = () => {
    nextHeroMovie();
    startHeroAutoPlay(); // Reset 5s timer
  };
}

// 9. Initialization
document.addEventListener('DOMContentLoaded', () => {
  updateWatchlistBadge();
  checkAuthGate(); // Check session auth state and render active view
});
