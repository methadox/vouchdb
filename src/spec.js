import { describe, expect, it, spy, stub } from './spec.helpers';

import VouchDB from '.';

const key = 'color';
const value = 'purple';

describe('VouchDB', () => {
  describe('#connect()', () => {
    it('does not throw an error when attempting to connect to itself', () => {
      const node = new VouchDB();
      const peer = node;

      node.connect({ peer });

      expect(() => peer.connect({ peer: node })).not.to.throw(Error);
    });

    it('does not throw an error when attempting to connect to an already connected peer', () => {
      const node = new VouchDB();
      const peer = new VouchDB();

      node.connect({ peer });

      expect(() => peer.connect({ peer: node })).not.to.throw(Error);
    });
  });

  describe('#disconnect()', () => {
    it('does not throw an error when attempting to disconnect from itself', () => {
      const node = new VouchDB();
      const peer = node;

      expect(() => node.disconnect({ peer })).not.to.throw(Error);
    });

    it('does not throw an error when attempting to disconnect from an already disconnectd peer', () => {
      const node = new VouchDB();
      const peer = new VouchDB();

      node.disconnect({ peer });

      expect(() => node.disconnect({ peer })).not.to.throw(Error);
    });

    it('does not throw an error when attempting to disconnect from a half-open connection', () => {
      const node = new VouchDB();
      const peer = new VouchDB();

      node.connect({ peer });

      // This scenario is much more likely to occur in a real network than in-memory, but let's simulate it.
      stub(node, 'onDisconnect');
      peer.disconnect({ peer: node });
      node.onDisconnect.restore();

      expect(() => node.disconnect({ peer })).not.to.throw(Error);
    });
  });

  describe('#write()', () => {
    it('does not broadcast to its peers if the value is unchanged', () => {
      const node = new VouchDB();
      const peer = new VouchDB();

      node.connect({ peer });
      node.write({ key, value });
      spy(peer, 'write');
      node.write({ key, value });

      expect(peer.write).not.to.have.been.called;
    });
  });

  describe('scenarios', () => {
    describe('single node', () => {
      it('writes a key-value pair without error', () => {
        const node = new VouchDB();

        expect(() => node.write({ key, value })).not.to.throw(Error);
      });

      it('reads the value of an existing key-value pair', () => {
        const node = new VouchDB();

        node.write({ key, value });

        expect(node.read({ key })).to.equal(value);
      });

      it('reads the value of an unknown key-value pair as undefined', () => {
        const node = new VouchDB();

        expect(node.read({ key })).to.be.undefined;
      });
    });

    describe('two directly connected nodes', () => {
      it('reads the value of a locally unknown key-value pair from its peer', () => {
        const node = new VouchDB();
        const peer = new VouchDB();

        peer.write({ key, value });

        node.connect({ peer });

        expect(node.read({ key })).to.equal(value);
      });

      it('reads the value of a universally unknown key-value pair as undefined', () => {
        const node = new VouchDB();
        const peer = new VouchDB();

        node.connect({ peer });

        expect(node.read({ key })).to.be.undefined;
      });

      it('reads the value of a previously fetched key-value pair even after disconnecting', () => {
        const node = new VouchDB();
        const peer = new VouchDB();

        peer.write({ key, value });
        node.connect({ peer });
        node.read({ key });
        node.disconnect({ peer });

        expect(node.read({ key })).to.equal(value);
      });

      it('reads the value of a locally unknown key-value pair as undefined if fetched after disconnecting from a peer to which the value is known', () => {
        const node = new VouchDB();
        const peer = new VouchDB();

        peer.write({ key, value });
        node.connect({ peer });
        node.disconnect({ peer });

        expect(node.read({ key })).to.be.undefined;
      });
    });

    describe('two indirectly connected nodes', () => {
      it('reads the value of a locally unknown key-value pair from a peer more than one hop away', () => {
        const node = new VouchDB();
        const bridge = new VouchDB();
        const peer = new VouchDB();

        peer.write({ key, value });

        node.connect({ peer: bridge });
        peer.connect({ peer: bridge });

        expect(node.read({ key })).to.equal(value);
      });

      it('reads the value of a universally unknown key-value pair as undefined', () => {
        const node = new VouchDB();
        const bridge = new VouchDB();
        const peer = new VouchDB();

        node.connect({ peer: bridge });
        peer.connect({ peer: bridge });

        expect(node.read({ key })).to.be.undefined;
      });
    });
  });
});
