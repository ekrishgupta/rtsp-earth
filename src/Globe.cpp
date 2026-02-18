#include "Globe.h"
#include <cmath>

Globe::Globe(int pointCount, float radius)
    : pointCount(pointCount), radius(radius) {
  GeneratePoints();
}

Globe::~Globe() { points.clear(); }

void Globe::GeneratePoints() {
  // TODO: Implement Fibonacci Sphere algorithm
}

void Globe::Update() {
  // TODO: Animation logic
}

void Globe::Draw() {
  // TODO: Rendering logic
}
