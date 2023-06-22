This directory contains the set of Kafka scripts used in the Kafka quickstart. Some minor changes were made to the Kafka Bash startup scripts so they run in a POSIX environment - mostly focused in `kafka-run-class.sh`.

Not all functions are tested, and the consumer/producer scripts are unlikely to work - IBM has noted they fail in a USS environment and I confirmed they hang (root cause unknown).

Ideally, these changes could be upstreamed to the Kafka project. There is an existing open issue in Kafka, [KAFKA-8610](https://issues.apache.org/jira/browse/KAFKA-8610), which tracks 