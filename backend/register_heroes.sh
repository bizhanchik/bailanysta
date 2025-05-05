#GPT generated. Сделал для тестов

API="http://localhost:5001/users"
PASSWORD="password123"

heroes=(
  "Iron Man"
  "Captain America"
  "Thor"
  "Hulk"
  "Black Widow"
  "Hawkeye"
  "Spider-Man"
  "Black Panther"
  "Doctor Strange"
  "Captain Marvel"
  "Wolverine"
  "Cyclops"
  "Jean Grey"
  "Storm"
  "Batman"
  "Superman"
  "Wonder Woman"
  "Flash"
  "Green Lantern"
  "Aquaman"
  "Cyborg"
  "The Joker"
  "Harley Quinn"
  "Lex Luthor"
  "Darkseid"
  "Thanos"
  "Loki"
  "Ultron"
  "Magneto"
  "Professor X"
  "Daredevil"
  "Punisher"
  "Ghost Rider"
  "Deadpool"
  "Green Arrow"
  "Black Canary"
  "Catwoman"
  "Deadshot"
  "Deathstroke"
  "Doctor Doom"
  "Silver Surfer"
  "Galactus"
  "Scarlet Witch"
  "Vision"
  "Ant-Man"
  "Wasp"
  "Star-Lord"
  "Gamora"
  "Drax"
  "Groot"
)

echo "Registering ${#heroes[@]} heroes..."

for name in "${heroes[@]}"; do
  username=$(echo "$name" \
    | tr '[:upper:]' '[:lower:]' \
    | sed -E 's/[^a-z0-9]+/_/g' \
    | sed -E 's/_$//')

  email="${username}@example.com"

  json=$(jq -n \
    --arg un "$username" \
    --arg fn "$name" \
    --arg em "$email" \
    --arg pw "$PASSWORD" \
    '{username:$un, fullname:$fn, email:$em, password:$pw}')

  http_status=$(curl -s -o /dev/null -w "%{http_code}" \
    -X POST "$API" \
    -H "Content-Type: application/json" \
    -d "$json")

  if [ "$http_status" -eq 201 ]; then
    echo "✔️  $name registered as $username"
  else
    echo "❌  Failed $name (HTTP $http_status)"
  fi
done

echo "Done."
