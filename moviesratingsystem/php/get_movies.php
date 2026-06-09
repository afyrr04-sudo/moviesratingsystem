<?php
// php/get_movies.php
header('Content-Type: application/json');
require_once __DIR__ . '/db.php';

// Retrieve filter parameters
$q = isset($_GET['q']) ? trim($_GET['q']) : '';
$genre = isset($_GET['genre']) ? trim($_GET['genre']) : '';
$status = isset($_GET['status']) ? trim($_GET['status']) : ''; // 'all', 'released', 'upcoming'
$sort = isset($_GET['sort']) ? trim($_GET['sort']) : ''; // 'rating', 'release_date', 'title'

try {
    // Build SQL query
    $sql = "SELECT m.*, COALESCE(AVG(r.rating), 0) AS average_rating, COUNT(r.id) AS review_count
            FROM movies m
            LEFT JOIN reviews r ON m.id = r.movie_id";
    
    $whereClauses = [];
    $params = [];
    
    if ($q !== '') {
        $whereClauses[] = "(m.title LIKE :q OR m.synopsis LIKE :q_syn)";
        $params['q'] = '%' . $q . '%';
        $params['q_syn'] = '%' . $q . '%';
    }
    
    if ($genre !== '' && strtolower($genre) !== 'all') {
        $whereClauses[] = "m.genre = :genre";
        $params['genre'] = $genre;
    }
    
    $today = date('Y-m-d');
    if ($status === 'released') {
        $whereClauses[] = "m.release_date <= :today1";
        $params['today1'] = $today;
    } elseif ($status === 'upcoming') {
        $whereClauses[] = "m.release_date > :today2";
        $params['today2'] = $today;
    }
    
    if (!empty($whereClauses)) {
        $sql .= " WHERE " . implode(" AND ", $whereClauses);
    }
    
    $sql .= " GROUP BY m.id";
    
    // Sorting
    if ($sort === 'rating') {
        $sql .= " ORDER BY average_rating DESC, m.title ASC";
    } elseif ($sort === 'release_date') {
        // For upcoming, we want soonest first, for released we want newest first. 
        // We can sort by release_date DESC as default.
        $sql .= " ORDER BY m.release_date DESC, m.title ASC";
    } elseif ($sort === 'title') {
        $sql .= " ORDER BY m.title ASC";
    } else {
        $sql .= " ORDER BY m.is_trending DESC, m.release_date DESC";
    }
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $movies = $stmt->fetchAll();
    
    // Fetch ticket prices for each movie
    foreach ($movies as &$movie) {
        $movie['id'] = (int)$movie['id'];
        $movie['is_trending'] = (int)$movie['is_trending'];
        $movie['average_rating'] = (float)$movie['average_rating'];
        $movie['review_count'] = (int)$movie['review_count'];
        
        $priceStmt = $pdo->prepare("SELECT cinema_name, ticket_price, booking_url FROM ticket_prices WHERE movie_id = ? ORDER BY ticket_price ASC");
        $priceStmt->execute([$movie['id']]);
        $prices = $priceStmt->fetchAll();
        
        foreach ($prices as &$price) {
            $price['ticket_price'] = (float)$price['ticket_price'];
        }
        
        $movie['ticket_prices'] = $prices;
    }
    unset($movie); // unset reference
    
    echo json_encode($movies);
    
} catch (\Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to fetch movies: ' . $e->getMessage()]);
}
?>
