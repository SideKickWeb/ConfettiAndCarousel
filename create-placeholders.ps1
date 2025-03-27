$images = @(
    "orb-balloon.jpg",
    "balloon-arch.jpg",
    "flower-wall.jpg",
    "light-up-sign.jpg",
    "cake-table.jpg",
    "ceremonial-arch.jpg",
    "confetti-cannon.jpg",
    "led-uplighting.jpg",
    "tablecloth.jpg",
    "chiavari-chair.jpg"
)

foreach ($image in $images) {
    $path = "public/images/products/$image"
    echo "Creating placeholder image: $image"
    echo "This is a placeholder image" > $path
}

Write-Host "All placeholder images created successfully!" 