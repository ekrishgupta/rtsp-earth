# RTSP Earth - Lofi Globe

A native C++ application visualizing global data on a 3D globe with a lo-fi/monochrome aesthetic. Built with Raylib.

## Features
- **Lofi Aesthetic**: Monochrome visuals with CRT scanlines and red accents.
- **3D Globe**: Custom Fibonacci sphere point cloud rendering.
- **Data Integration**: Loads stream metadata from JSON and maps it to 3D coordinates.
- **Cross-Platform**: Built with CMake for macOS/Linux/Windows.

## Build Instructions

### Prerequisites
- CMake 3.14+
- C++20 Compiler
- Raylib (Fetched automatically)
- nlohmann/json (Fetched automatically)

### Steps
1. **Configure**:
   ```bash
   cmake -B build
   ```
2. **Build**:
   ```bash
   cmake --build build
   ```
3. **Run**:
   ```bash
   ./build/rtsp_earth
   ```

## Controls
- **Mouse Drag**: Orbit camera around the globe.
- **Scroll**: Zoom in/out.
