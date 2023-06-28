const kafka = require('kafkajs')

/* 
   A very simple Kafka consumer capable of receiving messages from a broker in the format of { job: "<job>", rc: "<rc>"}

    Invoke this with `node consumer.js`. This will run in the foreground.
*/

const consumerClientId = 'demo-consumer-clients';
const consumerGroupId = 'demo-consumer-groups';
const demoTopic = 'demo-topic';
const brokerList = ['localhost:9092'];


const main = async() => {
  const kafkaConn = new kafka.Kafka({
    clientId: 'new-client',
    brokers: brokerList
  });
  const kConsumer = kafkaConn.consumer({ groupId: consumerGroupId });
  await kConsumer.connect();

  await kConsumer.subscribe({ clientId: consumerClientId, topic: demoTopic, fromBeginning: false });
  await kConsumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log(`Kafka message: ${message.value}`);

      const msg = JSON.parse(message.value.toString());

      const job = msg.job;
      const rc = msg.rc;

      console.log(`Job ${job} completed with RC ${rc}`);
    }
  });
}

main()