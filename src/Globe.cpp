#include "Globe.h"
#include "DataLoader.h"
#include "rlgl.h"
#include <cmath>

Globe::Globe(int pointCount, float radius)
    : pointCount(pointCount), radius(radius), rotation(0.0f) {
  Image map = LoadImage("assets/world_map.png");
  GeneratePoints(map);
  UnloadImage(map);
}

Globe::~Globe() { points.clear(); }

void Globe::GeneratePoints(const Image &map) {
  float phi = PI * (3.0 - sqrt(5.0));

  for (int i = 0; i < pointCount; i++) {
    float y = 1 - (i / (float)(pointCount - 1)) * 2;
    float radiusAtY = sqrt(1 - y * y);

    float theta = phi * i;

    float x = cos(theta) * radiusAtY;
    float z = sin(theta) * radiusAtY;

    // Texture Sampling for Continents
    // Convert Spherical (x, y, z) to UV (0..1)
    // u = 0.5 + (atan2(z, x) / (2 * PI))
    // v = 0.5 - (asin(y) / PI)

    float u = 0.5f + (atan2(z, x) / (2 * PI));
    float v = 0.5f - (asin(y) / PI);

    int px = (int)(u * map.width);
    int py = (int)(v * map.height);

    Color pixel = GetImageColor(map, px % map.width, py % map.height);

    // If pixel is dark (water), skip or render faintly
    if (pixel.r < 50)
      continue; // Skip water points

    Vector3 pos = {x * radius, y * radius, z * radius};

    GlobePoint point;
    point.position = pos;
    point.color = BLACK;
    point.active = false;

    points.push_back(point);
  }
}

void Globe::Update() {
  if (!IsMouseButtonDown(MOUSE_BUTTON_LEFT)) {
    rotation += 0.2f;
  }
}

void Globe::Draw() {
  rlPushMatrix();
  rlRotatef(rotation, 0, 1, 0);

  for (const auto &point : points) {
    float radius = point.active ? 0.1f : 0.05f;
    DrawSphere(point.position, radius, point.color);
  }

  rlPopMatrix();
}

void Globe::AddStreams(const std::vector<StreamData> &streams) {
  for (const auto &stream : streams) {
    float theta = (90 - stream.latitude) * PI / 180.0f;
    float phi = (stream.longitude + 180) * PI / 180.0f;

    float x = -((radius + 0.1f) * sin(theta) * cos(phi));
    float z = (radius + 0.1f) * sin(theta) * sin(phi);
    float y = (radius + 0.1f) * cos(theta);

    GlobePoint point;
    point.position = {x, y, z};
    point.color = RED;
    point.active = true;

    points.push_back(point);
  }
}
