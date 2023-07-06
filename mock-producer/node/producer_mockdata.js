const { Kafka } = require('kafkajs')

/* 
   A very simple Kafka producer which sends messages per the mock data format. See (../../mock-data/mock_data.txt)

*/
const fs = require('fs');
const brokers = ['localhost:9092'];
const clientId = 'producer-demo'
const topic = 'demo-topic';

const processData = async (dataFeedFile) => {
    if (!fs.statSync(dataFeedFile).isFile()) {
        throw new Error(`Could not stat the data feed file ${dataFeedFile}`);
    }

    const fileData = fs.readFileSync(dataFeedFile).toString();
    const cleanedData = fileData.split('\n').filter(item => { 
        return (!item.startsWith('#') && !item.trim().length == 0)
    })

    const dataEntries = [];

    for (let i  = 0 ; i < cleanedData.length; i+=3) {
        const topicName = cleanedData[i];
        const data = cleanedData[i+1].split(",");
        const timeInterval = cleanedData[i+2].split(",").map((time) => new Number(time));
        
        if (timeInterval.length !== 1 && data.length !== timeInterval.length) {
            throw new Error("The time interval format is incorrect. It must be a single value, or match the number of data entries.");
        }

        if (timeInterval.length > 1) {
            for (let i = 1; i < timeInterval.length; i++) {
                if (timeInterval[i] < timeInterval[i-1]) {
                    throw new Error(`Time entries must be in ascending order. See ${JSON.stringify(time)}.`)
                }
            }
        }

       dataEntries.push({
        "topic": topicName,
        "data": data,
        "time": timeInterval
       })

    }

    return dataEntries;

}

const sendMockData = async (fullMockData) => {
    process.env['KAFKAJS_NO_PARTITIONER_WARNING'] = '1'

    const promises = [];
    const sleep = ms => new Promise(r => setTimeout(r, ms));

    fullMockData.forEach((mockData, index) => {

    
        promises.push(new Promise(async (resolve) => {

            const topic = mockData.topic;
            const data = mockData.data;
            const time = mockData.time;

            const kafka = new Kafka({
                clientId: `${clientId}-topic` ,
                brokers: brokers,
            })
            console.log(`Beginning producer for data stream ${index}, topic ${topic}.`);

            const producer = kafka.producer({
                
            })
            await producer.connect();

            for (let i=0; i < data.length; i++) {
                if (time.length > 1){
                    let sleepDur = time[i] - ((i > 0) ? time[i-1] : 0);

                    await sleep(sleepDur * 1000);
                } else {
                    await sleep(time[0] * 1000);
                }

                await producer.send({
                    topic:  topic,
                    messages: [{
                        value: data[i]
                    }]
                })
            }

            await producer.disconnect()
            console.log(`Ended producer for data stream ${index}, topic ${topic}.`);
            resolve()
        }))
    })
    await Promise.all(promises);
 
}


require('yargs').scriptName('kafka-mockdata-producer')
    .command({
        command: '$0 pub',
        desc: 'Publish mock data to a Kafka broker',
        builder: yargs => {
            yargs.demandOption('data-feed', 'File path to the mock data feed');
        },
        handler: async function(argv) {
            const data =  await processData(argv['data-feed']);
            await sendMockData(data);
            console.log("Done sending data!");
        }
    })
    .help()
    .argv;
