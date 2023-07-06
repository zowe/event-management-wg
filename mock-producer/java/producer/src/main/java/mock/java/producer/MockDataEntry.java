package mock.java.producer;

public class MockDataEntry {

  private String topic;
  private String[] data;
  private int[] time;

  public MockDataEntry(String topicName, String[] dataSeries, int[] timeIntervals) {
    this.topic = topicName;
    this.data = dataSeries;
    this.time = timeIntervals;
  }

  public String getTopic() {
    return this.topic;
  }

  public String[] getData() {
    return this.data;
  }

  public int[] getTimeIntervals() {
    return this.time;
  }
}
