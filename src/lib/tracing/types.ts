export enum ETelemetrySpanNames {
  RESPONSE_USE_CASE = "http.payload_response_usecase",
  PAYLOAD_USE_CASE = "http.payload_usecase",
  PAYLOAD_CONTROLLER = "http.payload_controller",
  ERROR_VALIDATION = "http.error_validation",
  ERROR_APP_ERROR = "http.error_app_error",
  ERROR_ZOD_ERROR = "http.error_zod_error",
  ERROR_ZOD_VALIDATION_ERROR = "http.error_zod_validation_error",
  ERROR_INTERNAL_ERROR = "http.error_internal_error",
}
