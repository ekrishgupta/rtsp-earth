#include "DataLoader.h"
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
  void AddStreams(const std::vector<StreamData> &streams);

private:
  std::vector<GlobePoint> points;
  float radius;
  int pointCount;
  float rotation;

  void GeneratePoints(const Image &map);
};
