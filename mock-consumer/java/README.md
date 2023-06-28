To build this project, issue the following from the project root:

* ./gradle/bootstrap/bootstrap_gradlew.sh
* ./gradle build shadowJar

This project uses Gradle 8.x and produces Java binaries for Java 8.

After executing the above build commands, to run the project:

* ./consumer/build/libs/consumer-all.jar 
  - Listens for new messages and prints to console
* ./consumer/build/libs/consumer-all.jar --from-beginning
  - Receives all messages from topic offset 0 and prints them to console.

This project listens for Kafka messages to the topic 'demo-topic' using a Kafka broker addressable on localhost:9092. Connect the local address to a remote Kafka by tunneling with `ssh -L`.

