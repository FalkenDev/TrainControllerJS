# DV1677 JavaScript-baserade webbramverk

## Contributors

### Kasper Falk

- https://github.com/FalkenDev

### James Taylor

- https://github.com/JamesTTTT

## Säkerhetsnålar

### Hittade problem
- EJ uppdaterade paket.
- Ingen ENV Fil med API Nyckel från trafikverket.
- Ingen Frontend hosting (Blir CORS Problem annars).
- Problem med att table tickets inte finns.


### Återgärder
- npm audit fix för att uppdatera paketen
- Skapade en ENV fil och skapade en api nyckel på trafikverket.
- Installerade express till frontend delen och satte port 9000 som backends cors är satt på.
- Installerade SQLite 3 och körde bash scriptet i db foldern.

### Applikationens Utvecklingssteg
- Installerade paketen i backend.
- Körde npm audit fix för att fixa paketen / uppdatera de till nyare versioner
- Testade att köra programmet.
- Hittade problem med att det inte finns någon api nyckel till trafikverket.
- Skapade env fil och skapade en api nyckel på trafikverket.
- Testade att köpa backend igen, backend funkar.
- Kollar igenom frontend delen.
- Testar att öppna frontend men ser att det blir CORS problem.
- Kollar igen på backendens app.js och ser att CORS ska tillåta localhost:9000.
- Tar beslut att skapa en express för frontend delen då backend vill att localhost:9000 ska kunna hämta information.
- Skapar en express och sätter port 9000 och testar att köra.
- Trycker på ett tåg i listan - crashar och säger att table tickets inte finns.
- Kollar databas mappen ser att det finns en reset script.
- Testar att köra scriptet får att SQLite inte finns.
- Laddar ner SQLite 3 och kör igen.
- Testar sidan igen och allt funkar.
- Done!
#### Extra
- Skapade dockerfil i backend och frontend
- Skapad docker compose fil för att kunna sammarbeta mellan de 2 images
- Går nu att köra båda programmen direkt i en virtuell miljö (docker container)

## Frontend ramverk
Vi har valt att använda oss utav Vue 3 med vite för att vi har arbetat i de flesta ramerken (biblioteken) innan och vill testa oss på något som är lite nyare för oss och advancera våra kunskaper.
