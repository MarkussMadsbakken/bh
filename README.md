## Installasjon
Etter du har klonet prosjektet fra github, må du installere alle pakkene vi bruker i prosjektet. Dette gjør du ved å skrive ```$ npm install --legacy-peer-deps``` i terminalen. Vi trenger legacy-peer-deps fordi next er ganske broken for øyeblikket.

### Videre oppsett
1. For å sette opp auth, trenger vi en en auth secret. Den letteste måten å lage dette på er med ```$ npx auth secret```.
2. Legg ved database UTR-en i en .env fil. Her legger du ved databasen med DATABASE_URL="databaseurl". Du kan enten bruke din egen lokale database, eller så kan du få tilgang til tihlde-bh sin dev database (send meg (markus) en melding).
3. Til slutt trenger du å generere databasetypene. Dette gjør du ved å skrive ```$ npx prisma generate```

### Kjøring
For å starte en dev-server, skriver du ````npm run dev``` i terminalen. Det er ikke vanskeligere enn det.
