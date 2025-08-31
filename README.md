# ActivityPub Learning Setup

Ein umfassendes Lernprojekt für das ActivityPub-Protokoll mit praktischen Beispielen und direkter Integration in GitHub Codespaces.

## 🎯 Projektziel

Dieses Repository hilft Studenten dabei, das ActivityPub-Protokoll hands-on zu verstehen, ohne eine eigene Mastodon-Instanz betreiben zu müssen. Der Fokus liegt auf dem späteren Use Case: **Integration einer Online-Learning-Plattform mit Mastodon für automatische Benachrichtigungen bei neuen Videouploads**.

## 🚀 Schnellstart mit GitHub Codespaces

1. Klicke auf "Code" → "Codespaces" → "Create codespace on main"
2. Warte, bis die Umgebung geladen ist (Dependencies werden automatisch installiert)
3. Führe die Beispielskripte aus:

```bash
# WebFinger Discovery testen
npm run webfinger

# Öffentliche Timeline abrufen
npm run timeline

# ActivityPub Actor-Profile analysieren
npm run actor

# ActivityPub-Objektstrukturen verstehen
npm run objects

# Komplette Notification-Simulation
npm run notifications

# Alle Tests nacheinander ausführen
npm run test-all
```

## 📚 Lernmodule

### 1. WebFinger Discovery (`examples/01-webfinger-discovery.js`)

**Was du lernst:**
- Wie ActivityPub-Handles (`@user@instance.com`) in Actor-URLs aufgelöst werden
- WebFinger-Protokoll (RFC 7033) verstehen
- JSON Resource Descriptor (JRD) analysieren

**Ausführen:**
```bash
npm run webfinger
```

**Konzepte:**
- WebFinger ist der erste Schritt in der ActivityPub-Kommunikation
- Mappt menschenlesbare Identifier auf maschinenlesbare Ressourcen
- Gibt Links zu ActivityPub-Actor-Objekten zurück

### 2. Öffentliche Timelines (`examples/02-public-timeline.js`)

**Was du lernst:**
- Mastodon-API nutzen um ActivityPub-Inhalte abzurufen
- Note-Objekte (Posts) analysieren
- Mastodon-API-Responses zu ActivityPub-Objekten konvertieren

**Ausführen:**
```bash
npm run timeline
```

**Konzepte:**
- Note-Objekte repräsentieren textbasierte Inhalte
- Addressing-System (to, cc) für Sichtbarkeit
- Engagement-Metriken und Medien-Anhänge

### 3. Actor-Profile (`examples/03-actor-profile.js`)

**Was du lernst:**
- ActivityPub-Actor-Objekte abrufen und analysieren
- Inbox/Outbox-Konzepte verstehen
- Public-Key-Infrastruktur für Verification

**Ausführen:**
```bash
npm run actor
```

**Konzepte:**
- Actors repräsentieren Entitäten (Users, Bots, Services)
- Inbox: Eingehende Aktivitäten
- Outbox: Ausgehende Aktivitäten
- Followers/Following Collections

### 4. ActivityPub-Objekte (`examples/04-activitypub-objects.js`)

**Was du lernst:**
- Verschiedene ActivityPub-Objekttypen (Note, Create, Follow, Like, etc.)
- Objekt-Beziehungen und Workflows
- JSON-LD Struktur verstehen

**Ausführen:**
```bash
npm run objects
```

**Konzepte:**
- Objects: Inhalte (Notes, Images, Videos)
- Activities: Aktionen auf Objekten (Create, Like, Follow)
- Komplexe Activity-Workflows

### 5. Notification-Simulation (`examples/05-notification-simulation.js`)

**Was du lernst:**
- Komplette Integration Learning-Platform → Mastodon
- Praktischer Use Case: Professor uploads Video → Student Notifications
- HTTP-Signaturen und Federation

**Ausführen:**
```bash
npm run notifications
```

**Konzepte:**
- Webhook → ActivityPub-Konvertierung
- Create-Activities mit eingebetteten Notes
- Delivery-Simulation mit HTTP-Signaturen

## 🏗️ Projektstruktur

```
activitypub-learning-setup/
├── .devcontainer/          # GitHub Codespaces Konfiguration
│   └── devcontainer.json
├── examples/               # Lernmodule
│   ├── 01-webfinger-discovery.js
│   ├── 02-public-timeline.js
│   ├── 03-actor-profile.js
│   ├── 04-activitypub-objects.js
│   └── 05-notification-simulation.js
├── package.json           # Dependencies und Scripts
└── README.md             # Diese Datei
```

## 🎓 University Use Case: Learning Platform Integration

### Szenario
Ein Professor lädt ein neues Video in die Uni-Learning-Plattform hoch. Alle eingeschriebenen Studenten sollen automatisch eine Benachrichtigung in ihrem Mastodon-Feed erhalten.

### Workflow
1. **Video Upload**: Professor lädt Video in Learning-Platform hoch
2. **Webhook Trigger**: Platform detektiert Upload und triggert Webhook
3. **ActivityPub Conversion**: Video-Metadaten werden zu ActivityPub Note konvertiert
4. **Create Activity**: Note wird in Create-Activity gewrappt
5. **Mastodon Delivery**: Activity wird an Professor's Mastodon-Inbox gesendet
6. **Federation**: Mastodon verteilt an alle Follower (Studenten)
7. **Notifications**: Studenten erhalten Benachrichtigungen in ihren Clients

### Technische Requirements
- ActivityPub-Client in der Learning-Platform
- HTTP-Signature-Verifikation für Sicherheit
- Professor hat verknüpften Mastodon-Account
- Studenten folgen Professor's Mastodon-Account

## 🔧 Technische Details

### Dependencies
- **axios**: HTTP-Client für API-Requests
- **chalk**: Farbige Konsolen-Ausgabe für bessere Lesbarkeit
- **jsonld**: JSON-LD Processing (für fortgeschrittene ActivityPub-Features)
- **dotenv**: Environment-Variable für optionale Konfiguration

### Unterstützte Mastodon-Instanzen
Das Setup testet mit folgenden öffentlichen Instanzen:
- `mastodon.social`
- `mastodon.world`
- `fosstodon.org`
- `mstdn.social`

### Sicherheitshinweise
- Alle Requests nutzen User-Agent `ActivityPub-Learning-Setup/1.0`
- Timeouts für alle HTTP-Requests (10 Sekunden)
- Nur öffentliche APIs werden verwendet (keine Authentifizierung erforderlich)
- Produktive Implementierungen benötigen HTTP-Signaturen

## 📖 Wichtige ActivityPub-Konzepte

### JSON-LD Context
ActivityPub basiert auf JSON-LD mit spezifischen Contexts:
```json
{
  "@context": [
    "https://www.w3.org/ns/activitystreams",
    "https