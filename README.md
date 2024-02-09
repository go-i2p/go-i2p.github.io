# Overview of I2P For Go

A wide variety of tools exist which make it easy to use I2P as a network layer in Go applications.
These tools integrate at various levels and provide different functionality, but virtually anything is possible using I2P and Go.
Eventually, this page will serve as a website for `go-i2p`, but for now it serves to track the state of various ways of using Go to interact with I2P.

## Stuff that works:

### `net.Conn` and `net.PacketConn` interface implementations

These act as drop-in replacements for `net.Conn` and `net.PacketConn` in your code and libraries.
When used correctly, they make it easy to adapt Go applications to I2P.
All `net.Conn` and `net.PacketConn` interface implementations in Go

- [`onramp`](https://github.com/eyedeekay/onramp)
- [`goSam`](https://github.com/eyedeekay/goSam)
- [`sam3`](https://github.com/eyedeekay/sam3)

### I2PControl-RPC Libraries

- [`go-i2pcontrol`](https://github.com/eyedeekay/go-i2pcontrol)
- [`i2p-control`](https://github.com/eyedeekay/i2p-control)

### Proxies and Application-Layer Adapters

- [`sam-forwarder` an I2PTunnel-alike which accepts i2pd-style config files](https://github.com/eyedeekay/sam-forwarder)
- [`go-i2p-bt` a Bittorrent library configured using `onramp` which tracks SAMv3 development and has similar features to I2PSnark](https://github.com/eyedeekay/go-i2p-bt)

## Stuff in Progress:

 - [`go-i2p`](https://github.com/go-i2p/go-i2p)