<?php
// php/manage_movie.php
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
    if ($action === 'add') {
        // Validation
        $title = isset($data['title']) ? trim($data['title']) : '';
        $poster = isset($data['poster']) ? trim($data['poster']) : '';
        $synopsis = isset($data['synopsis']) ? trim($data['synopsis']) : '';
        $ageRating = isset($data['age_rating']) ? trim($data['age_rating']) : 'G';
        $releaseDate = isset($data['release_date']) ? trim($data['release_date']) : '';
        $genre = isset($data['genre']) ? trim($data['genre']) : '';
        $isTrending = isset($data['is_trending']) ? (int)$data['is_trending'] : 0;
        
        if ($title === '' || $releaseDate === '' || $genre === '') {
            http_response_code(400);
            echo json_encode(['error' => 'Title, Genre, and Release Date are required']);
            exit;
        }
        
        $stmt = $pdo->prepare("INSERT INTO movies (title, poster, synopsis, age_rating, release_date, genre, is_trending, recommendation_type) 
                                VALUES (:title, :poster, :synopsis, :age_rating, :release_date, :genre, :is_trending, :rec_type)");
        $stmt->execute([
            'title' => $title,
            'poster' => $poster !== '' ? $poster : null,
            'synopsis' => $synopsis !== '' ? $synopsis : null,
            'age_rating' => $ageRating,
            'release_date' => $releaseDate,
            'genre' => $genre,
            'is_trending' => $isTrending,
            'rec_type' => $isTrending ? 'trending' : 'standard'
        ]);
        
        echo json_encode(['success' => true, 'id' => $pdo->lastInsertId(), 'message' => 'Movie added successfully']);
        
    } elseif ($action === 'edit') {
        $id = isset($data['id']) ? (int)$data['id'] : 0;
        $title = isset($data['title']) ? trim($data['title']) : '';
        $poster = isset($data['poster']) ? trim($data['poster']) : '';
        $synopsis = isset($data['synopsis']) ? trim($data['synopsis']) : '';
        $ageRating = isset($data['age_rating']) ? trim($data['age_rating']) : 'G';
        $releaseDate = isset($data['release_date']) ? trim($data['release_date']) : '';
        $genre = isset($data['genre']) ? trim($data['genre']) : '';
        $isTrending = isset($data['is_trending']) ? (int)$data['is_trending'] : 0;
        
        if ($id <= 0 || $title === '' || $releaseDate === '' || $genre === '') {
            http_response_code(400);
            echo json_encode(['error' => 'ID, Title, Genre, and Release Date are required']);
            exit;
        }
        
        $stmt = $pdo->prepare("UPDATE movies SET title = :title, poster = :poster, synopsis = :synopsis, 
                                      age_rating = :age_rating, release_date = :release_date, genre = :genre, 
                                      is_trending = :is_trending, recommendation_type = :rec_type 
                                WHERE id = :id");
        $stmt->execute([
            'id' => $id,
            'title' => $title,
            'poster' => $poster !== '' ? $poster : null,
            'synopsis' => $synopsis !== '' ? $synopsis : null,
            'age_rating' => $ageRating,
            'release_date' => $releaseDate,
            'genre' => $genre,
            'is_trending' => $isTrending,
            'rec_type' => $isTrending ? 'trending' : 'standard'
        ]);
        
        echo json_encode(['success' => true, 'message' => 'Movie updated successfully']);
        
    } elseif ($action === 'delete') {
        $id = isset($data['id']) ? (int)$data['id'] : 0;
        if ($id <= 0) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid movie ID']);
            exit;
        }
        
        $stmt = $pdo->prepare("DELETE FROM movies WHERE id = ?");
        $stmt->execute([$id]);
        
        echo json_encode(['success' => true, 'message' => 'Movie deleted successfully']);
        
    } else {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid action type']);
    }
    
} catch (\Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database operation failed: ' . $e->getMessage()]);
}
?>
