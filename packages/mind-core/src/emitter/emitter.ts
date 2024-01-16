import type {
  IEmitter,
  EventHandlerList,
  EventHandlerMap,
  EventType,
  Handler,
  WildCardEventHandlerList,
  WildcardHandler,
} from "./index.d";

/**
 * Emitter: (~200b) 事件广播
 * @name emitter
 * @returns {IEmitter}
 */
export function emitter<Events extends Record<EventType, unknown>>(
  all?: EventHandlerMap<Events>
): IEmitter<Events> {
  type GenericEventHandler = Handler<Events[keyof Events]> | WildcardHandler<Events>;
  all = all || new Map();

  return {
    /**
     * 事件名称到已注册处理程序函数的映射。
     */
    all,

    /**
     * 为给定类型注册事件处理程序。
     * @param {string|symbol} type 要侦听的事件类型，或所有事件的 '*'
     * @param {Function} handler 为响应给定事件而调用的函数
     * @memberOf emitter
     */
    on<Key extends keyof Events>(type: Key, handler: GenericEventHandler) {
      const handlers: Array<GenericEventHandler> | undefined = all!.get(type);
      if (handlers) {
        handlers.push(handler);
      } else {
        all!.set(type, [handler] as EventHandlerList<Events[keyof Events]>);
      }
    },

    /**
     * 删除给定类型的事件处理程序。
     * 如果省略了 `handler` , 则将删除给定类型的所有处理程序。
     * @param {string|symbol} type  要从中注销 `handler` 的事件类型（'*' 用于删除通配符处理程序）
     * @param {Function} [handler] 要删除的处理程序函数
     * @memberOf emitter
     */
    off<Key extends keyof Events>(type: Key, handler?: GenericEventHandler) {
      const handlers: Array<GenericEventHandler> | undefined = all!.get(type);
      if (handlers) {
        if (handler) {
          handlers.splice(handlers.indexOf(handler) >>> 0, 1);
        } else {
          all!.set(type, []);
        }
      }
    },

    /**
     * 调用给定类型的所有处理程序。
     * 如果存在，则在类型匹配的处理程序之后调用 '*' 处理程序。
     *
     * 注意：不支持手动启动 '*' 处理程序。
     *
     * @param {string|symbol} type 要调用的事件类型
     * @param {Any} [evt] 任何值（推荐使用强大的对象），传递给每个处理程序
     * @memberOf emitter
     */
    emit<Key extends keyof Events>(type: Key, evt?: Events[Key]) {
      let handlers = all!.get(type);
      if (handlers) {
        (handlers as EventHandlerList<Events[keyof Events]>).slice().map((handler) => {
          handler(evt!);
        });
      }

      handlers = all!.get("*");
      if (handlers) {
        (handlers as WildCardEventHandlerList<Events>).slice().map((handler) => {
          handler(type, evt!);
        });
      }
    },
  };
}

/**
 * 事件广播
 * 单例模式，页面生命周期内共享的事件广播
 */
export abstract class Emitter<T extends Record<EventType, unknown>> implements IEmitter<T> {
  private static instance: any;
  public all!: EventHandlerMap<T>;
  public on!: {
    <Key extends keyof T>(type: Key, handler: Handler<T[Key]>): void;
    (type: "*", handler: WildcardHandler<T>): void;
  };
  public off!: {
    <Key extends keyof T>(type: Key, handler?: Handler<T[Key]> | undefined): void;
    (type: "*", handler: WildcardHandler<T>): void;
  };
  public emit!: {
    <Key extends keyof T>(type: Key, event: T[Key]): void;
    <Key extends keyof T>(type: undefined extends T[Key] ? Key : never): void;
  };
  constructor() {
    // 单例模式
    if (Emitter.instance) {
      this.all = Emitter.instance.all;
      this.on = Emitter.instance.on;
      this.off = Emitter.instance.off;
      this.emit = Emitter.instance.emit;
    } else {
      const eventEmitter = emitter<T>();
      this.all = eventEmitter.all;
      this.on = eventEmitter.on;
      this.off = eventEmitter.off;
      this.emit = eventEmitter.emit;
      Emitter.instance = this;
    }
  }
  /** 注册事件 */
  public abstract bindEvent(): void;
  /** 解除事件 */
  public abstract unbindEvent(): void;
}
