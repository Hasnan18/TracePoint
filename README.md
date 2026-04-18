# TracePoint

TracePoint is an advanced, seamless, and dynamic web application for locating IP addresses and verifying phone numbers globally without requiring user login or signup.

Built by **Hasnan Sharief**.

## Features
- **IP Locator**: Enter an IP address or a website domain to instantly trace its physical location. Renders the location on an interactive map.
- **Phone Validator**: Input any phone number globally to verify its validity, region, line type (e.g., Mobile, Fixed-line), and exact formatting details.
- **Mobile Friendly UI/UX**: Designed using beautiful CSS glassmorphism, fully responsive and optimized for any device size.

## Tech Stack
- **Frontend Core**: HTML5, Vanilla JavaScript, CSS3
- **Design System**: Custom Glassmorphism UI
- **Maps**: Leaflet.js
- **APIs Used**:
  - [ipstack API](https://ipstack.com/) for Geolocation tracking
  - [APILayer Number Verification](https://apilayer.com/) for precise telecommunication lookups

## Project Structure
```
TracePoint/
│
├── index.html            # Main entry point
├── README.md             # Project documentation
├── .gitignore            # Ignored files for git tracking
│
└── assets/
    ├── css/
    │   └── styles.css    # Responsive styles and glassmorphism design
    ├── js/
    │   └── script.js     # API fetching, Map handling, and DOM logic
    └── images/
        └── logo.png      # TracePoint branding logo
```

## How to Run Locally
Since TracePoint uses pure Vanilla Javascript and HTML5, there is **no setup required**!
1. Clone this repository to your local machine.
2. Open the `index.html` file in any modern web browser (Chrome, Edge, Firefox, etc.).
3. Start locating IP addresses and validating numbers instantly.

## Note on API Keys
The application currently uses API keys embedded in `assets/js/script.js`. For production-ready deployment, it is recommended to proxy these requests through a backend server to secure your keys.

---
_"Vibe Coding Project 101 TracePoint"_
