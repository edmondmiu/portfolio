# Edmond Miu Portfolio Website

**Note:**
- The main file to edit and test is located at:
  `/X9Pro/Developer/edmondmiu-website-clone/www.edmondmiu.com/v4/static-site/public/index.html`
- Please make all local edits and tests on this file to ensure changes are reflected in your local environment.

A static portfolio website built with HTML, CSS, and JavaScript, hosted on Firebase.

## Project Structure

```
static-site/
├── public/              # Public assets
│   ├── css/            # CSS files
│   ├── js/             # JavaScript files
│   ├── images/         # Image assets
│   └── index.html      # Main HTML file
├── package.json        # Project dependencies
├── firebase.json       # Firebase configuration
└── README.md          # Project documentation
```

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm start
```

## Deployment

1. Install Firebase CLI globally (if not already installed):
```bash
npm install -g firebase-tools
```

2. Login to Firebase:
```bash
firebase login
```

3. Initialize Firebase project (first time only):
```bash
firebase init
```

4. Deploy to Firebase:
```bash
npm run deploy
```

## Development

- `npm start` - Start development server
- `npm run build` - Build production files
- `npm run deploy` - Deploy to Firebase

## Features

- Responsive design
- Mobile-first approach
- Smooth scrolling
- Dynamic header
- Mobile menu
- Performance optimized
- SEO friendly

## Technologies Used

- HTML5
- CSS3
- JavaScript (ES6+)
- Firebase Hosting
- Google Fonts 