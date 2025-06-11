import mitt from "mitt";

type Events = {
  logout: void;
};

export const eventEmitter = mitt<Events>();
