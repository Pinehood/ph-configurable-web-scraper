import { CommonConstants } from "@/common/enums";

export default () => ({
  NODE_ENV: process.env.NODE_ENV,
  SWAGGER_USE_METADATA_FILE:
    process.env.SWAGGER_USE_METADATA_FILE === CommonConstants.TRUE_STRING,
  SECRET_KEYS: process.env.SECRET_KEYS.split(","),
});
