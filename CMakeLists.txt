cmake_minimum_required(VERSION 3.14)

project(rtsp_earth VERSION 1.0.0 LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Fetch Raylib
include(FetchContent)
FetchContent_Declare(
    raylib
    URL https://github.com/raysan5/raylib/archive/refs/tags/5.0.tar.gz
)
FetchContent_MakeAvailable(raylib)

# Setup Executable
add_executable(${PROJECT_NAME} 
    src/main.cpp
    src/Globe.cpp
)

target_link_libraries(${PROJECT_NAME} PRIVATE raylib)

# Web configuration (Emscripten)
if(EMSCRIPTEN)
    set(CMAKE_EXECUTABLE_SUFFIX ".html")
    target_link_options(${PROJECT_NAME} PRIVATE 
        -sUSE_GLFW=3 
        -sASYNCIFY 
        --shell-file ${CMAKE_CURRENT_SOURCE_DIR}/src/shell.html
    )
endif()
