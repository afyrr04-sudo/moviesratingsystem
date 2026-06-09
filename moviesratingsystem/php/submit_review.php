<?php
// php/submit_review.php
header('Content-Type: application/json');
require_once __DIR__ . '/db.php';

// Get JSON input
$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (!$data) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON payload']);
    exit;
}

$movieId = isset($data['movie_id']) ? (int)$data['movie_id'] : 0;
$userName = isset($data['user_name']) ? trim($data['user_name']) : '';
$rating = isset($data['rating']) ? (int)$data['rating'] : 0;
$reviewText = isset($data['review_text']) ? trim($data['review_text']) : '';

// Validation
if ($movieId <= 0) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid movie_id']);
    exit;
}

if ($userName === '') {
    $userName = 'Anonymous';
}

if ($rating < 1 || $rating > 5) {
    http_response_code(400);
    echo json_encode(['error' => 'Rating must be between 1 and 5']);
    exit;
}

if ($reviewText === '') {
    http_response_code(400);
    echo json_encode(['error' => 'Review text cannot be empty']);
    exit;
}

try {
    // Check if movie exists
    $movieStmt = $pdo->prepare("SELECT id FROM movies WHERE id = ?");
    $movieStmt->execute([$movieId]);
    if (!$movieStmt->fetch()) {
        http_response_code(404);
        echo json_encode(['error' => 'Movie not found']);
        exit;
    }
    
    // Insert review
    $insertStmt = $pdo->prepare("INSERT INTO reviews (movie_id, user_name, rating, review_text) 
                                 VALUES (:movie_id, :user_name, :rating, :review_text)");
    $insertStmt->execute([
        'movie_id' => $movieId,
        'user_name' => $userName,
        'rating' => $rating,
        'review_text' => $reviewText
    ]);
    
    // Get updated average rating and review count
    $avgStmt = $pdo->prepare("SELECT COALESCE(AVG(rating), 0) AS average_rating, COUNT(id) AS review_count 
                              FROM reviews 
                              WHERE movie_id = ?");
    $avgStmt->execute([$movieId]);
    $stats = $avgStmt->fetch();
    
    echo json_encode([
        'success' => true,
        'average_rating' => (float)$stats['average_rating'],
        'review_count' => (int)$stats['review_count']
    ]);
    
} catch (\Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to submit review: ' . $e->getMessage()]);
}
?>
