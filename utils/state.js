const userState = new Map();

export function getState(jid) {
  return userState.get(jid) || null;
}

export function setState(jid, state) {
  userState.set(jid, state);
}

export function resetState(jid) {
  userState.delete(jid);
}