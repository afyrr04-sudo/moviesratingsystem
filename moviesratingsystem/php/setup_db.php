<?php
// php/setup_db.php

$host = '127.0.0.1';
$user = 'root';
$pass = '';

try {
    // 1. Connect to MySQL Server (no db name)
    $pdo = new PDO("mysql:host=$host;charset=utf8mb4", $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);
    
    // 2. Create database
    $pdo->exec("CREATE DATABASE IF NOT EXISTS movie_rating_system CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
    echo "Database 'movie_rating_system' created or already exists.\n";
    
    // 3. Connect to the database
    $pdo->exec("USE movie_rating_system");
    
    // 4. Drop tables if they exist to start fresh
    $pdo->exec("SET FOREIGN_KEY_CHECKS = 0;");
    $pdo->exec("DROP TABLE IF EXISTS ticket_prices;");
    $pdo->exec("DROP TABLE IF EXISTS reviews;");
    $pdo->exec("DROP TABLE IF EXISTS movies;");
    $pdo->exec("SET FOREIGN_KEY_CHECKS = 1;");
    echo "Existing tables dropped.\n";
    
    // 5. Create movies table
    $pdo->exec("CREATE TABLE movies (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        poster VARCHAR(255) DEFAULT NULL,
        synopsis TEXT DEFAULT NULL,
        age_rating VARCHAR(10) NOT NULL DEFAULT 'G',
        release_date DATE NOT NULL,
        genre VARCHAR(100) NOT NULL,
        is_trending TINYINT(1) DEFAULT 0,
        recommendation_type VARCHAR(50) DEFAULT 'standard'
    ) ENGINE=InnoDB;");
    echo "Table 'movies' created.\n";
    
    // 6. Create reviews table
    $pdo->exec("CREATE TABLE reviews (
        id INT AUTO_INCREMENT PRIMARY KEY,
        movie_id INT NOT NULL,
        user_name VARCHAR(100) NOT NULL,
        rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
        review_text TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE
    ) ENGINE=InnoDB;");
    echo "Table 'reviews' created.\n";
    
    // 7. Create ticket_prices table
    $pdo->exec("CREATE TABLE ticket_prices (
        id INT AUTO_INCREMENT PRIMARY KEY,
        movie_id INT NOT NULL,
        cinema_name VARCHAR(100) NOT NULL,
        ticket_price DECIMAL(10,2) NOT NULL,
        booking_url VARCHAR(255) DEFAULT NULL,
        FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE
    ) ENGINE=InnoDB;");
    echo "Table 'ticket_prices' created.\n";
    
    // 8. Seed movie details (Oct 2025 to Jul 2026)
    $movies = [
        [
            'title' => 'The Lost Temple',
            'poster' => 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=500&auto=format&fit=crop&q=80',
            'synopsis' => 'An archaeologist unearths a mystical amulet in the ruins of a submerged temple, triggering ancient guardians and a high-stakes race against a global syndicate.',
            'age_rating' => 'P13',
            'release_date' => '2025-10-15',
            'genre' => 'Action',
            'is_trending' => 0,
            'recommendation_type' => 'standard'
        ],
        [
            'title' => 'Spooky Mansion Shenanigans',
            'poster' => 'https://images.unsplash.com/photo-1508345228704-935cc04db5b2?w=500&auto=format&fit=crop&q=80',
            'synopsis' => 'A quirky family inherits a Victorian mansion only to find it populated by friendly, eccentric ghosts who are obsessed with throwing retro-themed disco parties.',
            'age_rating' => 'U',
            'release_date' => '2025-10-31',
            'genre' => 'Comedy',
            'is_trending' => 0,
            'recommendation_type' => 'standard'
        ],
        [
            'title' => 'Midnight Shadows',
            'poster' => 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=500&auto=format&fit=crop&q=80',
            'synopsis' => 'A nocturnal talk radio host receives chilling calls from a listener who claims to control the supernatural occurrences sweeping the city.',
            'age_rating' => '18',
            'release_date' => '2025-11-20',
            'genre' => 'Horror',
            'is_trending' => 0,
            'recommendation_type' => 'standard'
        ],
        [
            'title' => 'Yuletide Mayhem',
            'poster' => 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=500&auto=format&fit=crop&q=80',
            'synopsis' => 'Two rival families accidentally book the same remote log cabin for Christmas, leading to an escalating prank war in the snow.',
            'age_rating' => 'U',
            'release_date' => '2025-12-12',
            'genre' => 'Comedy',
            'is_trending' => 0,
            'recommendation_type' => 'standard'
        ],
        [
            'title' => 'Cybernetic Hearts',
            'poster' => 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=500&auto=format&fit=crop&q=80',
            'synopsis' => 'In a world where memories can be backed up, two former lovers meet again after voluntarily wiping their relationship logs. Can they fall in love twice?',
            'age_rating' => 'U',
            'release_date' => '2026-01-18',
            'genre' => 'Romance',
            'is_trending' => 0,
            'recommendation_type' => 'standard'
        ],
        [
            'title' => 'Nebula Odyssey',
            'poster' => 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=500&auto=format&fit=crop&q=80',
            'synopsis' => 'A lone stellar cartographer detects a mysterious repeating signal coming from the center of a dying nebula, embarking on a solo voyage to investigate.',
            'age_rating' => 'P13',
            'release_date' => '2026-02-14',
            'genre' => 'Sci-Fi',
            'is_trending' => 0,
            'recommendation_type' => 'standard'
        ],
        [
            'title' => 'Code Red: Vengeance',
            'poster' => 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=500&auto=format&fit=crop&q=80',
            'synopsis' => 'A betrayed black-ops specialist infiltrates a high-tech fortress on a private island to clear his name and rescue his captured squad.',
            'age_rating' => '16',
            'release_date' => '2026-03-22',
            'genre' => 'Action',
            'is_trending' => 0,
            'recommendation_type' => 'standard'
        ],
        [
            'title' => 'The Haunted Manor',
            'poster' => 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=500&auto=format&fit=crop&q=80',
            'synopsis' => 'A team of paranormal investigators spends the night at a notorious manor with a dark past, only to find the spirits have been waiting for them.',
            'age_rating' => '18',
            'release_date' => '2026-04-10',
            'genre' => 'Horror',
            'is_trending' => 0,
            'recommendation_type' => 'standard'
        ],
        [
            'title' => 'Galactic Horizon',
            'poster' => 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500&auto=format&fit=crop&q=80',
            'synopsis' => 'A group of elite astronauts embark on a high-stakes mission through a newly discovered wormhole in search of a habitable planet to save humanity. What they find on the other side defies the laws of physics and tests the limits of human endurance.',
            'age_rating' => 'P13',
            'release_date' => '2026-05-15',
            'genre' => 'Sci-Fi',
            'is_trending' => 1,
            'recommendation_type' => 'trending'
        ],
        [
            'title' => 'Whispers of the Woods',
            'poster' => 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=500&auto=format&fit=crop&q=80',
            'synopsis' => 'Deep in an ancient, uncharted forest, an academic researcher uncovers a strange fungal network that appears to communicate with a forgotten deity. As the forest begins to wake, survival becomes a game of whispers.',
            'age_rating' => '18',
            'release_date' => '2026-06-01',
            'genre' => 'Horror',
            'is_trending' => 1,
            'recommendation_type' => 'newly_released'
        ],
        [
            'title' => 'Chasing Tomorrow',
            'poster' => 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=500&auto=format&fit=crop&q=80',
            'synopsis' => 'In this high-voltage action thriller, a brilliant cyber-hacker accidental stumbles upon a global conspiracy that controls the worlds digital banking systems. Now on the run, he must use all his skills to expose the truth before he is erased.',
            'age_rating' => '16',
            'release_date' => '2026-06-08',
            'genre' => 'Action',
            'is_trending' => 0,
            'recommendation_type' => 'newly_released'
        ],
        [
            'title' => 'Love in Neon',
            'poster' => 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=500&auto=format&fit=crop&q=80',
            'synopsis' => 'Set in a sparkling futuristic cityscape, an introverted mechanical engineer and a high-spirited virtual reality designer cross paths when their holographic pets start an unlikely digital romance. Soon, they discover a connection that is real.',
            'age_rating' => 'U',
            'release_date' => '2026-06-05',
            'genre' => 'Romance',
            'is_trending' => 0,
            'recommendation_type' => 'newly_released'
        ],
        [
            'title' => 'The Cyber Prankster',
            'poster' => 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=500&auto=format&fit=crop&q=80',
            'synopsis' => 'A tech-savvy teenager accidentally swaps the operating system of the city\'s high-tech robots with an experimental artificial comedy AI. Chaos ensues as heavy-duty industrial drones start telling dad jokes and performing slapstick comedy.',
            'age_rating' => 'U',
            'release_date' => '2026-06-04',
            'genre' => 'Comedy',
            'is_trending' => 0,
            'recommendation_type' => 'newly_released'
        ],
        // Upcoming releases for July 2026
        [
            'title' => 'Project Genesis: Rebirth',
            'poster' => 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=500&auto=format&fit=crop&q=80',
            'synopsis' => 'The highly anticipated sequel to the blockbuster hit. Human colonization of Mars faces an unprecedented ecological crisis when the artificial biosphere collapses. A new generation of genetically adapted youth step up to save the colony.',
            'age_rating' => 'P13',
            'release_date' => '2026-07-10',
            'genre' => 'Sci-Fi',
            'is_trending' => 0,
            'recommendation_type' => 'upcoming'
        ],
        [
            'title' => 'The Shadow Protocol',
            'poster' => 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=500&auto=format&fit=crop&q=80',
            'synopsis' => 'A retired special ops soldier must pull off one last heist inside a automated high-security vault in order to rescue her kidnapped partner. The catch? The vault is controlled by a learning neural network that anticipates her every move.',
            'age_rating' => '16',
            'release_date' => '2026-07-05',
            'genre' => 'Action',
            'is_trending' => 0,
            'recommendation_type' => 'upcoming'
        ],
        [
            'title' => 'The Stand-up Android',
            'poster' => 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=500&auto=format&fit=crop&q=80',
            'synopsis' => 'A malfunctioning housekeeping robot runs away to pursue its dream of becoming a stand-up comedian in the underground comedy club circuit. Lighthearted comedy for all ages.',
            'age_rating' => 'U',
            'release_date' => '2026-07-28',
            'genre' => 'Comedy',
            'is_trending' => 0,
            'recommendation_type' => 'upcoming'
        ],
        [
            'title' => 'Michael',
            'poster' => 'posters/michael.jpg',
            'synopsis' => 'A look at the life of the legendary King of Pop, Michael Jackson, detailing his rise to fame, creative genius, personal struggles, and musical legacy.',
            'age_rating' => 'P13',
            'release_date' => '2025-10-18',
            'genre' => 'Romance',
            'is_trending' => 1,
            'recommendation_type' => 'trending'
        ],
        [
            'title' => 'The Mummy',
            'poster' => 'posters/mummy.png',
            'synopsis' => 'An ancient princess is awakened from her crypt beneath the desert, bringing with her malevolence grown over millennia and terrors that defy human comprehension.',
            'age_rating' => '18',
            'release_date' => '2026-04-17',
            'genre' => 'Horror',
            'is_trending' => 0,
            'recommendation_type' => 'standard'
        ],
        [
            'title' => 'Ladies First',
            'poster' => 'posters/ladies_first.jpg',
            'synopsis' => 'A fast-talking sports agent attempts to sign a top female athlete while navigating a series of hilarious and romantic misadventures in a male-dominated industry.',
            'age_rating' => '16',
            'release_date' => '2026-03-05',
            'genre' => 'Comedy',
            'is_trending' => 0,
            'recommendation_type' => 'standard'
        ],
        [
            'title' => 'The Super Mario Galaxy Movie',
            'poster' => 'posters/super_mario_galaxy.png',
            'synopsis' => 'Mario and Luigi embark on a cosmic adventure across the stars, joining forces with Princess Rosalina and the Lumas to stop Bowser from conquering the universe.',
            'age_rating' => 'U',
            'release_date' => '2026-04-01',
            'genre' => 'Sci-Fi',
            'is_trending' => 0,
            'recommendation_type' => 'standard'
        ],
        [
            'title' => 'Balls Up',
            'poster' => 'posters/balls_up.jpg',
            'synopsis' => 'Two third-rate marketing executives are fired after ruining a major sponsorship client, leading them to embark on a wild, soccer-fueled road trip filled with outrageous stunts.',
            'age_rating' => '18',
            'release_date' => '2026-05-30',
            'genre' => 'Comedy',
            'is_trending' => 0,
            'recommendation_type' => 'standard'
        ]
    ];
    
    $stmt = $pdo->prepare("INSERT INTO movies (title, poster, synopsis, age_rating, release_date, genre, is_trending, recommendation_type) 
                            VALUES (:title, :poster, :synopsis, :age_rating, :release_date, :genre, :is_trending, :recommendation_type)");
    
    foreach ($movies as $movie) {
        $stmt->execute($movie);
    }
    echo "Seed: 'movies' populated.\n";
    
    // 9. Get inserted movie IDs to seed reviews and ticket prices
    $movieIds = $pdo->query("SELECT id, title FROM movies")->fetchAll();
    
    // Seed reviews
    $reviews = [
        [
            'user_name' => 'Alice Miller',
            'rating' => 5,
            'review_text' => 'Absolutely breathtaking! The visual effects in Galactic Horizon were stunning, and the story kept me on the edge of my seat. A must-watch sci-fi masterpiece.'
        ],
        [
            'user_name' => 'John Doe',
            'rating' => 4,
            'review_text' => 'A very solid sci-fi film. The pacing drags a bit in the second act, but the ending is spectacular and thought-provoking.'
        ],
        [
            'user_name' => 'Sarah Connor',
            'rating' => 5,
            'review_text' => 'Spooky and atmospheric! Whispers of the Woods will stay in my head for a long time. The sound design is top-notch!'
        ],
        [
            'user_name' => 'Marcus Brody',
            'rating' => 3,
            'review_text' => 'A bit generic, but the horror elements work well. Worth a watch if you like slow-burn atmospheric horror.'
        ],
        [
            'user_name' => 'Liam Neeson',
            'rating' => 4,
            'review_text' => 'Action-packed and relentless. Chasing Tomorrow is an exciting ride from start to finish with great action choreography!'
        ],
        [
            'user_name' => 'Emma Watson',
            'rating' => 5,
            'review_text' => 'So cute and heartfelt! Love in Neon is a lovely romantic story that actually feels fresh thanks to the futuristic premise.'
        ],
        [
            'user_name' => 'Jerry Seinfeld',
            'rating' => 4,
            'review_text' => 'Hysterical! Cyber Prankster is light, fun, and the slapstick robot jokes are surprisingly funny. Great family film.'
        ]
    ];
    
    $reviewStmt = $pdo->prepare("INSERT INTO reviews (movie_id, user_name, rating, review_text) VALUES (:movie_id, :user_name, :rating, :review_text)");
    
    // Map reviews to seeded movies based on search terms
    foreach ($movieIds as $m) {
        $title = strtolower($m['title']);
        $movieReviews = [];
        if (strpos($title, 'galactic') !== false) {
            $movieReviews = [$reviews[0], $reviews[1]];
        } elseif (strpos($title, 'whispers') !== false) {
            $movieReviews = [$reviews[2], $reviews[3]];
        } elseif (strpos($title, 'chasing') !== false) {
            $movieReviews = [$reviews[4]];
        } elseif (strpos($title, 'love') !== false) {
            $movieReviews = [$reviews[5]];
        } elseif (strpos($title, 'prankster') !== false) {
            $movieReviews = [$reviews[6]];
        } elseif (strpos($title, 'lost temple') !== false) {
            $movieReviews = [$reviews[4]];
        } elseif (strpos($title, 'spooky') !== false) {
            $movieReviews = [$reviews[6]];
        } elseif (strpos($title, 'midnight') !== false) {
            $movieReviews = [$reviews[3]];
        } elseif (strpos($title, 'yuletide') !== false) {
            $movieReviews = [$reviews[6]];
        } elseif (strpos($title, 'cybernetic') !== false) {
            $movieReviews = [$reviews[5]];
        } elseif (strpos($title, 'nebula') !== false) {
            $movieReviews = [$reviews[1]];
        } elseif (strpos($title, 'haunted') !== false) {
            $movieReviews = [$reviews[2], $reviews[3]];
        } elseif (strpos($title, 'michael') !== false) {
            $movieReviews = [$reviews[0], $reviews[1]];
        } elseif (strpos($title, 'mummy') !== false) {
            $movieReviews = [$reviews[2], $reviews[3]];
        } elseif (strpos($title, 'ladies first') !== false) {
            $movieReviews = [$reviews[6]];
        } elseif (strpos($title, 'mario') !== false) {
            $movieReviews = [$reviews[0], $reviews[5]];
        } elseif (strpos($title, 'balls up') !== false) {
            $movieReviews = [$reviews[6]];
        }
        
        foreach ($movieReviews as $r) {
            $r['movie_id'] = $m['id'];
            $reviewStmt->execute($r);
        }
    }
    echo "Seed: 'reviews' populated.\n";
    
    // Seed ticket prices for comparison
    $cinemas = [
        ['name' => 'Golden Screen Cinemas (GSC)', 'base_price' => 15.00],
        ['name' => 'TGV Cinemas', 'base_price' => 14.50],
        ['name' => 'MBO Cinemas', 'base_price' => 13.00],
        ['name' => 'D-BOX Premium', 'base_price' => 25.00]
    ];
    
    $priceStmt = $pdo->prepare("INSERT INTO ticket_prices (movie_id, cinema_name, ticket_price, booking_url) 
                                VALUES (:movie_id, :cinema_name, :ticket_price, :booking_url)");
    
    foreach ($movieIds as $m) {
        // Find release status
        $releaseDate = '';
        foreach ($movies as $origM) {
            if ($origM['title'] === $m['title']) {
                $releaseDate = $origM['release_date'];
                break;
            }
        }
        
        // Seeding ticket prices for released movies
        if ($releaseDate <= '2026-06-09') { // already released in our timeline
            foreach ($cinemas as $c) {
                // Add a small random variation to make it realistic
                $randomVariation = (rand(-15, 15) / 10.0);
                $finalPrice = $c['base_price'] + $randomVariation;
                
                $priceStmt->execute([
                    'movie_id' => $m['id'],
                    'cinema_name' => $c['name'],
                    'ticket_price' => round($finalPrice, 2),
                    'booking_url' => 'https://www.google.com/search?q=' . urlencode($c['name'] . ' booking ' . $m['title'])
                ]);
            }
        }
    }
    echo "Seed: 'ticket_prices' populated.\n";
    
    echo "Database setup completed successfully!\n";
    
} catch (\PDOException $e) {
    echo "Error during database setup: " . $e->getMessage() . "\n";
    exit(1);
}
?>
