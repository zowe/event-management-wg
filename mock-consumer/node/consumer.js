const kafka = require('kafkajs')

/* 
   A very simple Kafka consumer capable of receiving messages from a broker in the format of { job: "<job>", rc: "<rc>"}

    Invoke this with `node consumer.js`. This will run in the foreground.
*/

const consumerClientId = 'demo-consumer-client';
const consumerGroupId = 'demo-consumer-group';
const demoTopic = 'demo-topic';
const brokerList = ['localhost:9092'];


const main = async() => {
  const kafkaConn = new kafka.Kafka({
    clientId: consumerClientId,
    brokers: brokerList
  });
  const kConsumer = kafkaConn.consumer({ groupId: consumerGroupId });
  await kConsumer.connect();

  await kConsumer.subscribe({ topic: demoTopic, fromBeginning: false });
  await kConsumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const msg = JSON.parse(message.value.toString());
      console.log(`Kafka message: ${JSON.stringify(msg)}`);

      const job = msg.job;
      const rc = msg.rc;

      console.log(`Job ${job} completed with RC ${rc}`);
    }
  });
}

main()