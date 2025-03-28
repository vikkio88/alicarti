import { nanoid } from "nanoid";
const ID_LENGTH = 5;
const id = () => nanoid(ID_LENGTH).toString();

const CLIENT_ID_PREFIX = "c_";
export function clientId() {
  return `${CLIENT_ID_PREFIX}${id()}`;
}

const TOPIC_ID_PREFIX = "t_";
export function topicId() {
  return `${TOPIC_ID_PREFIX}${id()}`;
}
