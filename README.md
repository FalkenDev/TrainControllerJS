# DV1677 JavaScript-baserade webbramverk

## Contributors

### Kasper Falk

- https://github.com/FalkenDev

### James Taylor

- https://github.com/JamesTTTT

## Säkerhetsnålar

### Hittade problem
- EJ uppdaterade paket
- Ingen ENV Fil med API Nyckel från trafikverket
- Ingen Frontend hosting (Blir CORS Problem annars)


### Återgärder
- npm audit fix för att uppdatera paketen
- Skapade en ENV fil och skapade en api nyckel på trafikverket
- Installerade express till frontend delen och satte port 9000 som backends cors är satt på.
- Problem med att table tickets inte finns

### Applikationens Utvecklingssteg
- Installerade paketen i backend
- Testade att köra programmet
- Hittade problem med att det inte finns någon api nyckel till trafikverket
- Skapade env fil och skapade en api nyckel på trafikverket
- Testade att köpa backend igen, backend funkar
- Kollar igenom frontend delen
- Testar att öppna frontend men ser att det blir CORS problem
- Kollar igen på backendens app.js och ser att CORS ska tillåta localhost:9000
- Tar beslut att skapa en express för frontend delen då backend vill att localhost:9000 ska kunna hämta information
- Skapar en express och sätter port 9000 och testar att köra
- Done!



## Frontend ramverk
