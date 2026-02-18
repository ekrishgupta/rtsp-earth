#pragma once
#include <string>
#include <vector>

struct StreamData {
  std::string title;
  std::string country;
  std::string city;
  float latitude;
  float longitude;
  std::string url;
};

class DataLoader {
public:
  static std::vector<StreamData> LoadStreams(const std::string &filePath);
};
