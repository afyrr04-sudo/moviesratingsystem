<?php
// php/manage_price.php
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
$cinemaName = isset($data['cinema_name']) ? trim($data['cinema_name']) : '';
$ticketPrice = isset($data['ticket_price']) ? (float)$data['ticket_price'] : -1.0;

// Validation
if ($movieId <= 0 || $cinemaName === '' || $ticketPrice < 0) {
    http_response_code(400);
    echo json_encode(['error' => 'Valid movie_id, cinema_name, and ticket_price (>= 0) are required']);
    exit;
}

try {
    // Check if movie exists
    $movieStmt = $pdo->prepare("SELECT id, title FROM movies WHERE id = ?");
    $movieStmt->execute([$movieId]);
    $movie = $movieStmt->fetch();
    if (!$movie) {
        http_response_code(404);
        echo json_encode(['error' => 'Movie not found']);
        exit;
    }
    
    // Check if price already exists for this combination
    $checkStmt = $pdo->prepare("SELECT id FROM ticket_prices WHERE movie_id = ? AND cinema_name = ?");
    $checkStmt->execute([$movieId, $cinemaName]);
    $existing = $checkStmt->fetch();
    
    if ($existing) {
        // Update
        $updateStmt = $pdo->prepare("UPDATE ticket_prices SET ticket_price = ? WHERE id = ?");
        $updateStmt->execute([$ticketPrice, $existing['id']]);
        $message = "Ticket price updated successfully";
    } else {
        // Insert
        $bookingUrl = 'https://www.google.com/search?q=' . urlencode($cinemaName . ' booking ' . $movie['title']);
        $insertStmt = $pdo->prepare("INSERT INTO ticket_prices (movie_id, cinema_name, ticket_price, booking_url) 
                                     VALUES (?, ?, ?, ?)");
        $insertStmt->execute([$movieId, $cinemaName, $ticketPrice, $bookingUrl]);
        $message = "Ticket price added successfully";
    }
    
    echo json_encode(['success' => true, 'message' => $message]);
    
} catch (\Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to save ticket price: ' . $e->getMessage()]);
}
?>
