import json
import os
from collections.abc import Iterator
from typing import Any

from confluent_kafka import Consumer, KafkaError, Producer


def _configuration() -> dict[str, object]:
    configuration: dict[str, object] = {
        "bootstrap.servers": os.getenv("KAFKA_BROKERS", "localhost:19092"),
        "client.id": "{{projectName}}",
    }
    if username := os.getenv("KAFKA_USERNAME"):
        configuration.update({
            "security.protocol": "SASL_SSL" if os.getenv("KAFKA_TLS") == "true" else "SASL_PLAINTEXT",
            "sasl.mechanism": "PLAIN",
            "sasl.username": username,
            "sasl.password": os.environ["KAFKA_PASSWORD"],
        })
    return configuration


def publish_event(key: str, payload: dict[str, Any]) -> None:
    producer = Producer(_configuration())
    producer.produce(
        os.getenv("KAFKA_TOPIC", "application-events"),
        key=key.encode(),
        value=json.dumps(payload, separators=(",", ":")).encode(),
    )
    remaining = producer.flush(10)
    if remaining:
        raise RuntimeError(f"{remaining} Kafka event(s) were not delivered")


def consume_events() -> Iterator[dict[str, Any]]:
    configuration = _configuration() | {
        "group.id": os.getenv("KAFKA_GROUP_ID", "{{projectName}}"),
        "enable.auto.commit": False,
        "auto.offset.reset": "earliest",
    }
    consumer = Consumer(configuration)
    consumer.subscribe([os.getenv("KAFKA_TOPIC", "application-events")])
    try:
        while True:
            message = consumer.poll(1.0)
            if message is None:
                continue
            if message.error():
                if message.error().code() != KafkaError._PARTITION_EOF:
                    raise RuntimeError(str(message.error()))
                continue
            yield json.loads(message.value())
            consumer.commit(message=message, asynchronous=False)
    finally:
        consumer.close()
