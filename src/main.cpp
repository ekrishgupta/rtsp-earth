#include "raylib.h"

int main()
{
    const int screenWidth = 800;
    const int screenHeight = 600;

    InitWindow(screenWidth, screenHeight, "RTSP Earth - Lofi Globe");
    SetTargetFPS(60);

    // Camera setup
    Camera3D camera = { 0 };
    camera.position = (Vector3){ 10.0f, 10.0f, 10.0f };
    camera.target = (Vector3){ 0.0f, 0.0f, 0.0f };
    camera.up = (Vector3){ 0.0f, 1.0f, 0.0f };
    camera.fovy = 45.0f;
    camera.projection = CAMERA_PERSPECTIVE;

    while (!WindowShouldClose())
    {
        UpdateCamera(&camera, CAMERA_ORBITAL);

        BeginDrawing();
            ClearBackground(BLACK);

            BeginMode3D(camera);
                DrawGrid(10, 1.0f);
                DrawSphereWires((Vector3){0, 0, 0}, 2.0f, 16, 16, DARKGRAY);
            EndMode3D();

            DrawText("RTSP_EARTH :: SYSTEM ONLINE", 10, 10, 20, RED);
            DrawFPS(10, 40);

        EndDrawing();
    }

    CloseWindow();

    return 0;
}
