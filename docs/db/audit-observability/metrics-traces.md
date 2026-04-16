# Metrics and Traces

## Candidate Tables

- `metric_samples`
- `metric_rollups`
- `trace_spans`
- `trace_sessions`
- `incident_events`

## Notes

- High-volume telemetry may be summarized rather than stored at raw resolution forever.
- Trace and metric rows should be linked by stable correlation keys where possible.
