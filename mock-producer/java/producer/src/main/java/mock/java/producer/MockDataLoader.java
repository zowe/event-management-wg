package mock.java.producer;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

public class MockDataLoader {

  private List<MockDataEntry> mockData;

  public MockDataLoader(String mockFilePath) throws IOException {
    this.mockData = this.initData(mockFilePath);
  }

  private List<MockDataEntry> initData(String filePath) throws IOException {
    System.out.println("Loading " + filePath + "...");
    List<MockDataEntry> wipMockData = new ArrayList<>();
    List<String> lines =
        Files.lines(Paths.get(filePath))
            .filter(
                (line) -> {
                  return !line.startsWith("#") && !line.trim().isEmpty();
                })
            .collect(Collectors.toList());

    for (int i = 0; i < lines.size(); i += 3) {

      String currTopic = lines.get(i);
      String dataFeed = lines.get(i + 1);
      String interval = lines.get(i + 2);

      String[] dataItems = getDataItems(dataFeed);
      int[] intervalItems = getIntervalItems(interval);

      if (intervalItems.length > 1 && intervalItems.length != dataItems.length) {
        throw new IOException(
            "The time interval format is incorrect. It must be a single value, or match the number of data entries.",
            null);
      }

      if (intervalItems.length > 1) {
        for (int ii = 1; ii < intervalItems.length; ii++) {
          if (intervalItems[ii] < intervalItems[ii - 1]) {
            throw new IOException("Time entries must be in ascending order. See " + interval, null);
          }
        }
      }

      wipMockData.add(new MockDataEntry(currTopic, dataItems, intervalItems));
    }

    return wipMockData;
  }

  public List<MockDataEntry> getMockData() {
    return this.mockData;
  }

  private String[] getDataItems(String dataFeed) {
    String[] dataItems = dataFeed.split(",");
    return dataItems;
  }

  private int[] getIntervalItems(String intervalFeed) {
    int[] intervalItems;
    if (intervalFeed.contains(",")) {
      intervalItems =
          Arrays.stream(intervalFeed.split(",")).mapToInt(x -> Integer.parseInt(x)).toArray();
    } else {
      intervalItems = new int[] {Integer.parseInt(intervalFeed)};
    }
    return intervalItems;
  }
}
