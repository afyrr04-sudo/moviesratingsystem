<?php
// php/manage_review.php
header('Content-Type: application/json');
require_once __DIR__ . '/db.php';

// Get JSON input
$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (!$data || !isset($data['action'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid action or request payload']);
    exit;
}

$action = $data['action'];

try {
    if ($action === 'delete') {
        $id = isset($data['id']) ? (int)$data['id'] : 0;
        if ($id <= 0) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid review ID']);
            exit;
        }
        
        // Execute delete
        $stmt = $pdo->prepare("DELETE FROM reviews WHERE id = ?");
        $stmt->execute([$id]);
        
        echo json_encode(['success' => true, 'message' => 'Review deleted successfully']);
    } else {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid action type']);
    }
} catch (\Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database operation failed: ' . $e->getMessage()]);
}
?>
