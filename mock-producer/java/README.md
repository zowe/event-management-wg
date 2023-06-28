To build this project, issue the following from the project root:

* ./gradle/bootstrap/bootstrap_gradlew.sh
* ./gradle build shadowJar

This project uses Gradle 8.x and produces Java binaries for Java 8.

After executing the above build commands, to run the project:

* ./producer/build/libs/producer-all.jar --job <MOCKJOB> --rc <rc_number>

This project produces a Kafka message to the topic 'demo-topic' using a Kafka broker addressable on localhost:9092. Connect the local address to a remote Kafka by forwarding traffic with `ssh -L`.

