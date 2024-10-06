# Landsat Data Reflection Site - README

## Overview

This is a React-based application designed to visualize and compare Landsat data using the Sentinel Hub API. The app allows users to input coordinates, choose from a variety of data layers (like NDVI, False Color, True Color, etc.), and visualize geospatial data as images. Users can also compare multiple datasets.

## Features

1. **Layer Selection**: Users can select different types of satellite data layers, such as:
   - NDVI (Normalized Difference Vegetation Index)
   - False Color Vegetation
   - True Color S2L2A
   - Moisture Index
   - Bathymetric Data
   - Agriculture Data
   - Geology Data
   - False Color Urban
   - Natural Color (True Color)
   - Temperature Burn Out Index

2. **Coordinate Input**: Users can input latitude and longitude to fetch satellite imagery for a specific region.

3. **Visualization and Comparison**: Users can visualize the selected layer at a given location and compare between multiple coordinates.

4. **Dynamic Sidebar**: The app features a collapsible sidebar that allows users to add coordinates and select layers dynamically.

5. **Loading and Error Handling**: Loading indicators appear when fetching data, and error handling is in place to notify users of any issues during data retrieval.

6. **Login and Notification Routes**: There are placeholders for login and notifications, which can be expanded upon.

## Installation

### Prerequisites

- Node.js (>= 14.x)
- npm or yarn package manager

### Steps

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-repo/landsat-data-reflection.git
   cd landsat-data-reflection
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the application**:
   ```bash
   npm start
   ```

   The app will be available at `http://localhost:3000`.

## Components

### `Navbar`

- **State Management**: This component manages several states including sidebar visibility, the active tab (`visualize` or `compare`), coordinates, selected layer, loading state, and visualized data.
  
- **Handle Events**:
  - `handleLoginClick`: Navigates to the login page.
  - `handleNotiClick`: Navigates to the notifications page.
  - `handleAddCoordinates`: Adds a new set of coordinates (latitude and longitude) to either the visualization or comparison tab.
  - `handleVisualize`: Fetches satellite data for the provided coordinates and visualizes it.
  - `handleCompare`: Similar to visualization, but for comparison purposes.
  - `removeCoordinate`: Removes a coordinate from the list.

### `handleVisualize(coord)` and `handleCompare(coord)`

- These functions build a URL to request satellite imagery from the Sentinel Hub API using the selected layer and coordinate.
  
- They make a `fetch` request to retrieve the data as an image, handle loading states, and render the result.

### Layer Options

The app provides a dropdown for users to select a data layer. These layers include vegetation indices, color composites, moisture indices, and more.

### Coordinates List

Users can enter latitude and longitude coordinates, and a list of these coordinates will appear under the input fields. Users can then visualize or compare data for each coordinate.

## API Integration

The app uses the **Sentinel Hub WMS (Web Map Service)** to fetch satellite imagery for selected coordinates and layers. The key parameters for the API requests are:
- `LAYERS`: The selected layer (e.g., NDVI, False Color).
- `BBOX`: Bounding box calculated based on the input coordinates.
- `FORMAT`: The image format, set to `image/png`.
- `WIDTH` and `HEIGHT`: Set to `512` to fetch appropriately sized images.
- `VERSION`, `SERVICE`, and `REQUEST`: Other WMS-specific parameters.

## How It Works

1. **Selecting a Layer**: Choose a satellite data layer from the dropdown in the sidebar.
2. **Input Coordinates**: Enter the latitude and longitude of the region you want to visualize or compare.
3. **Visualizing Data**: Once coordinates are added, click "Visualize" to fetch and display the satellite data.
4. **Comparing Data**: If you switch to the "Compare" tab, you can add multiple coordinates and fetch data for comparison.
5. **Toggle Sidebar**: The sidebar can be toggled open or closed using the button in the top left corner.
6. **Login and Notifications**: The app has placeholder buttons for login and notifications, which navigate to respective routes.

## Project Structure

- **`src/`**: All source code is here.
  - **`components/`**: Contains reusable components (e.g., `Navbar`).
  - **`App.js`**: The main component that renders the `Navbar`.
  - **`index.js`**: The entry point of the React app.
  - **`styles/`**: Any global styles or theme-related files.

## Dependencies

- **React**: The main UI library.
- **react-router-dom**: For routing between pages like login and notifications.
- **lucide-react**: Icon library used in the navbar (Menu, Eye, BarChart2, Trash icons).
  
## Future Enhancements

1. **User Authentication**: Expand the login page to handle authentication.
2. **Notification System**: Add notifications to inform users of new data updates or changes.
3. **Additional Data Layers**: Include more data layers or add filters for better visualization.
4. **Improved Error Handling**: Show user-friendly messages for various errors.

## License

This project is licensed under the MIT License.

--- 

This README gives a complete overview of the project, guiding users through installation, functionality, and structure.

