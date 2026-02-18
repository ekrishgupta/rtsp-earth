#pragma once
#include "raylib.h"
#include <vector>

struct GlobePoint {
  Vector3 position;
  Color color;
  bool active;
};

class Globe {
public:
  Globe(int pointCount, float radius);
  ~Globe();

  void Update();
  void Draw();

private:
  std::vector<GlobePoint> points;
  float radius;
  int pointCount;
  float rotation;

  void GeneratePoints();
};
