#include "DataLoader.h"
#include <fstream>
#include <iostream>
#include <nlohmann/json.hpp>

using json = nlohmann::json;

std::vector<StreamData> DataLoader::LoadStreams(const std::string &filePath) {
  std::vector<StreamData> streams;
  std::ifstream file(filePath);

  if (!file.is_open()) {
    std::cerr << "Failed to open data file: " << filePath << std::endl;
    return streams;
  }

  try {
    json j;
    file >> j;

    for (const auto &item : j) {
      StreamData stream;
      stream.title = item.value("title", "Unknown");
      stream.country = item.value("country", "Unknown");
      stream.city = item.value("city", "Unknown");
      stream.latitude = item.value("latitude", 0.0f);
      stream.longitude = item.value("longitude", 0.0f);
      stream.url = item.value("url", "");

      streams.push_back(stream);
    }
  } catch (const std::exception &e) {
    std::cerr << "JSON parsing error: " << e.what() << std::endl;
  }

  return streams;
}
