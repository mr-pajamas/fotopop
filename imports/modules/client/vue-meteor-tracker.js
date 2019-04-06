import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import attempt from 'lodash/attempt';
import isObject from 'lodash/isObject';
import pull from 'lodash/pull';

export default {
  install(Vue) {
    function warn(msg, vm) {
      const { warnHandler, silent } = Vue.config;
      if (warnHandler) {
        warnHandler.call(null, msg, vm, '');
      } else if (!silent) {
        console.error(`[Vue warn]: ${msg}`);
      }
    }

    function getResult(result) {
      const fetched = result && typeof result.fetch === 'function'
        ? result.fetch()
        : result;

      return Object.freeze(fetched);
    }
    /*
    function defineMeteorData(vm, key) {
      Object.defineProperty(vm, key, {
        enumerable: true,
        configurable: true,
        get() {
          return vm.$meteorData[key];
        },
        set() {
          warn(`Meteor data property "${key}" has no setter.`, vm);
        },
      });
    }
    */

    Vue.config.optionMergeStrategies.meteor = Vue.config.optionMergeStrategies.computed;

    Vue.mixin({
      data() {
        return {
          $meteor: {},
          $subReady: {},
        };
      },
      beforeCreate() {
        this._meteor = {
          handles: [],
          subs: Object.create(null),
          subAutoruns: Object.create(null),
        };
        /*
        this.$meteorData = Vue.observable({});
        this.$meteorSubs = Vue.observable({});
        */
        Object.defineProperty(this, '$meteor', {
          get: () => this.$data.$meteor,
          set: () => warn('Vue instance property "$meteor" has no setter.', this),
          enumerable: true,
          configurable: true,
        });
        Object.defineProperty(this, '$subReady', {
          get: () => this.$data.$subReady,
          set: () => warn('Vue instance property "$subReady" has no setter.', this),
          enumerable: true,
          configurable: true,
        });
      },
      created() {
        const meteorOptions = this.$options.meteor;
        if (meteorOptions) {
          Object.entries(meteorOptions).forEach(([key, def]) => {
            let getter = typeof def === 'function' && def;
            if (!getter) {
              warn(`Getter is missing for meteor data property "${key}".`, this);
              getter = () => {};
            }

            const dep = Vue.observable({ run: Symbol(null) });

            let computation;

            this.$watch(function () {
              return {
                run: dep.run,
                result: getter.call(this),
              };
            }, function ({ run, result }, { run: oldRun }) {
              if (run === oldRun) {
                computation.invalidate();
              } else {
                Vue.set(this.$meteor, key, getResult(result));
              }
            }, {
              sync: true,
            });

            computation = this.$autorun(() => {
              // if (c.firstRun) computation = c;
              dep.run = Symbol(null);
            });

            /*
            if (Reflect.has(this, key)) {
              if (Reflect.has(this.$data, key)) {
                warn(`The meteor data property "${key}" is already defined in data.`, this);
              } else if (this.$options.props && Reflect.has(this.$options.props, key)) {
                warn(`The meteor data property "${key}" is already defined as a prop.`, this);
              } else if (this.$options.computed && Reflect.has(this.$options.computed, key)) {
                warn(`The meteor data property "${key}" is already defined in computed.`, this);
              } else {
                warn(`The meteor data property "${key}" is already declared in the component.`, this);
              }
            } else {
              defineMeteorData(this, key);
            }
            */
          });
        }
      },
      destroyed() {
        this._meteor.handles.forEach((handle) => {
          /*
          try {
            handle.stop();
          } catch (e) {
            warn(`Error when stopping tracker handle: ${e}.`);
          }
          */
          const error = attempt(handle.stop.bind(handle));
          if (error) warn(`Error when stopping tracker handle: ${error}.`);
        });
      },
      methods: {
        $subscribe(key, options) {
          const { name = key, args = [] } = isObject(options)
            ? options
            : { args: options };

          const { handles, subs, subAutoruns } = this._meteor;

          const oldSub = subs[key];
          const handle = Meteor.subscribe(name, args);
          handles.push(handle);
          subs[key] = handle;

          // Vue.set(this.$subReady, key, false);
          subAutoruns[key] && subAutoruns[key].stop();
          subAutoruns[key] = this.$autorun(() => {
            const ready = handle.ready();
            Vue.set(this.$subReady, key, ready);

            if (ready && oldSub) {
              this.$stopHandle(oldSub);
            }
          });

          return handle;
        },
        $autorun(func) {
          const computation = Tracker.autorun(func);
          this._meteor.handles.push(computation);
          return computation;
        },
        $stopHandle(handle) {
          handle.stop();
          pull(this._meteor.handles, handle);
        },
      },
    });
  },
};
