package mock.java.producer;

import java.util.HashMap;
import java.util.Map;
import java.util.Properties;
import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.ProducerRecord;

public class Producer {

  private static Map<Properties, Producer> instances = new HashMap<Properties, Producer>();

  private KafkaProducer<String, String> producer;
  private String topic;
  private String producerId;

  private Producer(Properties props, String topic, String producerId) {

    this.producer = new KafkaProducer<>(props);
    this.topic = topic;
    this.producerId = producerId;
  }

  public void send(String data) {
    ProducerRecord<String, String> rec =
        new ProducerRecord<>(topic, producerId, String.format("%s", data));
    this.producer.send(rec);
  }

  public void close() {
    this.producer.close();
  }

  public static Producer getInstance(String[] brokers, String topic, String producerId) {

    Properties props = new Properties();
    props.put("bootstrap.servers", String.join(",", brokers));
    props.put("key.serializer", "org.apache.kafka.common.serialization.StringSerializer");
    props.put("value.serializer", "org.apache.kafka.common.serialization.StringSerializer");
    if (instances.get(props) == null) {
      instances.put(props, new Producer(props, topic, producerId));
    }
    return instances.get(props);
  }
}
