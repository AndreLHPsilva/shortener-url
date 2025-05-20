import { diag, DiagConsoleLogger, DiagLogLevel } from "@opentelemetry/api";
import { NodeSDK } from "@opentelemetry/sdk-node";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-grpc";
import { trace, context } from "@opentelemetry/api";
import { PrismaInstrumentation } from "@prisma/instrumentation";

diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.ERROR);

const sdk = new NodeSDK({
  serviceName: "shortener-api",
  traceExporter: new OTLPTraceExporter({
    url: `${process.env.OTEL_EXPORTER_OTLP_ENDPOINT}/v1/traces`,
    headers: {},
  }),
  instrumentations: [
    getNodeAutoInstrumentations(),
    new PrismaInstrumentation({
      ignoreSpanTypes: [
        "prisma:client:serialize",
        "prisma:client:connect",
        "prisma:engine:connect",
        "prisma:engine:connection",
        "prisma:engine:response_json_serialization",
        "prisma:engine:serialize",
      ],
    }),
  ],
});

export function setAttributeActiveSpan(name: string, payload: any) {
  const span = trace.getSpan(context.active());

  span?.setAttribute(name, JSON.stringify(payload));
}

process.on("beforeExit", async () => {
  await sdk.shutdown();
});

export const initalizeTracing = async () => {
  try {
    return sdk.start();
  } catch (err) {
    console.log("Error: Initialize Tracing");
    console.error(err);
    process.exit(1);
  }
};
