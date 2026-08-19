import os

from opentelemetry import trace
from opentelemetry.exporter.otlp.proto.http.trace_exporter import OTLPSpanExporter
from opentelemetry.instrumentation.django import DjangoInstrumentor
from opentelemetry.sdk.resources import SERVICE_NAME, Resource
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor

_configured = False


def configure_telemetry() -> None:
    global _configured  # noqa: PLW0603
    endpoint = os.getenv("OTEL_EXPORTER_OTLP_ENDPOINT", "")
    if _configured or not endpoint:
        return
    provider = TracerProvider(
        resource=Resource.create({SERVICE_NAME: os.getenv("OTEL_SERVICE_NAME", "{{projectName}}")})
    )
    provider.add_span_processor(
        BatchSpanProcessor(OTLPSpanExporter(endpoint=f"{endpoint.rstrip('/')}/v1/traces"))
    )
    trace.set_tracer_provider(provider)
    DjangoInstrumentor().instrument()
    _configured = True
