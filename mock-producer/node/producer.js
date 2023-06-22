const { Kafka } = require('kafkajs')

/* 
   A very simple Kafka producer capable of sending messages to a broker in the format of { job: "<job>", rc: "<rc>"}

    Invoke this through command line - `node producer.js pub --job MYJOB --rc 4` 
*/

const brokers = ['localhost:9092'];
const clientId = 'producer-demo'
const topic = 'demo-topic';

require('yargs').scriptName('kafka-producer').usage('$0 <cmd> args')
    .command('pub', 'produce a job with rc', (yargs) => {
        yargs.positional('job', {
            type: 'string'
        })
        yargs.positional('rc', {
            type: 'string'
        })
    }, async function(argv) {

        process.env['KAFKAJS_NO_PARTITIONER_WARNING'] = '1'
        const jobName = argv.job;
        const rcVal = argv.rc;
        const kafka = new Kafka({
            clientId: clientId,
            brokers: brokers,
        })
        console.log(`Producing ${jobName} with rc=${rcVal}`)
        const producer = kafka.producer()
        await producer.connect();
        await producer.send({
            topic:  topic,
            messages: [{
                value: JSON.stringify({ job: jobName, rc: rcVal})
            }]
        })
        await producer.disconnect()
    }).help().argv

