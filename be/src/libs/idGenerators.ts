import { ulid } from "ulid";

const id = () => ulid().toString();

const CLIENT_ID_PREFIX = "c_";
export function clientId() {
  return `${CLIENT_ID_PREFIX}${id()}`;
}

const TOPIC_ID_PREFIX = "r_";
export function topicId() {
  return `${TOPIC_ID_PREFIX}${id()}`;
}
