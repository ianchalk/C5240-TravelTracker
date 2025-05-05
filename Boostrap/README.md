# AllTrails Clone - Bootstrap Version

This is a simplified Bootstrap version of the AllTrails application. It provides a clean, responsive interface for exploring hiking trails and outdoor adventures.

## Overview

This project is a static Bootstrap implementation featuring:
- Responsive navigation bar
- Hero search section
- Interactive trail map
- Trail cards with hover effects
- National parks guide banner
- Full mobile responsiveness

## Getting Started

This project uses Bootstrap 5 for styling, with some custom CSS and JavaScript for enhanced interactions. No build process is required as all dependencies are loaded via CDN.

### Prerequisites

- Basic web server (Python's built-in server, Node's http-server, or any web server of your choice)
- Web browser (Chrome, Firefox, Safari, Edge recommended)

### Installation & Setup

No installation is needed for the project itself since it uses CDN-hosted libraries. You only need a way to serve the files.

#### Option 1: Using Python's built-in HTTP server

If you have Python installed (most macOS and Linux systems do):

```bash
# Navigate to the Bootstrap folder
cd path/to/alltrails-clone/Boostrap

# Start the server on port 3000
python -m http.server 3000
# or for Python 3
python3 -m http.server 3000
```

#### Option 2: Using Node.js http-server

If you prefer Node.js:

```bash
# Install http-server globally if you haven't already
npm install -g http-server

# Navigate to the Bootstrap folder
cd path/to/alltrails-clone/Boostrap

# Start the server
http-server -p 3000
```

### Running the Application

1. Start your web server of choice (see installation options above)
2. Open a browser and navigate to:
   - http://localhost:3000

The application should load immediately, showing the AllTrails clone interface.

## Project Structure

```
Boostrap/
├── index.html      # Main HTML file with Bootstrap structure
├── styles.css      # Custom styles extending Bootstrap
├── script.js       # Interactive behavior JavaScript
└── README.md       # This documentation file
```

## Technologies Used

- **Bootstrap 5.3.0**: Main CSS framework
- **Popper.js 2.11.6**: Required for Bootstrap tooltips and popovers
- **Font Awesome 6.4.0**: Icon library for UI elements
- **Vanilla JavaScript**: For interactive elements and animations

## Features

1. **Navigation**: Responsive navbar with authentication buttons
2. **Hero Search**: Large search bar for finding trails
3. **Interactive Map**: Trail map display with hover effects
4. **Trail Cards**: Horizontally scrollable trail information cards
5. **National Parks Banner**: Promotional section for national park guides

## Customization

The Bootstrap theme has been customized using the `styles.css` file. Key customizations include:

- Custom color scheme based on AllTrails branding
- Custom button styles with rounded corners
- Card hover effects and shadows
- Custom gradient overlays for images
- Responsive design adjustments

## Browser Compatibility

The website is compatible with:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Credits

- Images from Unsplash
- AllTrails branding elements used for educational purposes only