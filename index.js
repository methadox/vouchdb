const { default: MemoryNode } = require('./lib/memory-node');

const peers = {
  alice: new MemoryNode(),
  bob: new MemoryNode(),
  charlie: new MemoryNode(),
  david: new MemoryNode()
};

console.log('Alice, Bob, Charlie, and David are all disconnected.');

peers.alice.write({ key: 'color', value: 'yellow' });
console.log('Alice knows the color:', peers.alice.read({ key: 'color' }));
console.log('David does not know the color:', peers.david.read({ key: 'color' }));

peers.david.write({ key: 'shape', value: 'circle' });
console.log('Alice does not know the shape:', peers.alice.read({ key: 'shape' }));
console.log('David knows the shape:', peers.david.read({ key: 'shape' }));

peers.alice.connect(peers.bob);
console.log('Alice is now connected to Bob.');

peers.bob.connect(peers.charlie);
console.log('Bob is now connected to Charlie.');

peers.charlie.connect(peers.david);
console.log('Charlie is now connected to David.')

console.log('Alice now knows the shape:', peers.alice.read({ key: 'shape' }));
console.log('David now knows the color:', peers.david.read({ key: 'color' }));

peers.charlie.write({ key: 'color', value: 'green' });
console.log('Charlie changes the color:', peers.charlie.read({ key: 'color' }));
console.log('Alice knows the new color:', peers.alice.read({ key: 'color' }));
console.log('David knows the new color:', peers.david.read({ key: 'color' }));
