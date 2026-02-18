#include "Globe.h"
#include <cmath>

Globe::Globe(int pointCount, float radius)
    : pointCount(pointCount), radius(radius) {
  GeneratePoints();
}

Globe::~Globe() { points.clear(); }

void Globe::GeneratePoints() {
  float phi = PI * (3.0 - sqrt(5.0)); // Golden angle

  for (int i = 0; i < pointCount; i++) {
    float y = 1 - (i / (float)(pointCount - 1)) * 2; // y goes from 1 to -1
    float radiusAtY = sqrt(1 - y * y);               // radius at y

    float theta = phi * i; // golden angle increment

    float x = cos(theta) * radiusAtY;
    float z = sin(theta) * radiusAtY;

    Vector3 pos = {x * radius, y * radius, z * radius};

    GlobePoint point;
    point.position = pos;
    point.color = DARKGRAY; // Default "Lofi" color
    point.active = false;

    points.push_back(point);
  }
}

void Globe::Update() {
  // TODO: Animation logic
}

void Globe::Draw() {
  for (const auto &point : points) {
    DrawPoint3D(point.position, point.color);
  }
}
