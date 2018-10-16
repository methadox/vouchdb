/**
 * @typedef {Object} MemoryNode~writeParameters
 *
 * @property {Buffer} keyspace - The keyspace into which to write the key-value pair.
 * @property {Buffer} key - The key whose value to write.
 * @property {Buffer} value - The value to write for the given key.
 * @property {Buffer} parentVersion - The version of the previous key-value pair.
 * @property {Buffer} iv - The initialization vector used for the signature.
 * @property {Buffer} signature - The HMAC-SHA256 result of the IV, keyspace, key, SHA256 hash of the value, and parent version, using the private key of the keyspace's public key.
 */

/**
 * @typedef {Object} MemoryNode~readParameters
 *
 * @property {string} key - The key whose value to read.
 */

class MemoryNode {
  constructor() {
    this.peers = [];
    this.store = {};
  }

  /**
   * We are being asked directly to connect to a peer.
   *
   * @param {MemoryNode} peer - The peer to which we want to connect.
   *
   * @returns {void}
   */
  connect(peer) {
    if (peer === this) {
      // Nothing to do.
      return;
    }

    // Add the peer to our roster.
    this.peers.push(peer);

    // Let the peer know we would like to connect.
    peer.onConnect(this);
  }

  /**
   * We are being asked directly to disconnect from a peer.
   *
   * @param {MemoryNode} peer - The peer from which we want to disconnect.
   *
   * @returns {void}
   */
  disconnect(peer) {
    if (peer === this) {
      // Nothing to do.
      return;
    }

    const index = this.peers.findIndex((p) => p === peer);

    if (index < 0) {
      // Nothing to do.
      return;
    }

    // Remove the peer from our roster.
    this.peers.splice(index, 1);

    // Let the peer know we would like to disconnect.
    peer.onDisconnect(this);
  }

  /**
   * A peer wants to connect to us.
   *
   * @param {MemoryNode} peer - The peer requesting to connect.
   *
   * @returns {void}
   */
  onConnect(peer) {
    // Add the peer to our roster.
    this.peers.push(peer);
  }

  /**
   * A peer wants to disconnect from us.
   *
   * @param {MemoryNode} peer - The peer requesting to disconnect.
   *
   * @returns {void}
   */
  onDisconnect(peer) {
    const index = this.peers.findIndex((p) => p === peer);

    if (index < 0) {
      // Nothing to do.
      return;
    }

    // Remove the peer from our roster.
    this.peers.splice(index, 1);
  }

  /**
   * A peer is asking us for the value of a given key.
   *
   * @param {MemoryNode} peer - The peer attempting to read a value.
   * @param {string} key - The key whose value the peer is requesting.
   *
   * @returns {void}
   */
  onRead(peer, key) {
    const { store: { [key]: value } } = this;

    if (typeof value === 'undefined') {
      // We don't have this value locally. Fetch the value from our other peers.
      const otherPeers = this.peers.filter((p) => p !== peer);
      for (const otherPeer of otherPeers) {
        otherPeer.onRead(this, key);
      }
    }

    // Read the value again once all peers have had a chance to respond.
    const { store: { [key]: nextValue } } = this;

    if (typeof nextValue === 'undefined') {
      // Nothing to do.
      return;
    }

    // We have the value locally now. Write it to the requesting peer.
    peer.onWrite(this, key, nextValue);
  }

  /**
   * A peer is asking us to write a key-value pair.
   *
   * @param {MemoryNode} peer - The peer attempting to write a value.
   * @param {string} key - The key whose value the peer is attempting to write.
   * @param {string} value - The value to be written.
   *
   * @returns {void}
   */
  onWrite(peer, key, value) {
    const { store: { [key]: previousValue } } = this;

    if (value === previousValue) {
      // Nothing to do.
      return;
    }

    // Store the new key-value pair.
    this.store[key] = value;

    // Broadcast this change to all our other peers.
    const otherPeers = this.peers.filter((p) => p !== peer);
    for (const otherPeer of otherPeers) {
      otherPeer.onWrite(this, key, value);
    }
  }

  /**
   * We are being asked directly for the value of a given key.
   *
   * @param {MemoryNode~readParameters} parameters - The parameters needed to read a key-value pair.
   *
   * @returns {string} Returns the value, if present, for the given key.
   */
  read(parameters) {
    const { key } = parameters;
    const { store: { [key]: value } } = this;

    if (typeof value !== 'undefined') {
      return value;
    }

    // Request the value from all peers.
    for (const peer of this.peers) {
      peer.onRead(this, key);
    }

    // When all peers have had an opportunity to write the value back, return the result.
    return this.store[key];
  }

  /**
   * We are being asked directly to write a key-value pair.
   *
   * @param {MemoryNode~writeParameters} parameters - The parameters needed to write a key-value pair.
   *
   * @returns {void}
   */
  write(parameters) {
    const { key, value } = parameters;
    const { store: { [key]: previousValue } } = this;

    if (value === previousValue) {
      // Nothing to do.
      return;
    }

    // Store the new key-value pair.
    this.store[key] = value;

    // Broadcast this change to all our peers.
    for (const peer of this.peers) {
      peer.onWrite(this, key, value);
    }
  }
}

export default MemoryNode;
