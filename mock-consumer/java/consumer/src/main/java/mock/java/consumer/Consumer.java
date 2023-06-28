package mock.java.consumer;

import java.time.Duration;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.clients.consumer.ConsumerRecords;
import org.apache.kafka.clients.consumer.KafkaConsumer;

public class Consumer {

  private static Map<Properties, Consumer> instances = new HashMap<>();

  private KafkaConsumer<String, String> consumer;
  private String topic;
  private String consumerId;

  private Consumer(Properties props, String topic, String consumerId, boolean fromBeginning) {

    this.consumer = new KafkaConsumer<>(props);
    this.consumer.subscribe(Arrays.asList(topic));
    this.consumerId = consumerId;
    if (fromBeginning) {
      this.consumer.poll(0); // might be required to get an assignment?
      this.consumer.assignment().forEach(t -> this.consumer.seek(t, 0));
      // this.consumer.seekToBeginning(this.consumer.assignment());   This did not work??
    }
  }

  /** Blocks and consumes messages from a topic. */
  public void listen() {
    while (true) {
      ConsumerRecords<String, String> recs = consumer.poll(Duration.ofMillis(500));
      for (ConsumerRecord<String, String> record : recs) {
        System.out.println(record.value());
      }
    }
  }

  public void close() {
    this.consumer.close();
  }

  public static Consumer getInstance(
      String[] brokers, String topic, String consumerId, boolean fromBeginning) {

    Properties props = new Properties();
    props.put("bootstrap.servers", String.join(",", brokers));
    props.put("key.deserializer", "org.apache.kafka.common.serialization.StringDeserializer");
    props.put("value.deserializer", "org.apache.kafka.common.serialization.StringDeserializer");
    props.put("group.id", consumerId);
    props.put("enable.auto.commit", "true");

    if (instances.get(props) == null) {
      instances.put(props, new Consumer(props, topic, consumerId, fromBeginning));
    }

    return instances.get(props);
  }
}
