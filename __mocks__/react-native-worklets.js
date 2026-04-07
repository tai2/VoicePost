const ID = (v) => v;

module.exports = {
  createSerializable: ID,
  makeShareable: ID,
  isWorkletFunction: () => false,
  runOnUI: ID,
  runOnUISync: ID,
  runOnJS: ID,
  scheduleOnUI: ID,
  callMicrotasks: ID,
  RuntimeKind: { UI: "UI", JS: "JS" },
  WorkletsModule: {},
  serializableMappingCache: new Map(),
};
