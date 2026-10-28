/* In-between Shift - Firebase reservation read utilities (stage 2) */
(function (global) {
  'use strict';
  function subscribeSettings(onSnapshot, ref, onData, onError) {
    return onSnapshot(ref, onData, onError);
  }
  function subscribeReservations(onSnapshot, ref, onData, onError) {
    return onSnapshot(ref, onData, onError);
  }
  function readSettings(snapshot, defaults) {
    return { ...defaults, ...(snapshot.exists() ? snapshot.data() : {}) };
  }
  function readReservationBlocks(snapshot) {
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() }))
      .filter(b => typeof b.date === 'string' && Number.isFinite(b.startMinute) && Number.isFinite(b.endMinute));
  }
  global.IBSReservationRead = Object.freeze({
    subscribeSettings, subscribeReservations, readSettings, readReservationBlocks
  });
})(window);
