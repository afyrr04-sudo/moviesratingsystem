<?php
// php/get_reviews.php
header('Content-Type: application/json');
require_once __DIR__ . '/db.php';

$movieId = isset($_GET['movie_id']) ? (int)$_GET['movie_id'] : 0;

if ($movieId <= 0) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid or missing movie_id']);
    exit;
}

try {
    // Check if movie exists
    $movieStmt = $pdo->prepare("SELECT title FROM movies WHERE id = ?");
    $movieStmt->execute([$movieId]);
    $movie = $movieStmt->fetch();
    
    if (!$movie) {
        http_response_code(404);
        echo json_encode(['error' => 'Movie not found']);
        exit;
    }
    
    // Fetch all reviews for this movie
    $reviewStmt = $pdo->prepare("SELECT id, user_name, rating, review_text, created_at 
                                  FROM reviews 
                                  WHERE movie_id = ? 
                                  ORDER BY created_at DESC");
    $reviewStmt->execute([$movieId]);
    $reviews = $reviewStmt->fetchAll();
    
    // Typecast values
    foreach ($reviews as &$review) {
        $review['id'] = (int)$review['id'];
        $review['rating'] = (int)$review['rating'];
    }
    unset($review);
    
    echo json_encode([
        'movie_title' => $movie['title'],
        'reviews' => $reviews
    ]);
    
} catch (\Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to fetch reviews: ' . $e->getMessage()]);
}
?>
