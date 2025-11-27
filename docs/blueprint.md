# **App Name**: Media Harvester

## Core Features:

- URL Input: Text input field for the user to enter the URL to be scraped.
- Media Extraction: Extract all image (<img>) and video (<video>) elements from the provided URL using Puppeteer or Cheerio.
- Absolute URL Resolution: Resolve all relative URLs to absolute URLs to ensure correct media links.
- JSON Response: Return the extracted media links as a JSON object to the frontend.
- Media Gallery: Render the extracted media links as a gallery of images and videos on the frontend, using a grid layout.
- Error Handling: Handle potential errors, such as invalid URLs or failed scraping attempts, and provide informative error messages to the user.

## Style Guidelines:

- Primary color: Deep blue (#3F51B5) to evoke trust and reliability.
- Background color: Very dark blue-gray (#222930) for a modern dark mode appearance.
- Accent color: Electric purple (#BE64FF) to add a vibrant and distinctive touch for interactive elements.
- Headline font: 'Space Grotesk', a sans-serif font that looks modern and slightly techy. Body font: 'Inter', a sans-serif font appropriate for on-screen reading.
- Use a grid layout for displaying the extracted images and videos, ensuring a clean and organized presentation.
- Subtle transition animations when loading and displaying the extracted media.