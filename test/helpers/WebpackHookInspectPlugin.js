const generatePlugin = (hook, inspector) => {
  return class {
    apply({ hooks }) {
      hooks[hook].tap(`HookInspectPlugin on ${hook}`, () => {
        inspector();
      });
    }
  };
};

module.exports = generatePlugin;
