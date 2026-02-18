#include "Globe.h"
#include "DataLoader.h"
#include <cmath>

Globe::Globe(int pointCount, float radius)
    : pointCount(pointCount), radius(radius), rotation(0.0f) {
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

    // simple random activation for "Lofi" aesthetic
    if (GetRandomValue(0, 100) < 5) { // 5% chance
      point.color = RED;
      point.active = true;
    } else {
      point.color = DARKGRAY;
      point.active = false;
    }

    points.push_back(point);
  }
}

void Globe::Update() { rotation += 0.2f; }

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
