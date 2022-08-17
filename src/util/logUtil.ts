const info = (namespace: string, message: string) => {
  console.info(`#${namespace}/[INFO] - ${message}`);
};

const error = (namespace: string, message: string) => {
  console.error(`#${namespace}/[ERROR] - ${message}`);
};

const warning = (namespace: string, message: string) => {
  console.warn(`#${namespace}/[ERROR] - ${message}`);
};

const logger = {
  info,
  error,
  warning
}

export default logger